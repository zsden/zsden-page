# Frontmatter 快速参考卡

## 必填字段

```yaml
---
title: 文章标题
description: 文章描述
author: 作者名称
status: PUBLISHED  # 或 DRAFT
---
```

## 完整格式

```yaml
---
title: 文章标题
description: 文章描述
author: 作者名称
status: PUBLISHED  # PUBLISHED 或 DRAFT
date: 2025-01-01    # YYYY-MM-DD 格式
tags: ["标签1", "标签2"]
categories: ["分类1"]
---
```

## 状态说明

- `PUBLISHED` - 已发布，会在前台显示
- `DRAFT` - 草稿，不会在前台显示

## 标签示例

```yaml
tags: ["JavaScript", "React", "教程"]
tags: ["技术", "前端"]
tags: ["日记"]
```

## 分类示例

```yaml
categories: ["技术分享"]
categories: ["教程", "入门"]
categories: ["生活"]
```

## 日期格式

- 正确：`2025-01-01`、`2024-12-31`
- 错误：`2025/01/01`、`Jan 1, 2025`、`2025年1月1日`

## 排序规则

1. 有 `date` 字段的文章按日期排序
2. 没有 `date` 的按文件路径中的日期排序
3. 都没有的按文件名排序

## 快速模板

复制以下内容开始写文章：

```markdown
---
title: 文章标题
description: 文章描述
author: zsden
status: PUBLISHED
date: 2025-01-01
tags: ["标签"]
categories: ["分类"]
---

# 文章标题

内容...
```