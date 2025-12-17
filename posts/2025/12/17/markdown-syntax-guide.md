---
title: Markdown 语法指南
description: 了解如何使用 Markdown 编写精美的博客文章
author: zsden
status: PUBLISHED
date: 2025-12-17
tags: ["markdown", "guide", "syntax"]
categories: ["教程"]
---

# Markdown 语法指南

Markdown 是一种轻量级标记语言，让你能够使用易读易写的纯文本格式编写文档。

## 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

## 强调

```markdown
*斜体文本*
_斜体文本_
**粗体文本**
__粗体文本__
***粗斜体文本***
___粗斜体文本___
```

效果：
- *斜体文本*
- **粗体文本**
- ***粗斜体文本***

## 列表

### 无序列表

```markdown
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3
```

### 有序列表

```markdown
1. 第一步
2. 第二步
3. 第三步
```

## 链接和图片

```markdown
[链接文本](URL)
![图片描述](图片URL)
```

## 代码

行内代码：`console.log('Hello')`

代码块：

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

## 表格

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A   | B   | C   |
| D   | E   | F   |

## 引用

> 这是一段引用文本。
> 可以是多行。

## 分割线

---

## 结语

这就是 Markdown 的基本语法！简单易用，让你专注于内容创作。