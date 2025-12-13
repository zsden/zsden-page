import { Elysia } from 'elysia'
import {
  getAllPosts,
  getPostBySlug,
  markdownToHtml,
  getAllTags,
  getAllCategories,
  getPostsByTag,
  getPostsByCategory
} from '../lib/markdown.js'

export const postsRouteSimple = new Elysia({ prefix: '/api/posts' })
  .get('/', async () => {
    const posts = await getAllPosts()

    // 直接返回 Markdown 文件信息，不涉及数据库
    return posts.map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      author: post.author || 'zsden',
      status: post.status,
      createdAt: post.slug.split('/')[0] || new Date().toISOString(),
      updatedAt: post.updatedAt || post.slug.split('/')[0] || new Date().toISOString(),
      tags: post.tags || [],
      categories: post.categories || []
    })).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  .get('/*', async ({ params, set, path }) => {
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

    // 返回文章内容，不涉及数据库操作
    return {
      slug,
      frontmatter: post.frontmatter,
      content: html,
      viewCount: 0 // 模拟 viewCount，实际不从数据库读取
    }
  })

  .get('/tags/:tag', async ({ params }) => {
    const { tag } = params
    const posts = await getPostsByTag(tag)
    return posts
  })

  .get('/categories/:category', async ({ params }) => {
    const { category } = params
    const posts = await getPostsByCategory(category)
    return posts
  })

export const metaRouteSimple = new Elysia({ prefix: '/api' })
  .get('/tags', async () => {
    const tags = await getAllTags()
    return tags
  })

  .get('/categories', async () => {
    const categories = await getAllCategories()
    return categories
  })

  .get('/stats', async () => {
    const posts = await getAllPosts()
    const tags = await getAllTags()
    const categories = await getAllCategories()

    return {
      posts: posts.length,
      tags: tags.length,
      categories: categories.length,
      views: 0 // 模拟浏览量，实际不从数据库读取
    }
  })