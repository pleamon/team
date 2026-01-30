# TOOLS.md - BE

## 技术栈
- **语言**：Node.js / TypeScript 或 Go / Python
- **框架**：Express / Fastify / Gin / FastAPI
- **数据库**：PostgreSQL / MySQL
- **ORM**：Prisma / TypeORM / GORM
- **测试**：Jest / Pytest

## 项目结构
```
src/
├── controllers/     # API 控制器
├── services/        # 业务逻辑
├── repositories/    # 数据访问
├── models/          # 数据模型
├── middlewares/     # 中间件
├── validators/      # 参数校验
├── errors/          # 错误定义
└── utils/           # 工具函数
```

## 常用命令
```bash
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run test     # 运行测试
npm run lint     # 代码检查
npm run migrate  # 数据库迁移
```

---

## API 实现模板
```ts
// controllers/user.controller.ts
import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { CreateUserDto } from '../validators/user.validator';
import { AppError } from '../errors/AppError';

export const createUser = async (req: Request, res: Response) => {
  // 1. 参数校验
  const dto = CreateUserDto.parse(req.body);
  
  // 2. 调用服务
  const user = await userService.create(dto);
  
  // 3. 返回结果
  res.status(201).json(user);
};
```

---

## 错误处理模板
```ts
// errors/AppError.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
  }
}

// 使用
throw new AppError('EMAIL_EXISTS', '邮箱已注册', 400);

// 统一错误响应格式
{
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "邮箱已注册"
  }
}
```

---

## 日志规范
```ts
// 关键操作日志
logger.info('User created', { userId: user.id, email: user.email });

// 错误日志
logger.error('Failed to create user', { error, dto });

// 日志级别
// - error: 错误，需要关注
// - warn: 警告，可能有问题
// - info: 重要业务操作
// - debug: 调试信息（生产环境关闭）
```

---

## Commit 规范
```
feat: 新功能
fix: 修复 bug
refactor: 重构
perf: 性能优化
docs: 文档更新
test: 测试
chore: 构建/工具
```

---

## 状态标记
| 标记 | 含义 |
|------|------|
| ✅ | 开发完成 |
| 🚧 | 开发中 |
| 🔴 | 阻塞（缺契约/Schema） |
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
gh issue comment 123 --body "开始开发，预计 X 完成" --repo "pleamon/team"

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
