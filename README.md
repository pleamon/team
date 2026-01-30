# team-config

团队 Agent 配置中心 — 单一事实来源。

## 结构

```
team-config/
├── README.md               # 本文件
├── shared/                 # 全员共享配置
│   └── CONVENTIONS.md      # 团队约定
├── skills/                 # 共享 Skills（所有 Agent 可用）
│   └── team-roster/        # 团队成员目录
│       └── SKILL.md
└── agents/                 # 各 Agent 独立配置
    ├── alex/               # Chief / 总协调
    │   ├── AGENTS.md
    │   ├── SOUL.md
    │   ├── TOOLS.md
    │   ├── ...
    │   └── skills/         # Alex 专属 Skills
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

## 同步方式

### 完整同步（推荐）
```bash
cd ~/team/team-config && git pull

AGENT=alex  # 替换为当前 Agent 名称
WORKSPACE=~/team/workspace/$AGENT

# 1. 同步 Agent 配置文件
cp agents/$AGENT/*.md $WORKSPACE/

# 2. 同步共享 Skills → workspace/skills/
mkdir -p $WORKSPACE/skills
cp -r skills/* $WORKSPACE/skills/

# 3. 同步 Agent 专属 Skills（如有）
if [ -d "agents/$AGENT/skills" ]; then
  cp -r agents/$AGENT/skills/* $WORKSPACE/skills/
fi
```

### 目标效果
同步后 Agent workspace 结构：
```
~/team/workspace/alex/
├── AGENTS.md          ← from agents/alex/
├── SOUL.md            ← from agents/alex/
├── TOOLS.md           ← from agents/alex/
├── MEMORY.md          ← 本地运行时，不同步
├── skills/
│   ├── team-roster/   ← from skills/ (共享)
│   │   └── SKILL.md
│   └── slack/         ← from agents/alex/skills/ (专属) 或已有
│       └── SKILL.md
└── ...
```

### Alex（维护者）
```bash
# 修改配置后
cd ~/team/team-config
git add -A && git commit -m "update: <描述>"
git push
```

### 其他 Agent（消费者）
```bash
# 拉取 + 同步到 workspace
cd ~/team/team-config && git pull
AGENT=<agent_name>
cp agents/$AGENT/*.md ~/team/workspace/$AGENT/
mkdir -p ~/team/workspace/$AGENT/skills
cp -r skills/* ~/team/workspace/$AGENT/skills/
```

## 管理原则
- **Alex 统一维护**：所有配置变更由 Alex 提交
- **版本化**：每次变更有 commit message 记录
- **不含运行时数据**：MEMORY.md 等运行时文件不纳入
- **不含敏感信息**：API Key、Token 等不放入仓库
