# TOOLS.md - FE

## 技术栈
- React 18+ / TypeScript
- CSS Modules / Tailwind CSS
- Vite 构建
- Vitest / React Testing Library 测试

## 开发规范
- 组件目录结构：
  ```
  components/
  └── Button/
      ├── index.tsx      # 组件实现
      ├── types.ts       # 类型定义
      ├── styles.module.css
      └── Button.test.tsx
  ```
- 使用 barrel export（index.ts 导出）
- Props 必须有 TypeScript 类型

## 常用命令
```bash
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run test     # 运行测试
npm run lint     # 代码检查
```
