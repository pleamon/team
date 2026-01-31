# WORKSPACE-CONVENTION.md - 工作目录规范

version: 1.0.0

## 核心原则

每个 Agent 参与多个项目，**必须按项目严格隔离工作文件**，避免：
- 项目记忆混乱
- 跨项目误操作（把 B 项目的产出提交到 A 项目）
- 上下文污染

---

## 目录结构规范

```
~/team/workspace/{agent_name}/
├── projects/                    # 项目工作目录（按项目隔离）
│   ├── {project_name}/         # 如 wallet、merchant-portal
│   │   ├── src/                # 项目代码/产出
│   │   └── docs/               # 项目文档
│   └── {another_project}/
├── shared/                     # 共享约定（由 sync.sh 同步）
│   └── CONVENTIONS.md          # 团队协议 SSOT
├── AGENTS.md                   # Agent 角色定义
├── SOUL.md                     # Agent 人格
├── TOOLS.md                    # 工具使用指南
├── IDENTITY.md                 # 身份标识
├── USER.md                     # 人类信息
├── HEARTBEAT.md                # 心跳检查（如有）
├── MEMORY.md                   # 记忆文件
└── skills/                     # 共享技能（由 sync.sh 同步）
    ├── slack-protocol/
    ├── team-roster/
    └── ...
```

---

## 规则

### 1. 项目文件必须放在 projects/{project_name}/ 下
- ✅ `~/team/workspace/fe/projects/wallet/src/components/`
- ❌ `~/team/workspace/fe/src/components/`

### 2. 收到任务时，先确认项目名称
- 如果不确定当前讨论的是哪个项目，**主动询问**
- 不要假设，不要猜测

### 3. Git 操作前，确认当前目录
- `pwd` 确认在正确的项目目录
- `git remote -v` 确认关联正确的仓库

### 4. 项目切换时，明确声明
- 在 Slack 回复中说明：「切换到 {project_name} 项目」
- 避免混淆上下文

---

## 项目目录创建

首次参与新项目时：
```bash
mkdir -p ~/team/workspace/{agent_name}/projects/{project_name}
cd ~/team/workspace/{agent_name}/projects/{project_name}
git clone {repo_url} .  # 如有仓库
```

---

## 当前已知项目

| 项目名 | 仓库 | 描述 |
|--------|------|------|
| wallet | pleamon/wallet | Wallet App |
| team | pleamon/team | 团队配置与协作规范 |

（新项目由 Alex 或 Pleamon 在此登记）
