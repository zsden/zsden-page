import path from 'path'
import { promises as fs } from 'fs'

const viewsDir = path.join(process.cwd(), 'data', 'views')
const viewsFile = path.join(viewsDir, 'views.json')

// 初始化视图统计目录和文件
async function ensureViewsDir() {
  try {
    await fs.mkdir(viewsDir, { recursive: true })

    // 如果视图文件不存在，创建空对象
    try {
      await fs.access(viewsFile)
    } catch {
      await fs.writeFile(viewsFile, JSON.stringify({}), 'utf8')
    }
  } catch (error) {
    console.error('Error creating views directory:', error)
  }
}

// 获取所有文章的视图统计
export async function getViews(): Promise<Record<string, number>> {
  await ensureViewsDir()

  try {
    const data = await fs.readFile(viewsFile, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading views file:', error)
    return {}
  }
}

// 获取单个文章的视图数
export async function getPostViews(slug: string): Promise<number> {
  const views = await getViews()
  return views[slug] || 0
}

// 增加文章的视图数
export async function incrementViews(slug: string): Promise<number> {
  await ensureViewsDir()

  try {
    const views = await getViews()
    views[slug] = (views[slug] || 0) + 1

    await fs.writeFile(viewsFile, JSON.stringify(views, null, 2), 'utf8')
    return views[slug]
  } catch (error) {
    console.error('Error incrementing views:', error)
    return 0
  }
}

// 设置文章的视图数
export async function setViews(slug: string, count: number): Promise<void> {
  await ensureViewsDir()

  try {
    const views = await getViews()
    views[slug] = count

    await fs.writeFile(viewsFile, JSON.stringify(views, null, 2), 'utf8')
  } catch (error) {
    console.error('Error setting views:', error)
  }
}

// 获取总浏览量
export async function getTotalViews(): Promise<number> {
  const views = await getViews()
  return Object.values(views).reduce((sum, count) => sum + count, 0)
}