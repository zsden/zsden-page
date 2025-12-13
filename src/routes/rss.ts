import { Elysia } from 'elysia'
import { getAllPosts, getPostBySlug, markdownToHtml } from '../lib/markdown.js'
import { format } from 'date-fns'

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'
const BLOG_TITLE = 'Zsden\'s Blog'
const BLOG_DESCRIPTION = 'A personal blog about tech and life'

async function generateRSS() {
  const posts = await getAllPosts()

  const rssItems = await Promise.all(
    posts.slice(0, 20).map(async (post) => {
      const postDetail = await getPostBySlug(post.slug)
      const htmlContent = postDetail ? await markdownToHtml(postDetail.content) : ''

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || post.title}]]></description>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid>${SITE_URL}/posts/${post.slug}</guid>
      <pubDate>${format(new Date(post.slug.split('/')[0]), 'EEE, dd MMM yyyy HH:mm:ss xx')}</pubDate>
      <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
    </item>`
    })
  )

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${BLOG_TITLE}]]></title>
    <description><![CDATA[${BLOG_DESCRIPTION}]]></description>
    <link>${SITE_URL}</link>
    <language>zh-CN</language>
    <lastBuildDate>${format(new Date(), 'EEE, dd MMM yyyy HH:mm:ss xx')}</lastBuildDate>
    <generator>Zsden Blog RSS</generator>
${rssItems.join('')}
  </channel>
</rss>`
}

export const rssRoute = new Elysia()
  .get('/rss', async ({ set }) => {
    set.headers['Content-Type'] = 'application/rss+xml; charset=utf-8'
    return await generateRSS()
  })
  .get('/feed.xml', async ({ set }) => {
    set.headers['Content-Type'] = 'application/rss+xml; charset=utf-8'
    return await generateRSS()
  })
  .get('/atom.xml', async ({ set }) => {
    const posts = await getAllPosts()

    const atomEntries = await Promise.all(
      posts.slice(0, 20).map(async (post) => {
        const postDetail = await getPostBySlug(post.slug)
        const htmlContent = postDetail ? await markdownToHtml(postDetail.content) : ''

        return `
  <entry>
    <title type="html"><![CDATA[${post.title}]]></title>
    <link href="${SITE_URL}/posts/${post.slug}" />
    <id>${SITE_URL}/posts/${post.slug}</id>
    <published>${format(new Date(post.slug.split('/')[0]), "yyyy-MM-dd'T'HH:mm:ssXX")}</published>
    <updated>${format(new Date(post.slug.split('/')[0]), "yyyy-MM-dd'T'HH:mm:ssXX")}</updated>
    <content type="html"><![CDATA[${htmlContent}]]></content>
  </entry>`
      })
    )

    const atomXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${BLOG_TITLE}</title>
  <subtitle>${BLOG_DESCRIPTION}</subtitle>
  <link href="${SITE_URL}" />
  <link href="${SITE_URL}/atom.xml" rel="self" />
  <id>${SITE_URL}</id>
  <updated>${format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXX")}</updated>
${atomEntries.join('')}
</feed>`

    set.headers['Content-Type'] = 'application/atom+xml; charset=utf-8'
    return atomXml
  })