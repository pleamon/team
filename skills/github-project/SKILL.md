# GitHub Project Skill

version: 1.0.0

使用 GitHub Issues + Milestones 进行任务和项目管理，与 Slack 联动协作。

## 核心理念

| 工具 | 用途 |
|------|------|
| **GitHub Issues** | 任务管理（创建、分配、追踪、关闭） |
| **GitHub Milestones** | Sprint/里程碑管理 |
| **GitHub Labels** | 分类（角色、优先级、类型、状态） |
| **Slack** | 沟通、讨论、通知 |
| **Canvas** | 状态总览（从 Issues 汇总） |

---

## 层级结构

```
Repository（项目仓库）
  └── Milestone（里程碑）= Sprint
       └── Issue（任务）= 具体任务
            ├── Labels: 角色 + 优先级 + 类型 + 状态
            ├── Assignee: 负责人
            └── Comments: 进度更新
```

---

## Label 体系

### 角色 Labels（蓝色系 #0052CC）
| Label | 描述 |
|-------|------|
| `role:pm` | 产品经理任务 |
| `role:uiux` | 设计任务 |
| `role:arch` | 架构任务 |
| `role:fe` | 前端任务 |
| `role:be` | 后端任务 |
| `role:dba` | 数据库任务 |
| `role:qa` | 测试任务 |
| `role:infra` | 运维任务 |

### 优先级 Labels（红→黄）
| Label | 颜色 | 描述 |
|-------|------|------|
| `P0-blocker` | #B60205 | 阻塞发布，立即处理 |
| `P1-critical` | #D93F0B | 影响核心功能，本周内 |
| `P2-normal` | #FBCA04 | 重要但不紧急，本迭代内 |
| `P3-low` | #C2E0C6 | 优化改进，排期处理 |

### 类型 Labels（绿色系 #0E8A16）
| Label | 描述 |
|-------|------|
| `type:feature` | 新功能 |
| `type:bug` | Bug 修复 |
| `type:design` | 设计任务 |
| `type:infra` | 基础设施 |
| `type:docs` | 文档 |
| `type:refactor` | 重构 |
| `type:test` | 测试 |

### 状态 Labels（紫色系 #5319E7）
| Label | 描述 |
|-------|------|
| `status:ready` | 准备就绪，可开始 |
| `status:in-progress` | 进行中 |
| `status:blocked` | 阻塞中 |
| `status:review` | 等待审核 |

### QA 审核 Labels（橙色系 #F9D0C4）
| Label | 描述 |
|-------|------|
| `qa:pending` | 等待 QA 审核 |
| `qa:passed` | QA 审核通过 |
| `qa:failed` | QA 审核未通过 |

---

## Issue 规范

### Issue 模板

#### 功能任务
```markdown
## 描述
[任务描述]

## 背景
[为什么需要做]

## 验收标准
- [ ] 标准1
- [ ] 标准2

## 依赖
- #123 (如有依赖其他 Issue)

## 设计/契约
- 设计稿: [链接]
- API 契约: [链接]
```

#### Bug 修复
```markdown
## Bug 描述
[问题描述]

## 重现步骤
1. 步骤1
2. 步骤2

## 期望结果
[应该发生什么]

## 实际结果
[实际发生什么]

## 环境
- 浏览器/设备:
- 版本:
```

---

## 工作流程

### 1. 创建任务（Atath/Alex）

```bash
# 创建功能任务
gh issue create \
  --title "用户注册页面" \
  --body "## 描述\n实现用户注册页面\n\n## 验收标准\n- [ ] 表单验证\n- [ ] 提交成功提示" \
  --label "role:fe,P1-critical,type:feature" \
  --milestone "Sprint 1" \
  --assignee "fe"

# 创建 Bug
gh issue create \
  --title "登录按钮点击无响应" \
  --body "## Bug 描述\n..." \
  --label "role:fe,P0-blocker,type:bug"
```

### 2. 分配任务

```bash
# 分配给 FE
gh issue edit 123 --add-assignee fe

# 添加到 Milestone
gh issue edit 123 --milestone "Sprint 1"
```

### 3. 开始任务（Agent）

```bash
# 更新状态为进行中
gh issue edit 123 --add-label "status:in-progress"

# 添加进度评论
gh issue comment 123 --body "开始开发，预计明天完成"
```

### 4. 提交代码（关联 Issue）

