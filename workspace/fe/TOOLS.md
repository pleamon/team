# TOOLS.md - fe

## 工作区
```
~/team/workspace/fe/
├── FE-architecture.md
├── Component-guidelines.md
├── API-integration-notes.md
└── Style-guide.md
```

## 开发环境

```bash
cd ~/project/frontend
npm install && npm run dev
npm run lint && npm run test
```

环境变量 (.env.local):
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MOCK_ENABLED=true
```

## 技术栈
- React 18+ / Vue 3+ + TypeScript 5+ + Vite
- Zustand / TanStack Query（状态）
- Tailwind CSS / Ant Design
- Vitest / Testing Library

## Mock 方案

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
export const handlers = [
  http.get('/api/users', () =>
    HttpResponse.json({ code: 0, data: [{id: 1}] })
  )
]

// src/main.ts
if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
  const { worker } = await import('./mocks/browser')
  await worker.start()
}
```

## Lint 规范

ESLint: `no-console: warn`, `no-unused-vars: error`
Prettier: `semi: false`, `singleQuote: true`, `tabWidth: 2`

## 组件验收 Checklist

- [ ] 功能: Props完整 / 默认值 / 边界处理
- [ ] 视觉: 还原95%+ / 响应式 / 交互状态
- [ ] 边界: 空数据/Loading/Error/超长/网络错误
- [ ] 质量: TS类型 / 通过lint / 无调试代码 / 无硬编码
- [ ] 性能: 避免重渲染 / 懒加载 / 防抖节流
- [ ] A11y: 语义化 / ARIA / 键盘导航
- [ ] 测试: 单元测试>70% / 跨浏览器

## API 联调

流程: 契约确认 → Mock测试 → 真实联调 → 文档更新

错误处理模板:
```typescript
export async function request<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.code !== 0) throw new Error(data.message)
    return data.data
  } catch (e) {
    if (e instanceof TypeError) throw new Error('网络失败')
    throw e
  }
}
```

## 性能优化

分析: Chrome DevTools / Lighthouse / React Profiler

优化技巧:
```typescript
const Dashboard = lazy(() => import('./Dashboard'))  // 代码分割
<img loading="lazy" />  // 图片懒加载
const debouncedSearch = useDebouncedCallback(search, 300)  // 防抖
const Memoized = React.memo(MyComponent)  // 避免重渲染
```

## 故障排查

- 页面白屏: Console错误 / 网络请求 → Error Boundary
- 样式不生效: 类名 / 优先级 → DevTools检查
- 接口404/500: API地址 / 参数 → Network面板

## 任务交互方式

- 收到任务 → Slack @mention
- 完成任务 → Slack 回复（含产出摘要）
- 代码交付 → Git push + Slack 通知
