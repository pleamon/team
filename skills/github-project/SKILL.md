# GitHub Project Skill

version: 1.1.0

使用 GitHub Issues + Milestones 进行任务和项目管理，与 Slack 联动协作。

## 核心理念

| 工具 | 用途 |
|------|------|
| **GitHub Issues** | 任务管理（创建、分配、追踪、关闭） |
| **GitHub Milestones** | Sprint/里程碑管理 |
| **GitHub Labels** | 分类（角色、优先级、类型、状态、QA审核） |
| **Slack** | 沟通、讨论、通知 |
| **Canvas** | 状态总览（从 Issues 汇总） |

---

## 多仓库策略

| Issue 类型 | 所在仓库 | 原因 |
|-----------|---------|------|
| 代码相关（feature/bug/refactor） | 项目 repo（如 `pleamon/wallet-app`） | PR 可以 `Closes #123` 自动关联 |
| 产品/配置（PRD/流程） | `pleamon/team` | 集中管理 |
| 设计任务 | 项目 repo 或 team repo | 视具体情况 |

---

## 层级结构

```
Repository（项目仓库）
  └── Milestone（里程碑）= Sprint
       └── Issue（任务）= 具体任务
            ├── Labels: 角色 + 优先级 + 类型 + 状态 + QA审核
            ├── Assignee: 负责人
            └── Comments: 进度更新
```

---

## Sprint Milestone 命名规范

格式：`Sprint-{N}-{简短目标}`

示例：
- `Sprint-1-UserAuth`（用户认证）
- `Sprint-2-WalletCore`（钱包核心）
- `Sprint-3-PaymentFlow`（支付流程）

---

## Label 体系

### 角色 Labels（蓝色系）
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

### 优先级 Labels（红→黄→绿）
| Label | 描述 |
|-------|------|
| `P0-blocker` | 阻塞发布，立即处理 |
| `P1-critical` | 影响核心功能，本周内 |
| `P2-normal` | 重要但不紧急，本迭代内 |
| `P3-low` | 优化改进，排期处理 |

### 类型 Labels
| Label | 描述 |
|-------|------|
| `type:feature` | 新功能 |
| `type:bug` | Bug 修复 |
| `type:design` | 设计任务 |
| `type:infra` | 基础设施 |
| `type:docs` | 文档 |
| `type:refactor` | 重构 |
| `type:test` | 测试 |

### 状态 Labels
| Label | 描述 |
|-------|------|
| `status:ready` | 准备就绪，可开始 |
| `status:in-progress` | 进行中 |
| `status:blocked` | 阻塞中 |
| `status:review` | 等待审核 |
| `status:done` | 完成待部署 |

### QA 审核 Labels
| Label | 描述 |
|-------|------|
| `qa:pending` | 等待 QA 审核 |
| `qa:passed` | QA 审核通过 |
| `qa:failed` | QA 审核未通过 |
| `qa:blocked` | QA 审核被阻塞（环境/数据/依赖） |

---

## QA 审核规范

### 审核触发
**谁负责加 `qa:pending`**：完成任务的 Agent 自己加

### 审核深度按类型区分

| Issue 类型 | QA 审核深度 | 说明 |
|-----------|-----------|------|
| `type:feature` | 完整功能测试 | 必须走 `qa:pending → qa:passed` |
| `type:bug` | 修复验证 | 必须走 `qa:pending → qa:passed` |
| `type:design` | 规范完整性检查 | 检查设计规范是否可测试 |
| `type:docs` | 轻量审核 | 准确性校验即可 |
| `type:refactor` | 回归测试 | 确认无功能退化 |
| `type:infra` | 环境验证 | 确认部署后功能正常 |

### 验收标准要求
**每个 `type:feature` Issue 必须包含可测试的验收标准**（Given-When-Then 格式）：
```
- [ ] **Given** [前置条件] **When** [操作] **Then** [预期结果]
```

---

## Issue 模板

仓库中已配置 `.github/ISSUE_TEMPLATE/`：
- `feature.md` — 功能任务（含验收标准）
- `bug.md` — Bug 报告（含严重级别、复现步骤）
- `adr.md` — 架构决策记录（含影响范围）

### ADR 影响范围要求
每个 ADR Issue 必须标注**影响范围**，方便 QA 确定回归测试范围：
```
## 影响范围
- FE: [影响的前端模块]
- BE: [影响的后端服务]
- DBA: [影响的数据表]
```

---

## 完整工作流程

### 1. 创建任务（Atath）

```bash
gh issue create \
  --title "用户注册页面" \
  --label "role:fe,P1-critical,type:feature,status:ready" \
  --milestone "Sprint-1-UserAuth" \
  --assignee "fe" \
  --repo "pleamon/project"
```

### 2. 开始任务（Agent）

```bash
gh issue edit 123 \
  --remove-label "status:ready" \
  --add-label "status:in-progress" \
  --repo "pleamon/project"

gh issue comment 123 --body "开始开发，预计明天完成" --repo "pleamon/project"
```

### 3. 完成，请求 QA 审核（Agent 自己加）

```bash
gh issue edit 123 \
  --remove-label "status:in-progress" \
  --add-label "status:review,qa:pending" \
  --repo "pleamon/project"

gh issue comment 123 --body "开发完成，请 QA 审核\nPR: #456" --repo "pleamon/project"
```

### 4. QA 审核

```bash
# 通过
gh issue edit 123 \
  --remove-label "qa:pending" \
  --add-label "qa:passed,status:done" \
  --repo "pleamon/project"

# 不通过
gh issue edit 123 \
  --remove-label "qa:pending" \
  --add-label "qa:failed" \
  --repo "pleamon/project"

# 被阻塞
gh issue edit 123 \
  --remove-label "qa:pending" \
  --add-label "qa:blocked" \
  --repo "pleamon/project"
```

### 5. 部署后关闭

```bash
gh issue close 123 --comment "已部署到 production ✅" --repo "pleamon/project"
```

---

## 查询命令

```bash
# 当前 Sprint 任务
gh issue list --milestone "Sprint-1-UserAuth" --repo "pleamon/project"

# 等待 QA 审核
gh issue list --label "qa:pending" --repo "pleamon/project"

# 阻塞中
gh issue list --label "status:blocked" --repo "pleamon/project"

# 我的任务
gh issue list --assignee @me --repo "pleamon/project"
```

---

## Agent 职责

| Agent | 职责 |
|-------|------|
| **Atath** | 创建 Issue、分配任务、管理 Milestone |
| **QA** | 审核所有 Issue（按类型不同深度）、管理 qa:* Labels |
| **执行层 Agent** | 更新自己任务状态、完成后加 `qa:pending` |
| **Alex** | 汇总到 Canvas、处理阻塞 |
