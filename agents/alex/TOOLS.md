# TOOLS.md - alex

## 项目：pj-psp-design
- 本工作区用于协调与项目级文档。
- 角色相关的技术细节请放到各自 agent 的 TOOLS.md。

---

## 开发环境

### 工作区结构
```
~/team/workspace/
├── alex/          # 总协调工作区（你在这里）
├── atath/            # 产品经理
├── arch/          # 架构师
├── fe/            # 前端
├── be/            # 后端
├── dba/           # 数据库
├── qa/            # 测试
└── uiux/          # 设计
```

### 启动检查
```bash
# 进入工作区
cd ~/team/workspace/alex

# 检查项目状态
ls -la ../*/MEMORY.md  # 查看各角色最新状态

# 查看待办
cat TODO.md
```

---

## 常用命令与脚本

### 状态检查
```bash
# 查看各角色最新更新
find ../ -name "MEMORY.md" -exec echo "--- {} ---" \; -exec tail -5 {} \;

# 检查未决问题
cat ../atath/Open-questions.md

# 查看最新决策
tail -20 ../atath/Decision-log.md
```

### 文档同步
```bash
# 快速检查文档一致性
grep -r "API契约" ../{fe,be}/  # 检查接口对齐
grep -r "Schema变更" ../{be,dba}/  # 检查数据库对齐

# 查找过期文档（超过7天未更新）
find ../ -name "*.md" -mtime +7 -not -path "*/memory/*"
```

### 依赖跟踪
```bash
# 检查跨角色依赖
grep -r "依赖" ../*/MEMORY.md
grep -r "阻塞" ../*/MEMORY.md
grep -r "等待" ../*/MEMORY.md
```

---

## 文档与模板

### 必读文档
- **README.md** - 项目总览与快速启动
- **atath/PRD.md** - 产品需求文档
- **arch/Architecture.md** - 总体架构设计
- **atath/Milestones.md** - 里程碑与时间线

### 常用模板

#### 任务卡模板 (Task.md)
```markdown
# 任务: [简要描述]

## 背景
[为什么需要做这个]

## 目标
[完成后达到的状态]

## 验收标准 (DoD)
- [ ] [可检查的条件1]
- [ ] [可检查的条件2]
- [ ] [可检查的条件3]

## 负责人
[角色名] - [预计完成时间]

## 依赖
- [依赖项1: 状态]
- [依赖项2: 状态]

## 风险
[已知风险与应对]
```

#### 决策记录模板 (Decision-log.md)
```markdown
## [YYYY-MM-DD] [决策简述]

**背景**: [为什么需要做决策]

**选项**:
- A: [描述] - 优点: X / 缺点: Y
- B: [描述] - 优点: X / 缺点: Y

**决策**: 选择 [A/B]

**理由**: [为什么选这个]

**影响**: [对哪些模块/角色有影响]

**负责人**: [谁执行]
```

#### 状态报告模板 (Status.md)
```markdown
# 项目状态 - [日期]

## 总体进度
- 计划进度: [X%]
- 实际进度: [Y%]
- 偏差: [+/-Z%]

## 已完成 ✅
- [事项1]
- [事项2]

## 进行中 🚧
- [事项1] - [进度%] - [负责人]
- [事项2] - [进度%] - [负责人]

## 阻塞 🔴
- [问题] - 影响: [X] - 应对: [Y]

## Top 3 风险
1. [风险] - 概率: [H/M/L] - 影响: [H/M/L] - 应对: [X]
2. ...
3. ...

## 下一步
1. [谁] - [做什么] - [何时]
2. ...
```

---

## 规范与约定

### 文档命名规范
- **大写字母开头**: `README.md`, `AGENTS.md`
- **连字符分隔**: `Decision-log.md`, `Open-questions.md`
- **日期格式**: `Status-2024-01-15.md` (YYYY-MM-DD)

### 状态标记
- ✅ 已完成
- 🚧 进行中
- 🔴 阻塞/高风险
- ⚠️ 警告/中风险
- 💡 建议/想法
- 📌 重要/置顶

