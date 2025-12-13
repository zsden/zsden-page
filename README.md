# Zsden's Blog

基于 Elysia + Bun + Supabase + Vue 3 的现代化个人博客系统。

## 技术栈

- **后端**: Elysia (Web Framework) + Bun (JavaScript Runtime)
- **数据库**: Supabase (PostgreSQL)
- **前端**: Vue 3 + TypeScript + CSS
- **内容管理**: Markdown 文件系统

## 特性

- ✅ Markdown 文章编写和管理
- ✅ 按年月分类的文章存储结构
- ✅ 标签和分类系统
- ✅ 文章搜索功能
- ✅ 访问统计
- ✅ RSS/Atom 订阅
- ✅ 深色/浅色主题切换
- ✅ 响应式设计
- ✅ 草稿文章管理

## 项目结构

```
zsden-page/
├── src/
│   ├── index.ts         # 主应用入口
│   ├── lib/             # 工具库
│   │   ├── supabase.ts  # Supabase 配置
│   │   └── markdown.ts  # Markdown 处理
│   ├── routes/          # API 路由
│   │   ├── posts.ts     # 文章相关 API
│   │   └── rss.ts       # RSS 订阅
│   └── types/           # TypeScript 类型定义
│       └── blog.ts
├── posts/               # Markdown 文章目录
│   └── YYYY/MM/         # 按年月组织
├── public/              # 静态文件
│   ├── index.html       # 首页
│   └── post.html        # 文章详情页
├── prisma/              # 数据库配置
└── supabase/            # Supabase 配置
```

## 快速开始

### 1. 安装依赖

```bash
bun install
```

### 2. 配置环境变量

在 `.env` 文件中配置 Supabase：

```env
# Supabase Configuration
SUPABASE_URL="你的 Supabase URL"
SUPABASE_ANON_KEY="你的 Supabase Anon Key"
```

### 3. 设置 Supabase 数据库

在 Supabase Dashboard 的 SQL Editor 中运行 `supabase/schema.sql` 中的 SQL 语句来创建所需的表。

### 4. 启动开发服务器

```bash
bun run dev
```

访问 http://localhost:3000 查看博客首页。

## 文章管理

### 创建新文章

1. 在 `posts` 目录下按年月创建新文章，例如 `posts/2024/01/my-post.md`
2. 文章文件名和 frontmatter 中的 slug 用于生成 URL

### Frontmatter 配置

每篇文章都需要在开头包含 YAML frontmatter：

```yaml
---
title: 文章标题
description: 文章描述（可选）
author: 作者（默认：zsden）
tags: [标签1, 标签2]  # 可选
categories: [分类1]     # 可选
status: PUBLISHED      # PUBLISHED 或 DRAFT
slug: 2024/01/my-post  # 可选，默认使用文件路径
---

文章内容...
```

### 文章状态

- `PUBLISHED`: 已发布，会在前台显示
- `DRAFT`: 草稿，不会在前台显示

## API 接口

- `GET /` - API 信息
- `GET /api/posts` - 获取所有文章列表
- `GET /api/posts/:slug` - 获取单篇文章
- `GET /api/tags` - 获取所有标签
- `GET /api/categories` - 获取所有分类
- `GET /api/stats` - 获取博客统计信息
- `GET /rss` - RSS 订阅
- `GET /atom.xml` - Atom 订阅

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量：
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `DATABASE_URL`（如果需要 Prisma）
4. 部署完成

## 开发说明

### 添加新功能

1. 在 `src/routes/` 中添加新的 API 路由
2. 在 `src/lib/` 中添加工具函数
3. 在 `public/` 中修改前端页面

### 样式定制

CSS 样式定义在 HTML 文件中，支持 CSS 变量的深色/浅色主题切换。

## 许可证

MIT License