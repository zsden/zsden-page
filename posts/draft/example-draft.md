---
title: 这是一篇示例草稿
description: 展示如何创建和管理草稿文章
author: zsden
status: DRAFT
tags: ["example", "draft"]
categories: ["示例"]
---

# 示例草稿文章

这是一篇草稿文章的示例。

## 草稿的特点

- `status: DRAFT` - 设置为草稿状态
- 不会在前台 API 中返回
- 可以随时修改和发布

## 如何发布草稿

将 `status` 从 `DRAFT` 改为 `PUBLISHED` 即可发布。

## 草稿存放位置

1. 可以存放在 `posts/draft/` 目录下
2. 也可以存放在日期目录中（如 `posts/2025/01/`）
3. 只要 `status` 是 `DRAFT`，就不会被公开