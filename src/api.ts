// 简化的 API 入口文件，避免复杂的模块导入
export default {
  async fetch(request: Request) {
    const url = new URL(request.url)

    if (url.pathname === '/') {
      return new Response(JSON.stringify({
        message: 'Blog API is running',
        status: 'ok'
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response('Not Found', { status: 404 })
  }
}