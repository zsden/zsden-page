---
title: Bun vs Node.js：性能对比
description: 比较 Bun 和 Node.js 的性能，了解新一代 JavaScript 运行时
author: zsden
tags: [Bun, Node.js, performance]
categories: [技术对比]
status: PUBLISHED
slug: 2024/01/bun-vs-node
---

# Bun vs Node.js：性能对比

Bun 是一个全新的 JavaScript 运行时，旨在成为 Node.js 的快速替代品。

## 性能对比

| 特性 | Bun | Node.js |
|-----|-----|---------|
| 启动速度 | ⚡️ 超快 | 🐌 较慢 |
| 包管理 | 内置 | 需要npm/yarn |
| TypeScript | 原生支持 | 需要配置 |
| Web APIs | 内置 | 需要额外库 |

## 代码示例

### Node.js
```javascript
import { createServer } from 'http'

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Hello World' }))
})

server.listen(3000)
```

### Bun
```javascript
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response(JSON.stringify({ message: 'Hello World' }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

## 结论

Bun 在性能方面确实有很大优势，但 Node.js 拥有更成熟的生态系统。选择哪个取决于你的具体需求。