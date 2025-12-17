import cors from '@elysiajs/cors'
import staticPlugin from '@elysiajs/static'
import { Elysia } from 'elysia'

import { metaRouteSimple, postsRouteSimple } from './routes/posts-simple'
import { rssRouteSimple } from './routes/rss-simple'

const app = new Elysia()
  .use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
  .use(
    staticPlugin({
      assets: 'public',
      prefix: '/',
      alwaysStatic: true
    })
  )
  .use(postsRouteSimple)
  .use(metaRouteSimple)
  .use(rssRouteSimple)

// Health check endpoint
app.get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))

// Debug endpoint for Vercel deployment
app.get('/debug', async () => {
  const path = await import('path')
  return {
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      cwd: process.cwd(),
      platform: process.platform
    },
    paths: {
      postsDir: path.join(process.cwd(), 'posts'),
      dataDir: path.join(process.cwd(), 'data'),
      exists: {
        posts: await import('fs').then(fs => {
          try {
            fs.accessSync(path.join(process.cwd(), 'posts'))
            return true
          } catch {
            return false
          }
        }),
        data: await import('fs').then(fs => {
          try {
            fs.accessSync(path.join(process.cwd(), 'data'))
            return true
          } catch {
            return false
          }
        })
      }
    }
  }
})

// For local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(3000)
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
}

// Export for Vercel serverless
export default app
