export interface Post {
  slug: string
  title: string
  description?: string
  content: string
  author: string
  tags: string[]
  categories: string[]
  status: 'DRAFT' | 'PUBLISHED'
  date?: string
}

export interface PostWithDates extends Post {
  createdAt?: string
  updatedAt?: string
}

export interface PostFrontmatter {
  title: string
  description?: string
  author?: string
  tags?: string[]
  categories?: string[]
  status?: 'DRAFT' | 'PUBLISHED'
  slug?: string
  date?: string
}

export interface ParsedPost {
  frontmatter: PostFrontmatter
  content: string
  filePath: string
}