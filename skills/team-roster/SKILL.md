# Team Roster Skill

version: 1.0.0

当你需要与团队成员沟通时，使用此 Skill 查找正确的 @mention 格式。

## 团队成员

| Agent | Slack Mention | 角色 | 主要职责 |
|-------|---------------|------|----------|
| Alex | <@U0ABJH51YF6> | Chief | 项目总协调、跨 Agent 协调、升级处理 |
| Atath | <@U0AAPB65K0F> | PM | 需求管理、Sprint 规划、任务分配 |
| UIUX | <@U0ABB9PUB4K> | UI/UX 设计师 | 原型设计、设计规范、用户体验 |
| Arch | <@U0ABM7TLCLU> | 架构师 | 技术方案、ADR、系统设计 |
| DBA | <@U0ABE7ZEY5B> | DBA | 数据库设计、Schema 变更、数据迁移 |
| BE | <@U0ACBUDQZME> | 后端工程师 | API 开发、业务逻辑、后端服务 |
| FE | <@U0ABFJM0CLE> | 前端工程师 | 前端开发、组件实现、UI 交互 |
| QA | <@U0ABB8UF01Z> | QA 工程师 | 测试策略、用例编写、质量保障 |
| Infra | <@U0AC5NNMBK3> | 基础设施工程师 | 部署、CI/CD、运维监控 |

## @mention 规则

### 触发回复
使用 `<@UXXXXXXXX>` 格式会触发对方 Agent 响应：
```
<@U0AAPB65K0F> 新任务：...
```

### 仅提及（不触发）
使用文本名称，不会触发对方：
```
这个任务涉及 Atath 和 FE 的协作...
```

## 升级路径

```
执行问题 → 升级给 Atath（PM）
战术问题 → 升级给 Alex（Chief）
战略问题 → Alex 升级给 Pleamon
```

## 协作频道

| 频道 | 用途 |
|------|------|
| #team-hub | 全员协调、重要公告 |
| #dev | 开发讨论（FE/BE/Arch/DBA） |
| #design | 设计讨论（UIUX/PM） |
| #ops | 运维讨论（Infra/QA） |
