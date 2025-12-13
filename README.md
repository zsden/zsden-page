# Zsden's Blog

基于 Elysia + Bun + Prisma + PostgreSQL (Supabase 托管) 的现代化个人博客系统。

## 🛠️ 技术栈

- **后端框架**: [Elysia](https://elysiajs.com/) - 高性能 TypeScript Web 框架
- **运行时**: [Bun](https://bun.sh/) - 超快的 JavaScript 运行时
- **ORM**: [Prisma](https://www.prisma.io/) - 类型安全的数据库 ORM
  - 使用 Prisma PostgreSQL 适配器 (`@prisma/adapter-pg`)
  - 提供类型安全的数据库操作和自动生成的客户端
- **数据库**: PostgreSQL
  - 使用 [Supabase](https://supabase.com/) 作为托管服务（仅作为数据库托管）
  - 通过标准 PostgreSQL 连接字符串直接连接
- **前端**: Vue 3 + TypeScript + 原生 CSS
- **内容管理**: Markdown 文件系统
- **语法高亮**: Highlight.js + rehype-highlight
- **构建工具**: Bun 原生构建系统

## ✨ 特性

- 📝 **Markdown 文章管理** - 支持 Frontmatter 元数据
- 🗂️ **分类和标签系统** - 灵活的内容组织方式
- 🎨 **现代化 UI** - 响应式设计，支持深色/浅色主题切换
- 🌈 **语法高亮** - 专业的代码展示，支持多种编程语言
- 📊 **访问统计** - 文章浏览次数和访问日志记录
- 🔍 **搜索功能** - 实时文章搜索
- 📡 **RSS 订阅** - RSS/Atom 订阅支持
- 🚀 **高性能** - 基于 Bun 的极速运行时
- 🔒 **类型安全** - Prisma 提供端到端的类型安全

## 📁 项目结构

```
zsden-page/
├── src/
│   ├── index.ts            # Elysia 应用入口
│   ├── lib/                # 工具库
│   │   ├── prisma.ts      # Prisma 客户端配置
│   │   └── markdown.ts    # Markdown 处理工具
│   ├── routes/             # API 路由
│   │   ├── posts.ts       # 文章相关 API
│   │   └── rss.ts         # RSS 订阅 API
│   └── types/              # TypeScript 类型
│       └── blog.ts
├── prisma/                  # Prisma 配置
│   ├── schema.prisma       # 数据库模式定义
│   ├── config.ts          # Prisma 配置文件
│   └── migrations/         # 数据库迁移文件
├── posts/                   # Markdown 文章目录
│   └── YYYY/MM/            # 按年月组织
├── public/                  # 静态文件
│   ├── index.html          # 首页
│   └── post.html           # 文章详情页
└── package.json
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/zsden/zsden-page.git
cd zsden-page
```

### 2. 安装依赖

```bash
bun install
```

### 3. 配置环境变量

创建 `.env` 文件并配置 PostgreSQL 连接：

```env
# 数据库连接字符串（从 Supabase Dashboard 获取）
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# 注意：
# - DATABASE_URL: 用于应用运行时的连接（通过 PgBouncer 连接池）
# - DIRECT_URL: 用于数据库迁移的直连
# - 这些信息可以在 Supabase Dashboard > Settings > Database 中找到
```

### 4. 设置数据库

#### 方式一：使用 Prisma 迁移（推荐）

```bash
# 生成 Prisma 客户端
bunx prisma generate

# 运行数据库迁移
bunx prisma migrate dev --name init
```

#### 方式二：直接在 Supabase Dashboard 执行

1. 打开 Supabase Dashboard
2. 进入 SQL Editor
3. 运行 `supabase/schema.sql` 中的 SQL 语句

### 5. 启动开发服务器

```bash
bun run dev
```

访问 http://localhost:3000 查看博客。

## 📝 Prisma 数据库模式

项目完全使用 Prisma 来管理数据库模式，包含以下模型：

- **Post** - 文章模型
- **Tag** - 标签模型
- **Category** - 分类模型
- **PostTag** - 文章-标签关联（多对多）
- **PostCategory** - 文章-分类关联（多对多）
- **ViewLog** - 访问日志

详细的模式定义请查看 `prisma/schema.prisma`。

### 数据库连接方式

项目使用 Prisma PostgreSQL 适配器直接连接数据库：

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

export const prisma = new PrismaClient({
  adapter,
  log: ['query'],
})
```

这种方式提供：
- ✅ 原生 PostgreSQL 性能
- ✅ 类型安全的数据库操作
- ✅ 自动生成的 Prisma Client
- ✅ 数据库迁移和版本控制

## 📚 文章管理

### 创建新文章

1. 在 `posts` 目录下按年月创建新文章：`posts/2024/01/my-post.md`
2. 文章文件名会自动用作 slug

### Frontmatter 配置

每篇文章都需要 YAML frontmatter：

```yaml
---
title: 文章标题
description: 文章描述
author: zsden          # 可选，默认为 zsden
tags: [Vue3, TypeScript]
categories: [前端开发]
status: PUBLISHED       # PUBLISHED 或 DRAFT
slug: 2024/01/my-post  # 可选，默认使用文件路径
---

文章内容...
```

### Prisma 操作示例

项目完全使用 Prisma 进行数据库操作：

```typescript
import { prisma } from './src/lib/prisma'

// 获取所有已发布文章（包含关联的标签和分类）
const posts = await prisma.post.findMany({
  where: { status: 'PUBLISHED' },
  include: {
    tags: { include: { tag: true } },
    categories: { include: { category: true } }
  },
  orderBy: { createdAt: 'desc' }
})

// 创建新文章
const newPost = await prisma.post.create({
  data: {
    title: '新文章',
    slug: '2024/01/new-post',
    contentPath: '2024/01/new-post',
    status: 'PUBLISHED'
  }
})

// 事务操作：记录访问日志并更新浏览次数
await prisma.$transaction(async (tx) => {
  // 创建访问日志
  await tx.viewLog.create({
    data: {
      postId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }
  })

  // 更新文章浏览次数
  await tx.post.update({
    where: { id: postId },
    data: { viewCount: { increment: 1 } }
  })
})
```

所有数据库操作都通过 Prisma Client 进行，享受：
- 🔄 自动的事务支持
- 🎯 类型安全的查询
- ⚡ 查询优化和连接池
- 📊 内置的查询日志

## 🔧 开发指南

### Prisma 命令

```bash
# 生成 Prisma 客户端
bunx prisma generate

# 创建新迁移
bunx prisma migrate dev --name migration-name

# 查看数据库
bunx prisma studio

# 重置数据库
bunx prisma migrate reset

# 部署迁移
bunx prisma migrate deploy
```

### API 接口

- `GET /` - API 信息
- `GET /api/posts` - 获取所有文章
- `GET /api/posts/:slug` - 获取单篇文章
- `GET /api/posts/tags/:tag` - 按标签筛选文章
- `GET /api/posts/categories/:category` - 按分类筛选文章
- `GET /api/tags` - 获取所有标签
- `GET /api/categories` - 获取所有分类
- `GET /api/stats` - 获取博客统计
- `GET /rss` - RSS 订阅
- `GET /atom.xml` - Atom 订阅

## 🌐 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署完成后在 Vercel 控制台运行：
   ```bash
   bunx prisma migrate deploy
   ```

### 其他平台

项目支持部署到任何支持 Node.js/Bun 的平台：
- Railway
- Render
- Heroku
- Docker

## 🎨 自定义主题

项目支持深色/浅色主题切换。CSS 变量定义：

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --primary-color: #2563eb;
  --border-color: #e5e7eb;
  --code-bg: #f3f4f6;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #e5e5e5;
  --primary-color: #3b82f6;
  --border-color: #374151;
  --code-bg: #2d2d2d;
}
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 🔗 相关链接

- [Elysia 文档](https://elysiajs.com/)
- [Bun 文档](https://bun.sh/docs)
- [Prisma 文档](https://www.prisma.io/docs/)
- [Supabase 文档](https://supabase.com/docs)