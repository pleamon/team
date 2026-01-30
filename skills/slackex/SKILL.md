# Slack Extended (slackex) Skill

version: 1.0.0

Slack 高级功能扩展。通过 User Token 调用 Slack API，实现 Canvas、Reminder、DND、Status、Usergroup、Search、Bookmark 等功能。

## 前置条件

### User Token
需要有 `xoxp-` 开头的 User Token（不是 Bot Token `xoxb-`）。

获取方式：
1. 创建 Slack App，启用 User Token Scopes
2. 安装到 Workspace，获取 User OAuth Token

### 所需 Scopes
| 功能 | 所需 Scope |
|------|-----------|
| Canvas | `canvases:read`, `canvases:write` |
| Reminder | `reminders:read`, `reminders:write` |
| DND | `dnd:read`, `dnd:write` |
| Status | `users.profile:read`, `users.profile:write` |
| Usergroup | `usergroups:read`, `usergroups:write` |
| Search | `search:read` |
| Bookmark | `bookmarks:read`, `bookmarks:write` |

---

## 使用方式

所有 API 调用通过 `exec` 执行 `curl` 命令。

### 环境变量
```bash
export SLACK_USER_TOKEN="xoxp-your-user-token"
```

---

## Canvas（画布）

### 创建 Canvas
```bash
curl -X POST "https://slack.com/api/canvases.create" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "项目状态",
    "document_content": {
      "type": "markdown",
      "markdown": "# 项目状态\n\n## 进行中\n- 任务1\n- 任务2"
    }
  }'
```

### 编辑 Canvas
```bash
curl -X POST "https://slack.com/api/canvases.edit" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "canvas_id": "F0123456789",
    "changes": [
      {
        "operation": "replace",
        "document_content": {
          "type": "markdown",
          "markdown": "# 更新后的内容"
        }
      }
    ]
  }'
```

### 删除 Canvas
```bash
curl -X POST "https://slack.com/api/canvases.delete" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"canvas_id": "F0123456789"}'
```

### 查看 Canvas 内容
```bash
curl -X POST "https://slack.com/api/canvases.sections.lookup" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"canvas_id": "F0123456789"}'
```

### 在频道中设置 Canvas
```bash
# 获取频道信息（包含 canvas_id）
curl -X GET "https://slack.com/api/conversations.info?channel=C0123456789" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"

# 创建频道 Canvas（如果没有）
curl -X POST "https://slack.com/api/conversations.canvases.create" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel_id": "C0123456789",
    "document_content": {
      "type": "markdown",
      "markdown": "# 频道 Canvas\n\n内容..."
    }
  }'
```

---

## Reminder（提醒）

### 创建提醒
```bash
# 在指定时间提醒
curl -X POST "https://slack.com/api/reminders.add" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "检查项目进度",
    "time": "1700000000"
  }'

# 在指定时间提醒（使用自然语言）
curl -X POST "https://slack.com/api/reminders.add" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "检查项目进度",
    "time": "in 2 hours"
  }'

# 提醒其他用户
curl -X POST "https://slack.com/api/reminders.add" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "提交周报",
    "time": "Friday at 5pm",
    "user": "U0123456789"
  }'
```

### 列出提醒
```bash
curl -X GET "https://slack.com/api/reminders.list" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"
```

### 删除提醒
```bash
curl -X POST "https://slack.com/api/reminders.delete" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reminder": "Rm0123456789"}'
```

### 完成提醒
```bash
curl -X POST "https://slack.com/api/reminders.complete" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reminder": "Rm0123456789"}'
```

---

## DND（勿扰模式）

### 开启勿扰
```bash
# 开启指定分钟数
curl -X POST "https://slack.com/api/dnd.setSnooze" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"num_minutes": 60}'
```

### 关闭勿扰
```bash
curl -X POST "https://slack.com/api/dnd.endSnooze" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"
```

### 结束 DND
```bash
curl -X POST "https://slack.com/api/dnd.endDnd" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"
```

### 查询 DND 状态
```bash
# 查询自己
curl -X GET "https://slack.com/api/dnd.info" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"

# 查询其他用户
curl -X GET "https://slack.com/api/dnd.info?user=U0123456789" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"

# 批量查询
curl -X GET "https://slack.com/api/dnd.teamInfo?users=U0123456789,U0987654321" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"
```

---

## Status（状态）

### 设置状态
```bash
curl -X POST "https://slack.com/api/users.profile.set" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "status_text": "专注工作中",
      "status_emoji": ":headphones:",
      "status_expiration": 0
    }
  }'

# 带过期时间（Unix timestamp）
curl -X POST "https://slack.com/api/users.profile.set" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "status_text": "午餐",
      "status_emoji": ":fork_and_knife:",
      "status_expiration": 1700000000
    }
  }'
```

### 清除状态
```bash
curl -X POST "https://slack.com/api/users.profile.set" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "status_text": "",
      "status_emoji": ""
    }
  }'
```

### 获取用户 Profile
```bash
curl -X GET "https://slack.com/api/users.profile.get?user=U0123456789" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"
```

---

## Usergroup（用户组）

### 列出用户组
```bash
curl -X GET "https://slack.com/api/usergroups.list?include_users=true" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"
```

### 创建用户组
```bash
curl -X POST "https://slack.com/api/usergroups.create" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "前端团队",
    "handle": "frontend",
    "description": "前端开发人员"
  }'
```

