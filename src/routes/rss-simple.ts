import { Elysia } from 'elysia'
import { getAllPosts, markdownToHtml, parseSlugToDate } from '../lib/markdown'
import { format } from 'date-fns'
import { Post } from '../types/blog'

export const rssRouteSimple = new Elysia({ prefix: '/rss' })
  .get('/', async ({ set }): Promise<string> => {
    const posts = await getAllPosts()

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'
    const siteUrl = baseUrl

    const rssItems = posts
      .filter((post: Post) => post.status === 'PUBLISHED')
      .map((post: Post) => {
        const postUrl = `${siteUrl}/posts/${post.slug}`
        let pubDate = new Date().toISOString()

        if (post.date) {
          const dateObj = new Date(post.date)
          if (!isNaN(dateObj.getTime())) {
            pubDate = dateObj.toISOString()
          }
        } else {
          const dateInfo = parseSlugToDate(post.slug)
          if (dateInfo) {
            const dateObj = new Date(`${dateInfo.year}-${dateInfo.month}-${dateInfo.day}`)
            if (!isNaN(dateObj.getTime())) {
              pubDate = dateObj.toISOString()
            }
          }
        }

        // 生成内容摘要（取前 200 字符）
        const content = post.content.replace(/[#*`\[\]]/g, '').substring(0, 200) + '...'

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || content}]]></description>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
      <author><![CDATA[${post.author || 'zsden'}]]></author>
    </item>`
      })
      .join('')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[zsden's Blog]]></title>
    <description><![CDATA[Personal blog about technology and life]]></description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss" rel="self" type="application/rss+xml" />
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`

    set.headers['Content-Type'] = 'application/xml'
    set.headers['Cache-Control'] = 'public, max-age=3600'

    return rss
  })