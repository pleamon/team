# Canvas Workflow Skill

version: 1.0.0

使用 Slack Canvas 作为持久化状态看板，强化团队协作。

## 核心理念

**Slack 消息是流水，Canvas 是持久化状态。**

- 消息：通知、讨论、流水记录
- Canvas：当前状态、关键信息、随时可查

Agent 恢复会话时，读取 Canvas 即可知道当前状态，不依赖会话记忆。

---

## 频道 Canvas 规划

| 频道 | Canvas 用途 | 维护者 |
|------|-----------|--------|
| #team-hub | Sprint 状态看板（总览、进度、阻塞、决策） | Alex |
| #dev | 开发状态（API 契约、FE/BE 进度、联调） | Atath |
| #design | 设计状态（设计任务、评审、Token 版本） | Atath |
| #ops | 运维状态（部署记录、环境、告警） | Infra |

---

## Canvas 模板

### #team-hub: Sprint 状态看板

```markdown
# Sprint [N] 状态看板

**周期**: YYYY-MM-DD ~ YYYY-MM-DD
**目标**: [一句话目标]

---

## 📊 任务进度

| 任务 | 负责人 | 状态 | 备注 |
|------|--------|------|------|
| PRD 编写 | Atath | ✅ | - |
| 设计规范 | UIUX | ✅ | - |
| API 契约 | Arch | ✅ | - |
| Schema | DBA | 🚧 | 进行中 |
| 前端开发 | FE | ⏳ | 等设计验收 |
| 后端开发 | BE | ⏳ | 等 Schema |
| 测试 | QA | ⏳ | - |
| 部署 | Infra | ⏳ | - |

## 🔴 阻塞项

| 问题 | 影响 | 负责人 | 状态 |
|------|------|--------|------|
| (无) | - | - | - |

## 📌 关键决策

- [ADR-001: 技术选型]
- [ADR-002: API 设计]

## 📋 本周重点

1. [重点1]
2. [重点2]

---

*维护: Alex · 更新: YYYY-MM-DD HH:MM*
```

### #dev: 开发状态

```markdown
# 开发状态

## API 契约

| 模块 | 契约 | FE 确认 | BE 确认 | 状态 |
|------|------|---------|---------|------|
| 用户注册 | [链接] | ✅ | ✅ | 已定稿 |
| 用户登录 | [链接] | ✅ | 🚧 | BE 开发中 |

## 开发进度

### 前端
| 功能 | 状态 | 备注 |
|------|------|------|
| 注册页 | 🚧 | 开发中 |
| 登录页 | ⏳ | 待开始 |

### 后端
| 功能 | 状态 | 备注 |
|------|------|------|
| 注册 API | 🚧 | 开发中 |
| 登录 API | ⏳ | 待开始 |

## 联调状态

| 功能 | FE | BE | 联调 | 备注 |
|------|----|----|------|------|
| 注册 | 🚧 | 🚧 | ⏳ | - |

---

*维护: Atath · 更新: YYYY-MM-DD HH:MM*
```

### #design: 设计状态

```markdown
# 设计状态

## Design Token

**当前版本**: v1.0.0
**位置**: [链接]

## 设计任务

| 功能 | 状态 | 链接 | 备注 |
|------|------|------|------|
| 注册页 | ✅ | [Figma] | 已交付 FE |
| 登录页 | 🚧 | [Figma] | 设计中 |

## 待验收

| 功能 | FE | 还原度 | 状态 |
|------|----|----|------|
| 注册页 | FE | 待验收 | ⏳ |

## 组件库

| 组件 | 规范 | FE 实现 | 状态 |
|------|------|---------|------|
| Button | ✅ | ✅ | 完成 |
| Input | ✅ | 🚧 | FE 开发中 |

---

*维护: Atath · 更新: YYYY-MM-DD HH:MM*
```

### #ops: 运维状态

```markdown
# 运维状态

## 环境状态

| 环境 | 状态 | 版本 | 更新时间 |
|------|------|------|---------|
| Production | ✅ 正常 | v1.0.0 | 2024-01-30 |
| Staging | ✅ 正常 | v1.0.1-rc1 | 2024-01-30 |
| Dev | ✅ 正常 | latest | 2024-01-30 |

## 最近部署

| 时间 | 环境 | 版本 | 操作人 | 状态 |
|------|------|------|--------|------|
| 01-30 10:00 | Staging | v1.0.1-rc1 | Infra | ✅ |

## 告警

| 时间 | 级别 | 内容 | 状态 |
|------|------|------|------|
| (无活跃告警) | - | - | - |

## 待处理

| 任务 | 优先级 | 状态 |
|------|--------|------|
| (无) | - | - |

---

*维护: Infra · 更新: YYYY-MM-DD HH:MM*
```

---

## Canvas 更新规范

### 谁更新
| 事件 | 更新 Canvas | 由谁更新 |
|------|------------|---------|
| Sprint 开始 | #team-hub | Alex |
| 任务状态变化 | #team-hub | Alex |
| 阻塞发生/解除 | #team-hub | Alex |
| API 契约变化 | #dev | Atath |
| 设计交付 | #design | Atath |
| 部署完成 | #ops | Infra |
| 告警发生 | #ops | Infra |

### 何时更新
- **实时更新**: 阻塞发生、故障、紧急状态变化
- **定期更新**: 每天至少更新一次进度状态
- **里程碑更新**: Sprint 开始/结束、重大决策

### 更新格式
每次更新在 Canvas 底部标注：
```
*维护: [Agent] · 更新: YYYY-MM-DD HH:MM*
```

---

## Agent 恢复会话时

1. **读取 Canvas** → 了解当前状态
2. **检查 Slack 新消息** → 了解最新动态
3. **继续工作** → 不依赖会话记忆

### 恢复检查清单
- [ ] 读取所在频道 Canvas
- [ ] 检查是否有 @mention 自己的消息
- [ ] 检查是否有阻塞需要处理
- [ ] 继续上次任务或接收新任务

---

## Canvas 操作

### 获取 User Token
```bash
SLACK_USER_TOKEN=$(python3 -c "
import json
with open('$HOME/.openclaw/openclaw.json') as f:
    data = json.load(f)
print(data['channels']['slack']['accounts']['alex']['userToken'])
")
```

### 更新频道 Canvas
```bash
# 先获取频道的 canvas_id
curl -s "https://slack.com/api/conversations.info?channel=C0ACSN6CT96" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" | python3 -c "
import json,sys
data = json.load(sys.stdin)
print(data.get('channel',{}).get('properties',{}).get('canvas',{}).get('file_id',''))
"

# 更新 Canvas 内容
curl -X POST "https://slack.com/api/canvases.edit" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "canvas_id": "F0XXXXXX",
    "changes": [{
      "operation": "replace",
      "document_content": {
        "type": "markdown",
        "markdown": "# 新内容..."
      }
    }]
  }'
```

---

## 状态标记

| 标记 | 含义 |
|------|------|
| ✅ | 完成 |
| 🚧 | 进行中 |
| ⏳ | 等待/待开始 |
| 🔴 | 阻塞/紧急 |
| ⚠️ | 警告/注意 |