```bash
# Commit 消息引用 Issue
git commit -m "feat(user): add registration form

- add form validation
- add success toast

Closes #123"

# 或在 PR 描述中引用
# Fixes #123
# Closes #123
# Resolves #123
```

### 5. 请求 QA 审核

```bash
# 开发完成，请求审核
gh issue edit 123 \
  --remove-label "status:in-progress" \
  --add-label "status:review,qa:pending"

gh issue comment 123 --body "@qa 开发完成，请审核\n\nPR: #456"
```

### 6. QA 审核

```bash
# 审核通过
gh issue edit 123 \
  --remove-label "qa:pending" \
  --add-label "qa:passed"
gh issue comment 123 --body "✅ QA 审核通过"

# 审核不通过
gh issue edit 123 \
  --remove-label "qa:pending" \
  --add-label "qa:failed"
gh issue comment 123 --body "🔴 QA 审核未通过\n\n问题:\n1. xxx\n2. xxx"
```

### 7. 关闭任务

```bash
# 方式1: PR 合并时自动关闭（推荐）
# Commit/PR 包含 "Closes #123"

# 方式2: 手动关闭
gh issue close 123 --comment "已部署到 staging ✅"
```

---

## 查询命令

### 查看任务列表

```bash
# 当前 Sprint 所有任务
gh issue list --milestone "Sprint 1"

# 分配给 FE 的任务
gh issue list --assignee fe

# P0 任务
gh issue list --label "P0-blocker"

# 等待 QA 审核
gh issue list --label "qa:pending"

# 阻塞中的任务
gh issue list --label "status:blocked"
```

### 查看任务详情

```bash
# 查看详情
gh issue view 123

# JSON 格式（用于脚本）
gh issue view 123 --json title,state,labels,assignees,milestone
```

### Sprint 统计

```bash
# Sprint 1 统计
gh issue list --milestone "Sprint 1" --state all --json state | \
  python3 -c "
import json,sys
data = json.load(sys.stdin)
open_count = len([i for i in data if i['state'] == 'OPEN'])
closed_count = len([i for i in data if i['state'] == 'CLOSED'])
print(f'Open: {open_count}, Closed: {closed_count}, Total: {len(data)}')
print(f'Progress: {closed_count}/{len(data)} ({100*closed_count//len(data) if data else 0}%)')
"
```

---

## Milestone 管理

### 创建 Milestone（Sprint）

```bash
gh api repos/{owner}/{repo}/milestones \
  -f title="Sprint 1" \
  -f description="用户注册功能" \
  -f due_on="2024-02-14T00:00:00Z"
```

### 查看 Milestone

```bash
gh api repos/{owner}/{repo}/milestones --jq '.[] | {title, open_issues, closed_issues, due_on}'
```

### 关闭 Milestone

```bash
gh api repos/{owner}/{repo}/milestones/1 -X PATCH -f state="closed"
```

---

## Slack 联动

### 任务创建后通知

```
@FE 新任务：

**Issue**: #123 用户注册页面
**优先级**: P1
**Milestone**: Sprint 1
**验收标准**:
- [ ] 表单验证
- [ ] 提交成功提示

链接: https://github.com/owner/repo/issues/123
```

### 状态更新通知

```
Issue #123 状态更新：

**状态**: 🚧 开发中 → ✅ 等待审核
**操作人**: FE
**备注**: 开发完成，请 @QA 审核
```

---

## 与 Canvas 联动

Alex 定期从 Issues 汇总状态到 Canvas：

```bash
# 获取 Sprint 状态
SPRINT="Sprint 1"
gh issue list --milestone "$SPRINT" --json number,title,state,labels,assignees \
  | python3 -c "
import json,sys
data = json.load(sys.stdin)
print('| # | 任务 | 负责人 | 状态 |')
print('|---|------|--------|------|')
for i in data:
    num = i['number']
    title = i['title'][:20]
    assignee = i['assignees'][0]['login'] if i['assignees'] else '-'
    state = '✅' if i['state'] == 'CLOSED' else '🚧'
    print(f'| #{num} | {title} | {assignee} | {state} |')
"
```

---

## Agent 职责

| Agent | 职责 |
|-------|------|
| **Atath** | 创建 Issue、分配任务、管理 Milestone |
| **QA** | 审核所有 Issue（qa:pending → qa:passed/failed） |
| **执行层 Agent** | 更新自己任务状态、Comment 进度 |
| **Alex** | 汇总到 Canvas、处理阻塞 |
