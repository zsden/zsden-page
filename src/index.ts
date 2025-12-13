import cors from '@elysiajs/cors'
import staticPlugin from '@elysiajs/static'
import { Elysia } from 'elysia'
// 使用不涉及数据库的路由
import { metaRouteSimple, postsRouteSimple } from './routes/posts-simple'

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

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000)
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
}

// Export for Vercel serverless
export default app
