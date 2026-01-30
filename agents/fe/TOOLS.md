# TOOLS.md - FE

## 技术栈
- **框架**：React 18+ / TypeScript
- **样式**：CSS Modules / Tailwind CSS
- **构建**：Vite
- **测试**：Vitest / React Testing Library

## 项目结构
```
src/
├── components/       # 通用组件
│   └── Button/
│       ├── index.tsx
│       ├── types.ts
│       └── Button.test.tsx
├── pages/           # 页面组件
├── hooks/           # 自定义 Hooks
├── services/        # API 调用
├── stores/          # 状态管理
├── types/           # 全局类型
└── utils/           # 工具函数
```

## 常用命令
```bash
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run test     # 运行测试
npm run lint     # 代码检查
npm run lint:fix # 自动修复
```

---

## 组件模板
```tsx
// components/Button/index.tsx
import { ButtonProps } from './types';

export function Button({ 
  children, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick 
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export type { ButtonProps } from './types';
```

```ts
// components/Button/types.ts
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}
```

---

## API 调用模板
```ts
// services/user.ts
import { api } from './api';
import type { User, CreateUserRequest } from '@/types/user';

export const userService = {
  getUser: (id: string) => 
    api.get<User>(`/users/${id}`),
    
  createUser: (data: CreateUserRequest) =>
    api.post<User>('/users', data),
};
```

---

## Commit 规范
```
feat: 新功能
fix: 修复 bug
refactor: 重构
style: 样式调整
docs: 文档更新
test: 测试
chore: 构建/工具
```

示例：
```
feat(Button): add loading state support
fix(Form): fix validation error display
refactor(hooks): extract useAuth logic
```

---

## 状态标记
| 标记 | 含义 |
|------|------|
| ✅ | 开发完成 |
| 🚧 | 开发中 |
| 🔴 | 阻塞（缺设计/接口） |
| 🐛 | 有 Bug 待修 |
