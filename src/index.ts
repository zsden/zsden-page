import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia");

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}

// Export for Vercel serverless
export default app;
