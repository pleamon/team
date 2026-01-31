# Skill: sync-config

version: 1.1.0

自更新配置。当收到"更新配置"指令时，从 team-config 仓库拉取最新配置并同步到本地 workspace，然后汇报版本号。

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

# 3. 读取更新后的版本号
AGENTS_VERSION=$(grep -oP '(?<=^version: ).+' ~/team/workspace/$MY_NAME/AGENTS.md)
CONVENTIONS_VERSION=$(grep -oP '(?<=^version: ).+' ~/team/workspace/$MY_NAME/shared/CONVENTIONS.md)
```

## 回复格式

执行成功后，在 thread 中回复：

```
✅ 配置已更新。
AGENTS.md: {version}
CONVENTIONS.md: {version}
```

执行失败时：

```
❌ 配置更新失败：{错误信息}
```

## 验证

Pleamon 收到所有 Agent 的回复后，对比版本号：
- 所有 Agent 的 AGENTS.md 版本一致 → 同步成功
- 有 Agent 版本不一致 → 该 Agent 同步失败，需要排查

## 注意事项

- 不需要额外确认，收到指令直接执行
- 更新完成后立即生效（下次心跳使用新配置）
- 如果 `git pull` 失败（网络/冲突），报告错误，不要尝试强制操作
- **必须汇报版本号**，这是 Pleamon 验证同步是否成功的依据
