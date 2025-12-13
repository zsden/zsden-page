import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { cors } from "@elysiajs/cors";
import { postsRoute, metaRoute } from "./routes/posts.js";
import { rssRoute } from "./routes/rss.js";

const app = new Elysia()
  .use(cors())
  .use(staticPlugin({
    assets: "public",
    prefix: "/"
  }))
  .use(postsRoute)
  .use(metaRoute)
  .use(rssRoute);

// Vercel Serverless Function handler
export default app.handle;

// 开发环境监听端口
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}
