import cors from '@elysiajs/cors'
import staticPlugin from '@elysiajs/static'
import { Elysia } from 'elysia'

import { metaRouteSimple, postsRouteSimple } from './routes/posts-simple'
import { rssRouteSimple } from './routes/rss-simple'

const app = new Elysia()
  .use(cors())
  .use(
    staticPlugin({
      assets: 'public',
      prefix: '/'
    })
  )
  .use(postsRouteSimple)
  .use(metaRouteSimple)
  .use(rssRouteSimple)

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000)
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
}

// Export for Vercel serverless
export default app
