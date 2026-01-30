# TOOLS.md - UIUX

## 设计工具
- **Figma**：原型 & 高保真设计
- **FigJam**：用户流程图、头脑风暴
- **Markdown**：设计规范文档

---

## 设计规范模板

### Design Token 模板
```markdown
# Design Token

## Colors
| Token | Value | 用途 |
|-------|-------|------|
| --color-primary | #3B82F6 | 主色 |
| --color-primary-hover | #2563EB | 主色悬停 |
| --color-error | #EF4444 | 错误提示 |
| --color-success | #22C55E | 成功提示 |
| --color-text-primary | #1F2937 | 主文本 |
| --color-text-secondary | #6B7280 | 次文本 |
| --color-bg-primary | #FFFFFF | 主背景 |
| --color-bg-secondary | #F3F4F6 | 次背景 |

## Typography
| Token | Value | 用途 |
|-------|-------|------|
| --font-family | Inter, sans-serif | 正文 |
| --font-size-xs | 12px | 辅助文字 |
| --font-size-sm | 14px | 正文小 |
| --font-size-base | 16px | 正文 |
| --font-size-lg | 18px | 标题小 |
| --font-size-xl | 20px | 标题中 |
| --font-size-2xl | 24px | 标题大 |

## Spacing
| Token | Value |
|-------|-------|
| --spacing-xs | 4px |
| --spacing-sm | 8px |
| --spacing-md | 16px |
| --spacing-lg | 24px |
| --spacing-xl | 32px |

## Border Radius
| Token | Value |
|-------|-------|
| --radius-sm | 4px |
| --radius-md | 8px |
| --radius-lg | 12px |
| --radius-full | 9999px |

## Shadow
| Token | Value |
|-------|-------|
| --shadow-sm | 0 1px 2px rgba(0,0,0,0.05) |
| --shadow-md | 0 4px 6px rgba(0,0,0,0.1) |
| --shadow-lg | 0 10px 15px rgba(0,0,0,0.1) |
```

### 组件规范模板
```markdown
# [组件名] 组件规范

## 概述
[组件用途描述]

## Variants（变体）
- Primary：主要操作
- Secondary：次要操作
- Ghost：轻量操作

## States（状态）
| 状态 | 说明 | 视觉变化 |
|------|------|---------|
| Default | 默认状态 | - |
| Hover | 鼠标悬停 | 背景加深 |
| Active | 点击中 | 背景更深 |
| Focused | 键盘焦点 | 显示焦点环 |
| Disabled | 禁用 | 50% 透明度 |
| Loading | 加载中 | 显示 spinner |

## Sizes（尺寸）
| 尺寸 | 高度 | 内边距 | 字号 |
|------|------|-------|------|
| Small | 32px | 12px 16px | 14px |
| Medium | 40px | 12px 20px | 16px |
| Large | 48px | 16px 24px | 18px |

## 可访问性
- 最小点击区域：44x44px
- 焦点状态必须可见
- 对比度符合 WCAG AA 标准

## 使用示例
[截图或代码示例]
```

---

## 设计验收模板
```markdown
## 设计验收报告

**页面/组件**：[名称]
**FE 负责人**：[FE]
**验收时间**：[时间]

### 还原度评估
| 项目 | 评估 | 备注 |
|------|------|------|
| 布局 | ✅/⚠️/❌ | |
| 间距 | ✅/⚠️/❌ | |
| 颜色 | ✅/⚠️/❌ | |
| 字体 | ✅/⚠️/❌ | |
| 交互 | ✅/⚠️/❌ | |
| 响应式 | ✅/⚠️/❌ | |

### 问题清单
| # | 问题 | 设计稿 | 实际 | 优先级 |
|---|------|-------|------|-------|
| 1 | ... | [截图] | [截图] | 高/中/低 |

### 结论
[通过 / 需修改后复验]
```

---

## 状态标记
| 标记 | 含义 |
|------|------|
| ✅ | 符合设计 |
| ⚠️ | 有偏差但可接受 |
| ❌ | 不符合，需修改 |

---

## GitHub Issue 任务管理

### 查看分配给我的任务

```bash
gh issue list --assignee @me --repo "pleamon/team"
```

### 更新任务状态

```bash
# 开始任务
gh issue edit 123 --add-label "status:in-progress" --repo "pleamon/team"
gh issue comment 123 --body "开始开发。执行计划：<步骤>；预期产出：<Figma/文档路径/链接>；风险/依赖：<无/说明>" --repo "pleamon/team"

# 任务阻塞
gh issue edit 123 --add-label "status:blocked" --repo "pleamon/team"
gh issue comment 123 --body "阻塞：[原因]" --repo "pleamon/team"

# 完成，请求审核
gh issue edit 123 \
  --remove-label "status:in-progress" \
  --add-label "status:review,qa:pending" \
  --repo "pleamon/team"
gh issue comment 123 --body "开发完成，请 @qa 审核\nPR: #456" --repo "pleamon/team"
```

### 提交代码关联 Issue

```bash
# Commit 消息引用 Issue（合并时自动关闭）
git commit -m "feat(xxx): description. Closes #123"
```

> 详细规范参见 `skills/github-project/SKILL.md`
