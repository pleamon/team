# HEARTBEAT.md - atath（Product Manager & Scrum Master）

## 定期检查清单（每30分钟）

### 1. 新需求检查
- 扫描 Backlog.md 中的新需求（状态为"Backlog"）
- 检查alex/MEMORY.md中是否有新的需求添加通知
- 如果有当前活跃Sprint，评估是否需要加入

**触发条件**: Backlog.md有新增内容
**行动**: 通知alex有新需求待规划

---

### 2. 进度检查（核心）
执行 `/progress-check` skill：

**检查内容**:
- 扫描所有agent的MEMORY.md
- 提取任务状态更新（✅完成、🚧进行中、🔴阻塞、⚠️风险）
- 更新Sprint-progress.md
- 计算整体进度和燃尽趋势

**检测完成任务**:
```
如果发现新的✅标记：
  → 触发 /report-complete skill
  → 更新任务状态为Done
  → 检查依赖任务是否可以开始
  → 向alex汇报完成情况
```

**检测阻塞问题**:
```
如果发现🔴阻塞标记：
  → 提取阻塞原因和任务ID
  → 更新Blockers.md
  → 升级给alex/MEMORY.md
  → 如果阻塞超过24小时，标记为高优先级
```

**检测风险**:
```
如果发现⚠️风险标记：
  → 记录到Sprint-progress.md的风险部分
  → 评估影响（时间/范围/质量）
  → 提出缓解建议
```

---

### 3. 任务分配检查
- 检查是否有新创建但未分配的任务
- 扫描tasks/目录中状态为"Todo"且无负责人的任务
- 自动调用 `/task-assign` 进行分配

---

### 4. 每日站会生成（每日9:00）
- 检查当前时间是否为9:00
- 触发 `/daily-standup` skill
- 生成Daily-standup-{DATE}.md
- 在alex/MEMORY.md中添加站会报告链接

---

### 5. Sprint健康检查
- 检查当前Sprint是否有延期风险（进度 < 预期）
- 检查是否有P0任务被阻塞
- 检查是否有agent负载过高（> 150%）
- 检查是否有agent闲置（负载 < 20%）

**告警条件**:
```
如果满足以下任一条件，向alex报告：
- Sprint进度落后 > 15%
- P0任务阻塞超过4小时
- 任何agent负载 > 150%（需要重新分配任务）
- 整体团队闲置（总负载 < 50%）
```

---

### 6. 需求疑问检查（保留原有）
- 扫描 Open-questions.md 中的未解决问题
- 检查是否有超过4小时未响应的需求疑问
- 识别开发团队在 MEMORY.md 中提出的需求问题

---

### 7. 文档同步检查
- 检查Sprint-plan.md与Sprint-progress.md的一致性
- 检查Task-assignments.md是否有遗漏的分配记录
- 检查dashboard/目录下的文件是否需要更新

---

## 提醒条件

### 立即提醒（优先级高）
- P0任务被阻塞
- Sprint进度严重落后（> 20%）
- 发现未经评审的需求变更
- 任何agent报告严重问题

### 常规提醒
- 需求疑问超过4小时未响应
- 新功能缺少验收标准
- 里程碑有延期风险
- 发现阻塞问题（非P0）

### 信息通知
- 任务完成（✅）
- 进度更新
- 每日站会生成

---

## 不提醒情况
- 所有任务进度正常
- 无新增变更
- 无阻塞问题
- agent正常工作中

---

## HEARTBEAT执行频率
- **主检查周期**: 每30分钟
- **每日站会**: 每天9:00
- **Sprint检查**: 每天一次（下午5:00）

---

## 检查脚本示例

```bash
#!/bin/bash
# atath HEARTBEAT检查脚本（伪代码）

# 1. 进度检查
/progress-check

# 2. 检查新完成任务
for agent in be fe dba qa arch uiux; do
  if grep -q "✅ T[0-9]" ${agent}/MEMORY.md; then
    /report-complete --agent $agent
  fi
done

# 3. 检查阻塞
BLOCKERS=$(grep -r "🔴" */MEMORY.md | wc -l)
if [ $BLOCKERS -gt 0 ]; then
  echo "检测到 ${BLOCKERS} 个阻塞问题" >> alex/MEMORY.md
fi

# 4. 每日站会（如果是9:00）
if [ $(date +%H:%M) == "09:00" ]; then
  /daily-standup
fi

# 5. 检查Sprint健康度
PROGRESS=$(grep "进度:" atath/Sprint-*-progress.md | tail -1 | grep -oE '[0-9]+%')
if [ ${PROGRESS%\%} -lt 50 ] && [ $(days_passed) -gt $(sprint_days / 2) ]; then
  echo "⚠️ Sprint进度落后预期" >> alex/MEMORY.md
fi
```
