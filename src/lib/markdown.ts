import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { format, parseISO } from 'date-fns'
import { PostFrontmatter, ParsedPost, Post } from '../types/blog'
import path from 'path'

const postsDirectory = path.join(process.cwd(), 'posts')

export async function getAllPostSlugs(): Promise<string[]> {
  const { glob } = await import('fast-glob')
  const paths = await glob('**/*.md', { cwd: postsDirectory })
  return paths.map((path: string) => path.replace(/\.md$/, ''))
}

export function getPostFilePath(slug: string): string {
  return path.join(postsDirectory, `${slug}.md`)
}

export interface DateInfo {
  year: string
  month: string
  day: string
}

export function parseSlugToDate(slug: string): DateInfo | null {
  const parts = slug.split('/')
  if (parts.length >= 2) {
    const year = parts[0]
    const month = parts[1]
    const day = parts[2] || '01'
    // 验证年份是否有效
    if (year && year.length === 4 && !isNaN(parseInt(year))) {
      return { year, month, day }
    }
  }
  return null
}

export function generateSlugFromPath(filePath: string): string {
  return filePath.replace(/\.md$/, '').replace(/\\/g, '/')
}

export async function getPostBySlug(slug: string): Promise<ParsedPost | null> {
  try {
    const fs = await import('fs/promises')
    const fullPath = getPostFilePath(slug)

    if (!(await fs.stat(fullPath)).isFile()) {
      return null
    }

    const fileContents = await fs.readFile(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // 如果没有在frontmatter中提供slug，使用路径作为slug
    if (!data.slug) {
      data.slug = slug
    }

    // 如果没有指定状态，默认为PUBLISHED
    if (!data.status) {
      data.status = 'PUBLISHED'
    }

    // 确保日期是字符串格式（gray-matter 可能会将其转换为 Date 对象）
    if (data.date && data.date instanceof Date) {
      data.date = data.date.toISOString().split('T')[0]
    }

    return {
      frontmatter: data as PostFrontmatter,
      content,
      filePath: fullPath
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(rehypeHighlight)
    .use(html, { sanitize: false })
    .process(markdown)
  return processedContent.toString()
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = await getAllPostSlugs()
  const posts: Post[] = []

  for (const slug of slugs) {
    const post = await getPostBySlug(slug)
    if (post && post.frontmatter.status !== 'DRAFT') {
      posts.push({
        slug,
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        author: post.frontmatter.author || 'zsden',
        tags: post.frontmatter.tags || [],
        categories: post.frontmatter.categories || [],
        status: post.frontmatter.status || 'PUBLISHED',
        date: post.frontmatter.date,
        content: post.content
      })
    }
  }

  return posts.sort((a, b) => {
      // 优先按 frontmatter date 排序
      if (a.date && b.date) {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          return dateB.getTime() - dateA.getTime()
        }
      }

      // 如果只有一个有 frontmatter date，有日期的排在前面
      if (a.date && !b.date) return -1
      if (!a.date && b.date) return 1

      // 尝试从 slug 解析日期
      const dateASlug = parseSlugToDate(a.slug)
      const dateBSlug = parseSlugToDate(b.slug)

      if (dateASlug && dateBSlug) {
        const dateAObj = new Date(`${dateASlug.year}-${dateASlug.month}-${dateASlug.day}`)
        const dateBObj = new Date(`${dateBSlug.year}-${dateBSlug.month}-${dateBSlug.day}`)
        if (!isNaN(dateAObj.getTime()) && !isNaN(dateBObj.getTime())) {
          return dateBObj.getTime() - dateAObj.getTime()
        }
      }

      // 如果只有一个能从 slug 解析出日期
      if (dateASlug && !dateBSlug) return -1
      if (!dateASlug && dateBSlug) return 1

      // 最后按 slug 降序排列
      return b.slug.localeCompare(a.slug)
    })
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter(post =>
    post.tags && post.tags.includes(tag)
  )
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter(post =>
    post.categories && post.categories.includes(category)
  )
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tags = new Set<string>()

  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag))
    }
  })

  return Array.from(tags).sort()
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts()
  const categories = new Set<string>()

  posts.forEach(post => {
    if (post.categories) {
      post.categories.forEach(category => categories.add(category))
    }
  })

  return Array.from(categories).sort()
}