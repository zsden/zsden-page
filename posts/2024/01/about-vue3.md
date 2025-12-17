---
title: Vue 3 Composition API 入门
description: 学习 Vue 3 的 Composition API，了解其优势和使用方法
author: zsden
status: PUBLISHED
date: 2024-01-20
tags: ["Vue", "JavaScript", "frontend"]
categories: ["前端开发"]
---

# Vue 3 Composition API 入门

Vue 3 带来了许多激动人心的新特性，其中最重要的就是 Composition API。

## 什么是 Composition API？

Composition API 是 Vue 3 中引入的一种新的组件组织方式，它提供了一种更灵活、更强大的方式来组织和复用逻辑。

## 基本语法

### setup 函数

```vue
<script>
import { ref, reactive } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3',
      version: '3.0'
    })

    const increment = () => {
      count.value++
    }

    return {
      count,
      state,
      increment
    }
  }
}
</script>
```

### script setup 语法糖

```vue
<script setup>
import { ref, reactive } from 'vue'

const count = ref(0)
const state = reactive({
  name: 'Vue 3',
  version: '3.0'
})

const increment = () => {
  count.value++
}
</script>
```

## 优势

1. **更好的 TypeScript 支持**
2. **更灵活的逻辑组织**
3. **更容易的逻辑复用**
4. **更好的性能**

## 总结

Composition API 是 Vue 3 的重要特性，它让我们的代码更加简洁和易于维护。