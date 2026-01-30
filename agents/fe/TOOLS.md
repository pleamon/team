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

---

## GitHub Issue 任务管理

### 查看分配给我的任务

```bash
gh issue list --assignee @me --repo "pleamon/team"
```

### 更新任务状态

```bash
# 开始任务
gh issue edit 123 --add-label "status:in-progress" --repo "pleamon/team"
gh issue comment 123 --body "开始开发。执行计划：<步骤>；预期产出：<路径/链接>；风险/依赖：<无/说明>" --repo "pleamon/team"

# 任务阻塞
gh issue edit 123 --add-label "status:blocked" --repo "pleamon/team"
gh issue comment 123 --body "阻塞：[原因]" --repo "pleamon/team"

# 完成，请求审核
gh issue edit 123 \
  --remove-label "status:in-progress" \
  --add-label "status:review,qa:pending" \
  --repo "pleamon/team"
gh issue comment 123 --body "开发完成，请 @qa 审核\nPR: #456" --repo "pleamon/team"
```

### 提交代码关联 Issue

```bash
# Commit 消息引用 Issue（合并时自动关闭）
git commit -m "feat(xxx): description. Closes #123"
```

> 详细规范参见 `skills/github-project/SKILL.md`
