# 博客写作指南

本指南帮助你了解如何在博客中创建和管理 Markdown 文章。

## 文件组织结构

博客文章存放在 `posts/` 目录下，建议按日期组织：

```
posts/
├── YYYY/
│   ├── MM/
│   │   ├── DD/
│   │   │   └── article-title.md
│   │   └── another-article.md
│   └── other-month/
└── draft/
    └── unpublished-article.md
```

## Frontmatter 格式

每篇 Markdown 文件都必须以 frontmatter 开头，使用 YAML 格式定义元数据：

```yaml
---
title: 文章标题
description: 文章描述或摘要
author: 作者名称
status: PUBLISHED  # 必填：PUBLISHED 或 DRAFT
date: YYYY-MM-DD  # 可选：发布日期，不填则从文件路径解析
tags: ["标签1", "标签2", "标签3"]  # 可选：标签列表
categories: ["分类1", "分类2"]  # 可选：分类列表
---
```

### Frontmatter 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | String | ✅ | 文章标题 |
| `description` | String | ✅ | 文章描述，用于 SEO 和列表展示 |
| `author` | String | ✅ | 作者名称 |
| `status` | String | ✅ | 发布状态：`PUBLISHED`（已发布）或 `DRAFT`（草稿） |
| `date` | String | ❌ | 发布日期，格式：YYYY-MM-DD，不填则从文件路径解析 |
| `tags` | Array | ❌ | 标签列表 |
| `categories` | Array | ❌ | 分类列表 |

## 文章命名规范

1. **文件路径**：使用日期路径 `YYYY/MM/DD/article-title.md`
2. **文件名**：使用小写字母、连字符分隔，例如：`getting-started-with-react.md`
3. **避免使用**：空格、特殊字符、中文（在文件名中）

## Markdown 编写规范

### 1. 标题使用

```markdown
# 一级标题（文章标题，通常省略，因为 frontmatter 已包含）

## 二级标题

### 三级标题

#### 四级标题
```

### 2. 代码块

使用三个反引号包裹代码，指定语言：

````markdown
```javascript
function hello(name) {
  console.log(`Hello, ${name}!`);
}
```
````

### 3. 图片引用

```markdown
![图片描述](/images/posts/2024/01/example-image.png)
```

图片建议存放在 `public/images/posts/YYYY/MM/` 目录下。

### 4. 链接

```markdown
[链接文本](https://example.com)
[内部链接](/posts/2024/01/another-article)
```

### 5. 列表

无序列表：
```markdown
- 项目 1
- 项目 2
  - 子项目
```

有序列表：
```markdown
1. 第一步
2. 第二步
3. 第三步
```

### 6. 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A   | B   | C   |
| D   | E   | F   |
```

### 7. 引用

```markdown
> 这是一段引用文本
> 可以是多行
```

## 文章模板

使用以下模板创建新文章：

```markdown
---
title: 文章标题
description: 文章的简短描述
author: 你的名字
status: PUBLISHED
date: 2025-01-01
tags: ["标签1", "标签2"]
categories: ["分类1"]
---

# 文章标题

这里是文章的开场白...

## 目录

- [第一节](#第一节)
- [第二节](#第二节)
- [总结](#总结)

## 第一节

内容...

## 第二节

内容...

## 总结

总结要点...
```

## 最佳实践

1. **SEO 优化**
   - 标题要简洁明了
   - description 要准确概括内容
   - 使用相关的标签和分类

2. **可读性**
   - 使用短段落
   - 适当使用标题分级
   - 添加目录（长文章）

3. **代码示例**
   - 始终指定语言类型
   - 添加必要的注释
   - 保持代码简洁

4. **图片处理**
   - 使用 WebP 格式
   - 添加 alt 文本
   - 控制图片大小

5. **草稿管理**
   - 使用 `status: DRAFT` 保存未完成的文章
   - 可以放在 `draft/` 目录下

## 发布流程

1. 创建 Markdown 文件
2. 编写内容
3. 设置正确的 frontmatter
4. 将 `status` 改为 `PUBLISHED`
5. 提交到版本控制

## 常见问题

### Q: 文章没有显示在列表中？
A: 检查 frontmatter 中的 `status` 是否为 `PUBLISHED`。

### Q: 日期显示不正确？
A: 确保日期格式为 `YYYY-MM-DD`，或者检查文件路径是否包含正确的日期。

### Q: 如何创建系列文章？
A: 使用相同的标签或分类，并在文章中添加前后文的链接。

### Q: 如何添加数学公式？
A: 使用 LaTeX 语法，例如：`$E=mc^2` 或 `$$\int_a^b f(x)dx$$`

## 参考资源

- [Markdown 基础语法](https://www.markdownguide.org/basic-syntax/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [写作最佳实践](https://developers.google.com/tech-writing)