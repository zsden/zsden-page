import { Elysia, t } from 'elysia'
import { prisma } from '../lib/prisma'
import {
  getAllPosts,
  getPostBySlug,
  markdownToHtml,
  getAllTags,
  getAllCategories,
  getPostsByTag,
  getPostsByCategory
} from '../lib/markdown'
import { PostStatus } from '@prisma/client'

export const postsRoute = new Elysia({ prefix: '/api/posts' })
  .get('/', async () => {
    const posts = await getAllPosts()
    const postsWithData = []

    for (const post of posts) {
      // 检查数据库中是否已有该文章记录
      const dbPost = await prisma.post.findUnique({
        where: { slug: post.slug },
        include: {
          tags: {
            include: {
              tag: true
            }
          },
          categories: {
            include: {
              category: true
            }
          }
        }
      })

      if (dbPost) {
        // 更新文章信息
        await prisma.post.update({
          where: { slug: post.slug },
          data: {
            title: post.title,
            description: post.description || ''
          }
        })

        postsWithData.push({
          id: dbPost.id,
          slug: dbPost.slug,
          title: dbPost.title,
          description: dbPost.description,
          author: dbPost.author,
          status: dbPost.status,
          viewCount: dbPost.viewCount,
          createdAt: dbPost.createdAt,
          updatedAt: dbPost.updatedAt,
          tags: dbPost.tags.map(pt => pt.tag.name),
          categories: dbPost.categories.map(pc => pc.category.name)
        })
      } else {
        // 创建新记录
        const newPost = await prisma.post.create({
          data: {
            slug: post.slug,
            title: post.title,
            description: post.description || '',
            contentPath: post.slug,
            author: post.author || 'zsden',
            status: post.status === 'DRAFT' ? PostStatus.DRAFT : PostStatus.PUBLISHED
          }
        })

        // 处理标签
        if (post.tags && post.tags.length > 0) {
          for (const tagName of post.tags) {
            const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
            let tag = await prisma.tag.findUnique({
              where: { slug: tagSlug }
            })

            if (!tag) {
              tag = await prisma.tag.create({
                data: {
                  name: tagName,
                  slug: tagSlug
                }
              })
            }

            // 创建文章-标签关联
            await prisma.postTag.create({
              data: {
                postId: newPost.id,
                tagId: tag.id
              }
            })
          }
        }

        // 处理分类
        if (post.categories && post.categories.length > 0) {
          for (const categoryName of post.categories) {
            const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-')
            let category = await prisma.category.findUnique({
              where: { slug: categorySlug }
            })

            if (!category) {
              category = await prisma.category.create({
                data: {
                  name: categoryName,
                  slug: categorySlug
                }
              })
            }

            // 创建文章-分类关联
            await prisma.postCategory.create({
              data: {
                postId: newPost.id,
                categoryId: category.id
              }
            })
          }
        }

        postsWithData.push({
          id: newPost.id,
          slug: newPost.slug,
          title: newPost.title,
          description: newPost.description,
          author: newPost.author,
          status: newPost.status,
          viewCount: newPost.viewCount,
          createdAt: newPost.createdAt,
          updatedAt: newPost.updatedAt,
          tags: post.tags || [],
          categories: post.categories || []
        })
      }
    }

    return postsWithData.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  .get('/*', async ({ params, set, headers, path }) => {
    // 使用 path 属性获取完整的路径
    const slug = path.replace('/api/posts/', '')
    const post = await getPostBySlug(slug)

    if (!post) {
      set.status = 404
      return { error: 'Post not found' }
    }

    // 检查文章状态
    const dbPost = await prisma.post.findUnique({
      where: { slug }
    })

    if (!dbPost || dbPost.status === PostStatus.DRAFT) {
      set.status = 404
      return { error: 'Post not found' }
    }

    // 记录访问日志
    const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || '127.0.0.1'
    const userAgent = headers['user-agent'] || 'Unknown'

    await prisma.viewLog.create({
      data: {
        postId: dbPost.id,
        ipAddress: Array.isArray(ip) ? ip[0] : ip,
        userAgent: Array.isArray(userAgent) ? userAgent[0] : userAgent
      }
    })

    // 更新浏览次数
    await prisma.post.update({
      where: { id: dbPost.id },
      data: {
        viewCount: dbPost.viewCount + 1
      }
    })

    const html = await markdownToHtml(post.content)

    return {
      slug,
      frontmatter: post.frontmatter,
      content: html,
      viewCount: dbPost.viewCount + 1
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

export const metaRoute = new Elysia({ prefix: '/api' })
  .get('/tags', async () => {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' }
    })
    return tags.map(tag => tag.name)
  })

  .get('/categories', async () => {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    return categories.map(category => category.name)
  })

  .get('/stats', async () => {
    const [postsCount, tagsCount, categoriesCount, totalViews] = await Promise.all([
      prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
      prisma.tag.count(),
      prisma.category.count(),
      prisma.post.aggregate({
        _sum: {
          viewCount: true
        }
      })
    ])

    return {
      posts: postsCount,
      tags: tagsCount,
      categories: categoriesCount,
      views: totalViews._sum.viewCount || 0
    }
  })