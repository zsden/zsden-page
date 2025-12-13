import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { cors } from "@elysiajs/cors";
import { postsRoute, metaRoute } from "./routes/posts";
import { rssRoute } from "./routes/rss";

const app = new Elysia()
  .use(cors())
  .use(staticPlugin({
    assets: "public",
    prefix: "/"
  }))
  .use(postsRoute)
  .use(metaRoute)
  .use(rssRoute)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
