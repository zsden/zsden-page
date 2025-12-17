import type { VercelRequest, VercelResponse } from '@vercel/node'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import path from 'path'
import fs from 'fs/promises'

const postsDirectory = path.join(process.cwd(), 'posts')

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, query } = req

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Get all posts
    if (req.url?.includes('/api/posts') && !query.slug && !query.tag && !query.category) {
      const slugs = await getAllPostSlugs()
      const posts = await Promise.all(slugs.map(slug => getPostBySlug(slug)))
      const publishedPosts = posts.filter(post => post && post.frontmatter.status === 'PUBLISHED')

      const formattedPosts = publishedPosts.map((post) => {
        if (!post) return null
        return {
          slug: post.slug,
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          author: post.frontmatter.author || 'zsden',
          status: post.frontmatter.status,
          tags: post.frontmatter.tags || [],
          categories: post.frontmatter.categories || [],
          date: post.frontmatter.date,
          createdAt: post.frontmatter.date ? new Date(post.frontmatter.date).toISOString() : null,
          updatedAt: post.frontmatter.date ? new Date(post.frontmatter.date).toISOString() : null,
          viewCount: 0
        }
      }).filter((post): post is NonNullable<typeof post> => post !== null).sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        return b.slug.localeCompare(a.slug)
      })

      res.json(formattedPosts)
      return
    }

    // Get single post
    if (query.slug) {
      const post = await getPostBySlug(query.slug as string)
      if (!post || post.frontmatter.status !== 'PUBLISHED') {
        res.status(404).json({ error: 'Post not found' })
        return
      }

      const html = await markdownToHtml(post.content)
      const stats = await fs.stat(post.filePath)

      res.json({
        slug: post.slug,
        frontmatter: post.frontmatter,
        content: html,
        createdAt: post.frontmatter.date ? new Date(post.frontmatter.date).toISOString() : new Date(stats.birthtime || stats.ctime).toISOString(),
        updatedAt: new Date(stats.mtime).toISOString(),
        viewCount: 0
      })
      return
    }

    // Get tags
    if (req.url?.includes('/api/tags')) {
      const posts = await getAllPosts()
      const tagsSet = new Set<string>()
      posts.forEach(post => {
        if (post && post.frontmatter.tags) {
          post.frontmatter.tags.forEach((tag: string) => tagsSet.add(tag))
        }
      })
      res.json(Array.from(tagsSet))
      return
    }

    // Get categories
    if (req.url?.includes('/api/categories')) {
      const posts = await getAllPosts()
      const categoriesSet = new Set<string>()
      posts.forEach(post => {
        if (post && post.frontmatter.categories) {
          post.frontmatter.categories.forEach((category: string) => categoriesSet.add(category))
        }
      })
      res.json(Array.from(categoriesSet))
      return
    }

    // Get stats
    if (req.url?.includes('/api/stats')) {
      const posts = await getAllPosts()
      const tagsSet = new Set<string>()
      const categoriesSet = new Set<string>()

      posts.forEach(post => {
        if (post && post.frontmatter.tags) {
          post.frontmatter.tags.forEach((tag: string) => tagsSet.add(tag))
        }
        if (post && post.frontmatter.categories) {
          post.frontmatter.categories.forEach((category: string) => categoriesSet.add(category))
        }
      })

      res.json({
        posts: posts.filter(post => post && post.frontmatter.status === 'PUBLISHED').length,
        tags: tagsSet.size,
        categories: categoriesSet.size,
        views: 0
      })
      return
    }

    res.status(404).json({ error: 'Not found' })

  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// Helper functions
async function getAllPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(postsDirectory, { recursive: true })
    return files
      .filter((file): file is string => typeof file === 'string' && file.endsWith('.md'))
      .map((file: string) => file.replace(/\.md$/, '').replace(/\\/g, '/'))
  } catch {
    return []
  }
}

async function getPostBySlug(slug: string) {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = await fs.readFile(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      frontmatter: data,
      content,
      filePath: fullPath
    }
  } catch {
    return null
  }
}

async function getAllPosts() {
  const slugs = await getAllPostSlugs()
  const posts = await Promise.all(slugs.map(slug => getPostBySlug(slug)))
  return posts.filter(Boolean)
}

async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(rehypeHighlight)
    .use(html)
    .process(markdown)
  return result.toString()
}