### 更新用户组成员
```bash
curl -X POST "https://slack.com/api/usergroups.users.update" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "usergroup": "S0123456789",
    "users": "U0123456789,U0987654321"
  }'
```

### 启用/禁用用户组
```bash
# 启用
curl -X POST "https://slack.com/api/usergroups.enable" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"usergroup": "S0123456789"}'

# 禁用
curl -X POST "https://slack.com/api/usergroups.disable" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"usergroup": "S0123456789"}'
```

---

## Search（搜索）

### 搜索消息
```bash
curl -X GET "https://slack.com/api/search.messages?query=关键词&count=20" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"

# 高级搜索（指定频道、时间范围等）
curl -X GET "https://slack.com/api/search.messages?query=in:general+from:@alex+关键词&sort=timestamp" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"
```

### 搜索文件
```bash
curl -X GET "https://slack.com/api/search.files?query=报告" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"
```

### 搜索全部（消息+文件）
```bash
curl -X GET "https://slack.com/api/search.all?query=关键词" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"
```

### 搜索语法
| 语法 | 说明 | 示例 |
|------|------|------|
| `in:channel` | 指定频道 | `in:general` |
| `from:@user` | 指定发送者 | `from:@alex` |
| `to:@user` | 发给某人 | `to:@me` |
| `before:date` | 之前 | `before:2024-01-01` |
| `after:date` | 之后 | `after:2024-01-01` |
| `has:star` | 有星标 | `has:star` |
| `has:link` | 有链接 | `has:link` |
| `has:reaction` | 有反应 | `has::thumbsup:` |

---

## Bookmark（书签）

### 添加书签
```bash
curl -X POST "https://slack.com/api/bookmarks.add" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel_id": "C0123456789",
    "title": "项目文档",
    "type": "link",
    "link": "https://docs.example.com"
  }'
```

### 列出书签
```bash
curl -X POST "https://slack.com/api/bookmarks.list" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channel_id": "C0123456789"}'
```

### 编辑书签
```bash
curl -X POST "https://slack.com/api/bookmarks.edit" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel_id": "C0123456789",
    "bookmark_id": "Bk0123456789",
    "title": "新标题"
  }'
```

### 删除书签
```bash
curl -X POST "https://slack.com/api/bookmarks.remove" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel_id": "C0123456789",
    "bookmark_id": "Bk0123456789"
  }'
```

---

## 辅助脚本

### slackex.sh
可以创建一个辅助脚本简化调用：

```bash
#!/bin/bash
# slackex.sh - Slack Extended API Helper
# Usage: ./slackex.sh <action> [params...]

SLACK_USER_TOKEN="${SLACK_USER_TOKEN:?请设置 SLACK_USER_TOKEN 环境变量}"
BASE_URL="https://slack.com/api"

case "$1" in
  canvas-create)
    curl -sX POST "$BASE_URL/canvases.create" \
      -H "Authorization: Bearer $SLACK_USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"title\": \"$2\", \"document_content\": {\"type\": \"markdown\", \"markdown\": \"$3\"}}"
    ;;
  reminder-add)
    curl -sX POST "$BASE_URL/reminders.add" \
      -H "Authorization: Bearer $SLACK_USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"text\": \"$2\", \"time\": \"$3\"}"
    ;;
  dnd-snooze)
    curl -sX POST "$BASE_URL/dnd.setSnooze" \
      -H "Authorization: Bearer $SLACK_USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"num_minutes\": $2}"
    ;;
  status-set)
    curl -sX POST "$BASE_URL/users.profile.set" \
      -H "Authorization: Bearer $SLACK_USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"profile\": {\"status_text\": \"$2\", \"status_emoji\": \"$3\"}}"
    ;;
  search)
    curl -sX GET "$BASE_URL/search.messages?query=$(echo "$2" | jq -sRr @uri)&count=20" \
      -H "Authorization: Bearer $SLACK_USER_TOKEN"
    ;;
  *)
    echo "Usage: ./slackex.sh <action> [params...]"
    echo "Actions: canvas-create, reminder-add, dnd-snooze, status-set, search"
    ;;
esac
```

---

## 常见用例

### 创建项目状态 Canvas
```bash
curl -X POST "https://slack.com/api/canvases.create" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sprint 5 状态",
    "document_content": {
      "type": "markdown",
      "markdown": "# Sprint 5 状态\n\n## 进行中 🚧\n- T-01: 用户注册 @FE\n- T-02: 注册 API @BE\n\n## 完成 ✅\n- T-00: PRD 编写\n\n## 阻塞 🔴\n- 无"
    }
  }'
```

### 设置专注模式
```bash
# 设置状态 + 开启 DND
curl -X POST "https://slack.com/api/users.profile.set" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"profile": {"status_text": "专注工作中", "status_emoji": ":headphones:"}}'

curl -X POST "https://slack.com/api/dnd.setSnooze" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"num_minutes": 120}'
```

### 创建每日站会提醒
```bash
curl -X POST "https://slack.com/api/reminders.add" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "每日站会",
    "time": "every weekday at 10am"
  }'
```

---

## 错误处理

所有 API 返回 JSON，检查 `ok` 字段：
```json
{
  "ok": true,
  ...
}

{
  "ok": false,
  "error": "invalid_auth"
}
```

常见错误：
| 错误 | 原因 |
|------|------|
| `invalid_auth` | Token 无效或过期 |
| `missing_scope` | Token 缺少所需权限 |
| `channel_not_found` | 频道不存在 |
| `user_not_found` | 用户不存在 |
| `rate_limited` | 请求过于频繁 |
