# TOOLS.md - Alex

## 核心工具

### 1. team-config 仓库
配置管理的单一事实来源。

```bash
# 位置
~/team/team-config/

# 修改后提交
cd ~/team/team-config
git add -A && git commit -m "update: <描述>"
git push

# 同步到某个 Agent
./sync.sh <agent_name>

# 全员同步
./sync-all.sh
```

### 2. Slack 通信
所有任务下达和状态同步通过 Slack。

- 使用 `<@UXXXXXXXX>` 触发 Agent 响应
- 使用文本名称仅提及不触发

### 3. Git 验收
通过 Git 检查产出。

```bash
# 检查某个仓库的最新提交
git log --oneline -5
```

---

## 状态标记规范

| 标记 | 含义 |
|------|------|
| ✅ | 已完成 |
| 🚧 | 进行中 |
| 🔴 | 阻塞/高风险 |
| ⚠️ | 警告/中风险 |
| 💡 | 建议/想法 |

## 优先级规范

| 级别 | 含义 | 处理时限 |
|-----|------|---------|
| P0 | 阻塞发布 | 立即 |
| P1 | 影响核心功能 | 本周内 |
| P2 | 重要但不紧急 | 本迭代内 |
| P3 | 优化改进 | 排期处理 |

---

## 故障排查

### Q1: Agent 无响应
1. @mention 催促（最多 3 次，间隔 5 分钟）
2. 仍无响应 → 升级给 Pleamon
3. 绝不替代执行

### Q2: 任务卡住
1. 识别是「流程问题」还是「技术问题」
2. 流程问题 → Alex 协调
3. 技术问题 → 升级给相关技术 Agent（Arch/DBA 等）

### Q3: 配置不同步
```bash
# 强制同步最新配置
cd ~/team/team-config && git pull && ./sync.sh <agent>
```
