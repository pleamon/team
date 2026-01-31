# Slack Protocol Skill

version: 2.0.0

Slack 操作指南。通用规则（@mention、消息模板、响应时效、Thread 规范等）已统一到 `shared/CONVENTIONS.md`。

> **通用规则参见** `shared/CONVENTIONS.md`：
> - §2 @mention 纪律
> - §3 通信规范（频道用途、Thread 规范、消息模板、响应时效）
> - §4 上下文传递协议
> - §5 任务生命周期协议
> - §8 质量标准（状态标记）

---

## Slack 操作指南

### @mention 格式速查

触发回复（对方收到通知）：
```
<@U0AAPB65K0F> 新任务：用户注册功能 PRD
```

仅提及（不触发）：
```
这个任务涉及 Atath 和 FE 的协作，但不需要他们现在响应。
```

### 团队成员

> 完整列表参见 `skills/team-roster/SKILL.md`
