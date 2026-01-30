# Shared Skills

共享技能目录。所有 Agent 可使用的通用 Skills 放在此处。

## 已有 Skills

| Skill | 描述 | 适用角色 |
|-------|------|---------|
| [team-roster](team-roster/SKILL.md) | 团队成员目录、@mention 规则 | 全员 |
| [git-workflow](git-workflow/SKILL.md) | Git 分支策略、Commit 规范、PR 流程 | 全员 |
| [slack-protocol](slack-protocol/SKILL.md) | Slack 沟通规范、消息模板、响应时效 | 全员 |
| [code-review](code-review/SKILL.md) | 代码审查标准、审查清单、评论规范 | QA/FE/BE |
| [slackex](slackex/SKILL.md) | Slack 高级功能（Canvas/Reminder/DND/Status/Search/Bookmark） | 全员 |
| [canvas-workflow](canvas-workflow/SKILL.md) | Canvas 协作规范、状态看板、更新流程 | 全员 |

## 核心协作 Skills

### 沟通三件套
1. **slack-protocol** — 消息怎么写、何时 @mention
2. **canvas-workflow** — 状态持久化、看板维护
3. **team-roster** — 找人、@mention 格式

### 代码协作
1. **git-workflow** — 分支、Commit、PR
2. **code-review** — 审查标准、流程

### 高级功能
1. **slackex** — Slack API 扩展（Reminder/DND/Search 等）

## 使用方式

Skills 通过 `sync.sh` 自动同步到各 Agent 的 `workspace/skills/` 目录。

```bash
cd ~/team/team-config && ./sync.sh <agent_name>
```

## 添加新 Skill

1. 创建 `skills/<skill-name>/SKILL.md`
2. 按 OpenClaw Skill 格式编写
3. 更新本 README
4. 提交并 push
5. 通知相关 Agent 执行 `sync.sh`
