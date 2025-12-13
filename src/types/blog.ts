export interface Post {
  id: string
  slug: string
  title: string
  description?: string
  content: string
  author: string
  tags: Tag[]
  categories: Category[]
  status: 'DRAFT' | 'PUBLISHED'
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface PostFrontmatter {
  title: string
  description?: string
  author?: string
  tags?: string[]
  categories?: string[]
  status?: 'DRAFT' | 'PUBLISHED'
  slug?: string
}

export interface ViewLog {
  id: string
  postId: string
  ip?: string
  userAgent?: string
  viewedAt: Date
}