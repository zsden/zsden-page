import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { format } from 'date-fns'
import { PostFrontmatter } from '../types/blog'

const postsDirectory = `${process.cwd()}/posts`

export async function getAllPostSlugs() {
  const { glob } = await import('fast-glob')
  const paths = await glob('**/*.md', { cwd: postsDirectory })
  return paths.map((path: string) => path.replace(/\.md$/, ''))
}

export function getPostFilePath(slug: string) {
  return `${postsDirectory}/${slug}.md`
}

export function parseSlugToDate(slug: string) {
  const parts = slug.split('/')
  if (parts.length >= 2) {
    const year = parts[0]
    const month = parts[1]
    const day = parts[2] || '01'
    return { year, month, day }
  }
  return null
}

export function generateSlugFromPath(path: string): string {
  return path.replace(/\.md$/, '').replace(/\\/g, '/')
}

export async function getPostBySlug(slug: string) {
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

export async function markdownToHtml(markdown: string) {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .use(rehypeHighlight) // 使用默认配置
    .process(markdown)
  return processedContent.toString()
}

export async function getAllPosts() {
  const slugs = await getAllPostSlugs()
  const posts = []

  for (const slug of slugs) {
    const post = await getPostBySlug(slug)
    if (post && post.frontmatter.status !== 'DRAFT') {
      posts.push({
        slug,
        ...post.frontmatter,
        content: post.content
      })
    }
  }

  return posts.sort((a, b) => {
    const dateA = new Date(a.slug.split('/')[0] || 0)
    const dateB = new Date(b.slug.split('/')[0] || 0)
    return dateB.getTime() - dateA.getTime()
  })
}

export async function getPostsByTag(tag: string) {
  const posts = await getAllPosts()
  return posts.filter(post =>
    post.tags && post.tags.includes(tag)
  )
}

export async function getPostsByCategory(category: string) {
  const posts = await getAllPosts()
  return posts.filter(post =>
    post.categories && post.categories.includes(category)
  )
}

export async function getAllTags() {
  const posts = await getAllPosts()
  const tags = new Set<string>()

  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag))
    }
  })

  return Array.from(tags).sort()
}

export async function getAllCategories() {
  const posts = await getAllPosts()
  const categories = new Set<string>()

  posts.forEach(post => {
    if (post.categories) {
      post.categories.forEach(category => categories.add(category))
    }
  })

  return Array.from(categories).sort()
}