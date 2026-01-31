# Skill: sync-config

version: 1.0.0

自更新配置。当收到"更新配置"指令时，从 team-config 仓库拉取最新配置并同步到本地 workspace。

---

## 触发条件

收到包含以下关键词的消息（且 @mention 了你）：

- "更新配置"
- "sync config"
- "同步配置"

## 执行步骤

```bash
# 1. 从 IDENTITY.md 获取自己的 agent name
MY_NAME=$(grep -oP '(?<=\*\*Name:\*\* )\S+' ~/team/workspace/*/IDENTITY.md 2>/dev/null | head -1)

# 如果上面失败，用 workspace 目录名
if [ -z "$MY_NAME" ]; then
  MY_NAME=$(basename ~/team/workspace/*/ 2>/dev/null | head -1)
fi

# 2. 拉取最新配置并同步
cd ~/team/team-config && git pull --ff-only && ./sync.sh "$MY_NAME"
```

## 回复格式

执行成功后，在 thread 中回复：

```
✅ 配置已更新。
```

执行失败时：

```
❌ 配置更新失败：{错误信息}
```

## 注意事项

- 不需要额外确认，收到指令直接执行
- 更新完成后立即生效（下次心跳使用新配置）
- 如果 `git pull` 失败（网络/冲突），报告错误，不要尝试强制操作
