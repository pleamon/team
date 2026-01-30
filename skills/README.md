# Shared Skills

共享技能目录。所有 Agent 可使用的通用 Skills 放在此处。

## 已有 Skills (7)

### 核心协作
| Skill | 描述 | 适用角色 |
|-------|------|---------|
| [team-roster](team-roster/SKILL.md) | 团队成员目录、@mention 规则 | 全员 |
| [slack-protocol](slack-protocol/SKILL.md) | Slack 沟通规范、消息模板、响应时效 | 全员 |
| [canvas-workflow](canvas-workflow/SKILL.md) | Canvas 协作规范、状态看板、更新流程 | 全员 |

### 项目管理
| Skill | 描述 | 适用角色 |
|-------|------|---------|
| [github-project](github-project/SKILL.md) | GitHub Issues + Milestones 任务管理 | 全员 |

### 代码协作
| Skill | 描述 | 适用角色 |
|-------|------|---------|
| [git-workflow](git-workflow/SKILL.md) | Git 分支策略、Commit 规范、PR 流程 | 全员 |
| [code-review](code-review/SKILL.md) | 代码审查标准、审查清单、评论规范 | QA/FE/BE |

### 工具扩展
| Skill | 描述 | 适用角色 |
|-------|------|---------|
| [slackex](slackex/SKILL.md) | Slack 高级功能（Canvas/Reminder/DND/Status/Search） | 全员 |

## 协作工具链

```
任务管理: GitHub Issues + Milestones
    ↓
沟通协作: Slack + Canvas
    ↓
代码协作: Git + PR + Code Review
    ↓
状态同步: Canvas（从 Issues 汇总）
```

## 使用方式

Skills 通过 `sync.sh` 自动同步到各 Agent 的 `workspace/skills/` 目录。

```bash
cd ~/team/team-config && ./sync.sh <agent_name>
```

## 脚本工具

| 脚本 | 用途 |
|------|------|
| `sync.sh <agent>` | 同步配置到 Agent workspace |
| `sync-all.sh` | 同步所有 Agent |
| `scripts/init-labels.sh <repo>` | 初始化 GitHub Labels |
