# Slack Extended (slackex) Skill

version: 1.0.0

Slack 高级功能扩展。通过 User Token 调用 Slack API，实现 Canvas、Reminder、DND、Status、Usergroup、Search、Bookmark 等功能。

## User Token 获取

User Token 存储在 OpenClaw 配置中，路径：
```
~/.openclaw/openclaw.json → channels.slack.accounts.<agent>.userToken
```

### 获取当前 Agent 的 User Token
```bash
# 方法1: 使用 jq
AGENT_NAME="alex"  # 替换为当前 agent 名称
SLACK_USER_TOKEN=$(cat ~/.openclaw/openclaw.json | jq -r ".channels.slack.accounts.${AGENT_NAME}.userToken")

# 方法2: 使用 python
SLACK_USER_TOKEN=$(python3 -c "
import json
with open('$HOME/.openclaw/openclaw.json') as f:
    data = json.load(f)
print(data['channels']['slack']['accounts']['${AGENT_NAME}']['userToken'])
")

echo $SLACK_USER_TOKEN  # 应该是 xoxp-... 格式
```

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

## 快速开始

### 一键获取 Token 并设置
```bash
# 在脚本开头加入（替换 alex 为你的 agent 名称）
AGENT_NAME="alex"
SLACK_USER_TOKEN=$(cat ~/.openclaw/openclaw.json | jq -r ".channels.slack.accounts.${AGENT_NAME}.userToken")
```

### 或者创建辅助函数
```bash
get_slack_token() {
  local agent="${1:-alex}"
  cat ~/.openclaw/openclaw.json | jq -r ".channels.slack.accounts.${agent}.userToken"
}

# 使用
SLACK_USER_TOKEN=$(get_slack_token alex)
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
# 创建频道 Canvas
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
# 在指定时间提醒（Unix timestamp）
curl -X POST "https://slack.com/api/reminders.add" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "检查项目进度",
    "time": "1700000000"
  }'

# 使用自然语言时间
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

---

## Search（搜索）

### 搜索消息
```bash
curl -X GET "https://slack.com/api/search.messages?query=关键词&count=20" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"
```

### 搜索语法
| 语法 | 说明 | 示例 |
|------|------|------|
| `in:channel` | 指定频道 | `in:general` |
| `from:@user` | 指定发送者 | `from:@alex` |
| `before:date` | 之前 | `before:2024-01-01` |
| `after:date` | 之后 | `after:2024-01-01` |
| `has:star` | 有星标 | `has:star` |
| `has:link` | 有链接 | `has:link` |

### 搜索文件
```bash
curl -X GET "https://slack.com/api/search.files?query=报告" \
  -H "Authorization: Bearer $SLACK_USER_TOKEN"
```

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
将此脚本放在 workspace 中方便调用：

```bash
#!/bin/bash
# slackex.sh - Slack Extended API Helper
# Usage: ./slackex.sh <agent> <action> [params...]
# Example: ./slackex.sh alex canvas-create "标题" "# 内容"

set -e

AGENT="${1:?Usage: ./slackex.sh <agent> <action> [params...]}"
ACTION="${2:?Missing action}"
shift 2

# 从 openclaw.json 获取 token
SLACK_USER_TOKEN=$(cat ~/.openclaw/openclaw.json | jq -r ".channels.slack.accounts.${AGENT}.userToken")

if [ "$SLACK_USER_TOKEN" = "null" ] || [ -z "$SLACK_USER_TOKEN" ]; then
  echo "Error: 未找到 agent '$AGENT' 的 userToken"
  exit 1
fi

BASE_URL="https://slack.com/api"

case "$ACTION" in
  canvas-create)
    curl -sX POST "$BASE_URL/canvases.create" \
      -H "Authorization: Bearer $SLACK_USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"title\": \"$1\", \"document_content\": {\"type\": \"markdown\", \"markdown\": \"$2\"}}"
    ;;
  reminder-add)
    curl -sX POST "$BASE_URL/reminders.add" \
      -H "Authorization: Bearer $SLACK_USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"text\": \"$1\", \"time\": \"$2\"}"
    ;;
  dnd-snooze)
    curl -sX POST "$BASE_URL/dnd.setSnooze" \
      -H "Authorization: Bearer $SLACK_USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"num_minutes\": $1}"
    ;;
  dnd-end)
    curl -sX POST "$BASE_URL/dnd.endSnooze" \
      -H "Authorization: Bearer $SLACK_USER_TOKEN"
    ;;
  status-set)
    curl -sX POST "$BASE_URL/users.profile.set" \
      -H "Authorization: Bearer $SLACK_USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"profile\": {\"status_text\": \"$1\", \"status_emoji\": \"$2\"}}"
    ;;
  status-clear)
    curl -sX POST "$BASE_URL/users.profile.set" \
      -H "Authorization: Bearer $SLACK_USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"profile": {"status_text": "", "status_emoji": ""}}'
    ;;
  search)
    curl -sX GET "$BASE_URL/search.messages?query=$(echo "$1" | jq -sRr @uri)&count=20" \
      -H "Authorization: Bearer $SLACK_USER_TOKEN"
    ;;
  *)
    echo "Unknown action: $ACTION"
    echo "Available: canvas-create, reminder-add, dnd-snooze, dnd-end, status-set, status-clear, search"
    exit 1
    ;;
esac
```

### 使用示例
```bash
# 创建 Canvas
./slackex.sh alex canvas-create "项目状态" "# Sprint 5\n\n- 进行中..."

# 创建提醒
./slackex.sh alex reminder-add "检查进度" "in 2 hours"

# 开启勿扰 60 分钟
./slackex.sh alex dnd-snooze 60

# 设置状态
./slackex.sh alex status-set "专注中" ":headphones:"

# 搜索消息
./slackex.sh alex search "项目进度"
```

---

## 错误处理

所有 API 返回 JSON，检查 `ok` 字段：
```json
{"ok": true, ...}
{"ok": false, "error": "invalid_auth"}
```

常见错误：
| 错误 | 原因 |
|------|------|
| `invalid_auth` | Token 无效或过期 |
| `missing_scope` | Token 缺少所需权限 |
| `channel_not_found` | 频道不存在 |
| `user_not_found` | 用户不存在 |
| `rate_limited` | 请求过于频繁 |
