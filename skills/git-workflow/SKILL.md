# Git Workflow Skill

version: 1.0.0

团队 Git 工作流规范。所有 Agent 在使用 Git 时遵循此规范。

## 分支策略

### 分支类型
| 分支 | 格式 | 用途 | 从哪来 | 合到哪 |
|------|------|------|-------|-------|
| main | `main` | 生产代码 | - | - |
| develop | `develop` | 开发主线 | main | main |
| feature | `feature/<描述>` | 新功能 | develop | develop |
| fix | `fix/<描述>` | Bug 修复 | develop | develop |
| hotfix | `hotfix/<描述>` | 紧急修复 | main | main + develop |
| release | `release/<版本>` | 发布准备 | develop | main + develop |

### 分支命名
```
feature/user-registration
feature/wallet-transfer
fix/payment-timeout
hotfix/login-crash
release/1.0.0
```

## Commit 规范

### 格式
```
<type>(<scope>): <subject>

<body>（可选）

<footer>（可选）
```

### Type（必选）
| type | 含义 | 示例 |
|------|------|------|
| feat | 新功能 | feat(auth): add login API |
| fix | 修复 Bug | fix(payment): fix timeout error |
| refactor | 重构 | refactor(user): extract validation |
| style | 样式/格式 | style(button): fix padding |
| docs | 文档 | docs(api): update endpoint docs |
| test | 测试 | test(auth): add login tests |
| chore | 构建/工具 | chore(ci): update pipeline |
| perf | 性能优化 | perf(query): add index hint |

### Scope（可选）
模块或组件名：`auth`, `user`, `payment`, `button`, `api`

### Subject 规则
- 小写开头
- 不加句号
- 祈使语气（add 而不是 added）
- 不超过 50 字符

### 示例
```
feat(wallet): add transfer API

- POST /api/v1/transfers
- validate sender balance
- async notification to receiver

Closes #123
```

## PR（Pull Request）流程

### 创建 PR
1. 从 develop 创建 feature 分支
2. 开发完成后提交
3. 创建 PR → develop
4. 填写 PR 模板

### PR 模板
```markdown
## 描述
[做了什么，为什么]

## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 重构
- [ ] 文档

## 变更内容
- [具体变更1]
- [具体变更2]

## 测试
- [ ] 单元测试通过
- [ ] 手动测试通过
- [ ] 不需要测试

## 依赖
- [依赖的其他 PR/任务]

## 截图（UI 变更时）
[附截图]
```

### PR 审查
1. QA 审查代码质量
2. 相关 Agent 审查逻辑（FE 审 FE、BE 审 BE）
3. 审查通过 → 合并
4. 审查不通过 → 修改后重新提交

### 合并规则
- PR 必须通过 QA 审查
- CI 必须通过
- 不允许 force push 到 main/develop
- 合并使用 Squash Merge（保持历史干净）

## 常用命令

```bash
# 创建 feature 分支
git checkout develop
git pull
git checkout -b feature/user-registration

# 开发完成，提交
git add -A
git commit -m "feat(user): add registration form"

# 推送并创建 PR
git push -u origin feature/user-registration
# 在 GitHub/GitLab 创建 PR

# 合并后清理
git checkout develop
git pull
git branch -d feature/user-registration
```

## 紧急修复（Hotfix）
```bash
# 从 main 创建 hotfix
git checkout main
git pull
git checkout -b hotfix/login-crash

# 修复后
git commit -m "hotfix(auth): fix login crash on empty password"
git push -u origin hotfix/login-crash

# 创建 PR → main（紧急审查）
# 合并后也要合回 develop
```