### 优先级标记
- **P0**: 阻塞发布,立即处理
- **P1**: 影响核心功能,本周内
- **P2**: 重要但不紧急,本迭代内
- **P3**: 优化改进,排期处理

### 日志规范
```markdown
# MEMORY.md 更新格式
## [YYYY-MM-DD HH:MM]
- [动作]: [具体内容]
- 影响: [X]
- 下一步: [Y]
```

---

## 质量检查工具

### 文档完整性检查
```bash
# 检查各角色必备文档
for role in atath arch fe be dba qa uiux; do
  echo "=== $role ==="
  ls ../$role/{AGENTS,SOUL,TOOLS,MEMORY}.md 2>/dev/null || echo "缺少文件!"
done
```

### 依赖关系检查
```bash
# 可视化依赖（需要 graphviz）
# 手动维护 dependencies.dot，然后:
dot -Tpng dependencies.dot -o dependencies.png
```

### 进度追踪
```markdown
# 手动维护在 Progress.md
| 里程碑 | 计划日期 | 实际日期 | 状态 | 风险 |
|--------|---------|---------|------|------|
| M1     | 2024-02 | -       | 🚧   | -    |
```

---

## 集成与协作

### 角色对接点
| 场景 | 涉及角色 | 交付物 | 验收标准 |
|------|---------|--------|---------|
| 需求启动 | PM → UIUX → Arch | PRD + 原型 + 技术方案 | PM确认范围 + Arch确认可行 |
| 接口设计 | Arch → FE + BE | API 契约文档 | FE/BE 双方签字确认 |
| Schema 变更 | DBA → BE | 迁移脚本 + DDL | BE 本地验证通过 |
| 测试计划 | QA → PM | 测试策略 + 用例 | PM 确认覆盖核心场景 |

### 定期同步
- **每日**: 各角色更新 MEMORY.md
- **每周**: alex 更新项目状态报告
- **里程碑前**: 集成验证会（全员参与）

---

## 故障排查

### 常见问题

#### Q1: 任务分配后无人响应
**排查**:
1. 检查对应角色的 MEMORY.md 是否看到任务
2. 检查任务描述是否清晰（有背景、DoD、时间框）
3. 检查是否有依赖阻塞

**解决**:
- 直接在角色的 TODO.md 中添加
- 在 MEMORY.md 中 @角色提醒
- 评估是否需要重新分配

#### Q2: 跨角色协作卡住
**排查**:
1. 识别是「流程问题」还是「技术问题」
2. 查看接口契约/文档是否对齐
3. 检查是否有隐含假设未对齐

**解决**:
- 召集小型对齐会（只拉必要角色）
- 更新共享文档（API契约/Schema/UI规格）
- 必要时请 Arch 仲裁

#### Q3: 进度严重偏离计划
**排查**:
1. 对比计划 vs 实际（哪个环节慢了）
2. 识别是「估算偏差」还是「意外问题」
3. 评估影响范围（只影响本迭代 vs 影响发布）

**解决**:
- 重新排优先级（砍掉非核心）
- 请求额外资源
- 调整里程碑（需 Pleamon 确认）

#### Q4: 文档不一致/过期
**排查**:
```bash
# 查找最近7天未更新的关键文档
find ../ -name "*.md" -mtime +7 \
  \( -name "PRD.md" -o -name "Architecture.md" -o -name "API*.md" \)
```

**解决**:
- 指定角色更新（并设定截止时间）
- 如无人维护 → 删除或归档
- 建立文档 Owner 机制

---

## 外部资源

### 官方文档
- [Markdown 语法](https://www.markdownguide.org/)
- [Git 协作流程](https://docs.github.com/en/get-started)

### 内部知识库
- `~/team/workspace/README.md` - 团队协作指南
- `~/team/workspace/CONVENTIONS.md` - 团队约定
- `arch/ADR/` - 架构决策记录索引

### 推荐工具
- **文本编辑**: VS Code / Cursor
- **绘图**: Draw.io / Mermaid
- **任务追踪**: Markdown Checklist (本地) / GitHub Issues (如需要)
