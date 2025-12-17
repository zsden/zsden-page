import { Elysia } from 'elysia'
import {
  getAllPosts,
  getPostBySlug,
  markdownToHtml,
  getAllTags,
  getAllCategories,
  getPostsByTag,
  getPostsByCategory,
  parseSlugToDate,
  DateInfo
} from '../lib/markdown'
import { format, parseISO } from 'date-fns'
import { PostWithDates, Post } from '../types/blog'
import { incrementViews, getViews, getTotalViews } from '../lib/views'

// 辅助函数：格式化文章数据
async function formatPosts(posts: Post[]): Promise<PostWithDates[]> {
  const views = await getViews()

  return posts.map(post => {
    // 尝试从 frontmatter 获取日期，否则从 slug 解析
    let createdAt = null

    if (post.date && typeof post.date === 'string') {
      // 确保日期是 YYYY-MM-DD 格式
      const dateMatch = post.date.match(/^\d{4}-\d{2}-\d{2}$/)
      if (dateMatch) {
        const dateObj = new Date(post.date)
        if (!isNaN(dateObj.getTime())) {
          createdAt = dateObj.toISOString()
        }
      }
    }

    // 如果 frontmatter 没有有效日期，尝试从 slug 解析
    if (!createdAt) {
      const dateInfo = parseSlugToDate(post.slug)
      if (dateInfo) {
        const dateObj = new Date(`${dateInfo.year}-${dateInfo.month}-${dateInfo.day}`)
        if (!isNaN(dateObj.getTime())) {
          createdAt = dateObj.toISOString()
        }
      }
    }

    const result: any = {
      slug: post.slug,
      title: post.title,
      description: post.description,
      author: post.author || 'zsden',
      status: post.status,
      tags: post.tags || [],
      categories: post.categories || [],
      date: post.date
    }

    // 只有当有有效日期时才添加 createdAt 和 updatedAt
    if (createdAt) {
      result.createdAt = createdAt
      result.updatedAt = createdAt
    }

    // 添加浏览量
    result.viewCount = views[post.slug] || 0

    return result as PostWithDates
  })
}

export const postsRouteSimple = new Elysia({ prefix: '/api/posts' })
  .get('/', async (): Promise<PostWithDates[]> => {
    const posts = await getAllPosts()
    const formattedPosts = await formatPosts(posts)

    return formattedPosts.sort((a, b) => {
      // 优先按 createdAt 排序（如果有）
      if (a.createdAt && b.createdAt) {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)
        return dateB.getTime() - dateA.getTime()
      }

      // 如果只有一个有日期，有日期的排在前面
      if (a.createdAt && !b.createdAt) return -1
      if (!a.createdAt && b.createdAt) return 1

      // 如果都没有日期，按 slug 降序排列
      return b.slug.localeCompare(a.slug)
    })
  })

  .get('/*', async ({ params, set, path }): Promise<any> => {
    // 使用 path 属性获取完整的路径
    const slug = path.replace('/api/posts/', '')
    const post = await getPostBySlug(slug)

    if (!post) {
      set.status = 404
      return { error: 'Post not found' }
    }

    // 检查文章状态（从 Markdown frontmatter）
    if (post.frontmatter.status === 'DRAFT') {
      set.status = 404
      return { error: 'Post not found' }
    }

    const html = await markdownToHtml(post.content)

    // 获取文件的修改时间
    const fs = await import('fs/promises')
    const stats = await fs.stat(post.filePath)

    // 尝试从 frontmatter 获取日期，否则使用文件时间
    let createdAt = null
    let updatedAt = new Date(stats.mtime).toISOString()

    if (post.frontmatter.date) {
      const dateObj = new Date(post.frontmatter.date)
      if (!isNaN(dateObj.getTime())) {
        createdAt = dateObj.toISOString()
      }
    }

    // 如果没有 frontmatter 日期，使用文件创建时间
    if (!createdAt) {
      createdAt = new Date(stats.birthtime || stats.ctime).toISOString()
    }

    // 增加浏览量
    const viewCount = await incrementViews(slug)

    // 返回文章内容
    return {
      slug,
      frontmatter: post.frontmatter,
      content: html,
      createdAt,
      updatedAt,
      viewCount
    }
  })

  .get('/tags/:tag', async ({ params }): Promise<PostWithDates[]> => {
    const { tag } = params
    const posts = await getPostsByTag(tag)
    return await formatPosts(posts)
  })

  .get('/categories/:category', async ({ params, set }) => {
    const { category } = params

    // URL 解码
    const decodedCategory = decodeURIComponent(category)

    const posts = await getPostsByCategory(decodedCategory)

    if (posts.length === 0) {
      set.status = 404
      return { error: 'No posts found for this category' }
    }

    return await formatPosts(posts)
  })

export const metaRouteSimple = new Elysia({ prefix: '/api' })
  .get('/tags', async (): Promise<string[]> => {
    const tags = await getAllTags()
    return tags
  })

  .get('/categories', async (): Promise<string[]> => {
    const categories = await getAllCategories()
    return categories
  })

  .get('/stats', async () => {
    const posts = await getAllPosts()
    const tags = await getAllTags()
    const categories = await getAllCategories()
    const totalViews = await getTotalViews()

    return {
      posts: posts.length,
      tags: tags.length,
      categories: categories.length,
      views: totalViews
    }
  })