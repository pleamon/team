# TOOLS.md - Arch

## ADR 模板
```markdown
# ADR-[编号]: [标题]

## 状态
[Proposed / Accepted / Deprecated / Superseded by ADR-XXX]

## 背景
[为什么需要做这个决策？问题是什么？]

## 决策驱动因素
- [因素1]
- [因素2]
- [因素3]

## 考虑的选项
### 选项 A: [名称]
- 优点：...
- 缺点：...
- 风险：...

### 选项 B: [名称]
- 优点：...
- 缺点：...
- 风险：...

## 决策
选择 [选项 X]

## 理由
[为什么选这个？trade-off 是什么？]

## 影响
- 对 FE 的影响：...
- 对 BE 的影响：...
- 对 DBA 的影响：...
- 对 Infra 的影响：...

## 相关决策
- [ADR-XXX: 相关决策]
```

---

## API 契约模板
```markdown
# API 契约: [功能名称]

## 概述
[接口用途描述]

## 基础信息
- Base URL: `/api/v1`
- 认证方式: Bearer Token

---

## [接口名称]

### 请求
- **方法**: `POST`
- **路径**: `/users/register`
- **Content-Type**: `application/json`

### 请求参数
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码，6-20位 |
| name | string | 否 | 用户名 |

### 请求示例
\`\`\`json
{
  "email": "user@example.com",
  "password": "123456",
  "name": "张三"
}
\`\`\`

### 响应
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 用户ID |
| email | string | 邮箱 |
| createdAt | string | 创建时间 ISO8601 |

### 响应示例
\`\`\`json
{
  "id": "user_123",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

### 错误码
| 错误码 | HTTP 状态 | 说明 |
|-------|----------|------|
| EMAIL_EXISTS | 400 | 邮箱已注册 |
| INVALID_EMAIL | 400 | 邮箱格式错误 |
| PASSWORD_TOO_SHORT | 400 | 密码太短 |
```

---

## 数据模型模板
```markdown
# 数据模型: [模块名称]

## 实体关系图
\`\`\`mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
\`\`\`

## 实体定义

### User
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | 密码哈希 |
| created_at | TIMESTAMP | NOT NULL | 创建时间 |

### 索引建议
- `idx_user_email` on `email`（登录查询）
```

---

## 架构图（Mermaid）
```markdown
\`\`\`mermaid
flowchart TB
    subgraph Client
        Web[Web App]
        Mobile[Mobile App]
    end
    
    subgraph Backend
        API[API Gateway]
        Auth[Auth Service]
        User[User Service]
    end
    
    subgraph Data
        DB[(PostgreSQL)]
        Cache[(Redis)]
    end
    
    Web --> API
    Mobile --> API
    API --> Auth
    API --> User
    Auth --> DB
    Auth --> Cache
    User --> DB
\`\`\`
```

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
