# team-config

团队 Agent 配置中心 — 单一事实来源。

## 结构

```
team-config/
├── README.md               # 本文件
├── shared/                 # 全员共享配置
│   └── CONVENTIONS.md      # 团队约定
├── skills/                 # 共享 Skills（所有 Agent 可用）
│   └── (待添加)
└── agents/                 # 各 Agent 独立配置
    ├── alex/               # Chief / 总协调
    ├── atath/              # PM / 产品经理
    ├── arch/               # 架构师
    ├── fe/                 # 前端工程师
    ├── be/                 # 后端工程师
    ├── dba/                # DBA
    ├── qa/                 # QA 工程师
    ├── uiux/               # UI/UX 设计师
    └── infra/              # 基础设施工程师
```

## 配置文件说明

| 文件 | 用途 | 纳入 Git |
|------|------|---------|
| `AGENTS.md` | 角色定义、职责、协作协议 | ✅ |
| `SOUL.md` | 人格、风格、行为准则 | ✅ |
| `TOOLS.md` | 工具使用指南 | ✅ |
| `IDENTITY.md` | 身份声明 | ✅ |
| `USER.md` | 用户（Pleamon）信息 | ✅ |
| `HEARTBEAT.md` | 心跳检查配置 | ✅ |
| `CAPABILITIES.md` | 能力声明 | ✅ |
| `MEMORY.md` | 运行时记忆（不纳入） | ❌ |
| `BOOTSTRAP.md` | 启动引导（不纳入） | ❌ |

## 使用方式

### Alex（维护者）
```bash
# 修改配置后
cd ~/team/team-config
git add -A && git commit -m "update: <描述>"
git push
```

### 其他 Agent（消费者）
```bash
# 同步最新配置到自己的 workspace
cd ~/team/team-config && git pull
cp agents/<agent_name>/*.md ~/team/workspace/<agent_name>/
```

### 自动同步（推荐）
可在各 Agent 的 HEARTBEAT 或启动脚本中加入 git pull + copy 逻辑。

## 管理原则
- **Alex 统一维护**：所有配置变更由 Alex 提交
- **版本化**：每次变更有 commit message 记录
- **不含运行时数据**：MEMORY.md 等运行时文件不纳入
- **不含敏感信息**：API Key、Token 等不放入仓库
