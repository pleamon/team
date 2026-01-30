# 组件开发规范

## 目录结构

```
components/
├── design/           # 设计系统组件（基础 UI 组件）
│   ├── Input/        # 每个组件独立目录
│   │   ├── index.tsx # 组件实现
│   │   └── types.ts  # 类型定义
│   └── index.ts      # barrel export
└── business/         # 业务组件
    └── index.ts      # barrel export
```

## 新建组件步骤

1. **创建组件目录**：`components/design/ComponentName/`
2. **定义类型**：`types.ts` 中定义 Props 接口
3. **实现组件**：`index.tsx` 中实现并导出
4. **更新 barrel**：在 `design/index.ts` 中添加导出

## 组件规范

### 命名
- 目录名：PascalCase（`Input`、`Button`、`UserCard`）
- 文件名：`index.tsx`（实现）、`types.ts`（类型）

### Props 规范
- 所有 Props 必须有 TypeScript 类型定义
- 提供合理的默认值
- 使用 JSDoc 注释说明用途
- 继承原生 HTML 属性（如 `InputHTMLAttributes`）

### 实现规范
- 使用 `forwardRef` 暴露 ref
- 设置 `displayName`
- 支持 `className` 透传
- 处理 disabled 状态
- 支持尺寸变体（sm / md / lg）

### 样式规范
- 使用 Tailwind CSS utility classes
- 不硬编码颜色/尺寸值
- 通过 Props 控制变体

### 导入方式
```tsx
// ✅ 推荐：从 barrel 导入
import { Input } from '@/components/design'

// ❌ 避免：直接导入文件
import Input from '@/components/design/Input/index'
```

## 质量检查
- [ ] TypeScript 类型完整
- [ ] 支持 ref 转发
- [ ] 处理边界状态（disabled、error、empty）
- [ ] 响应式适配
- [ ] 无硬编码值
