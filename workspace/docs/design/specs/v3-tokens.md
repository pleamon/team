# PSP v3 Tokens 规范

> 版本：0.1.1 (Draft)
> 更新时间：2026-01-31 11:30 CST
> 状态：增补 Layout & Alignment 规则

## 1. Colors (色彩)

### Primary (品牌主色)
| Token | Value | 用途 |
|---|---|---|
| `--color-primary-50` | `#eff6ff` | 极浅背景 (Hover/Selected) |
| `--color-primary-100` | `#dbeafe` | 浅背景 |
| `--color-primary-500` | `#3b82f6` | **品牌标准色** (Button/Link) |
| `--color-primary-600` | `#2563eb` | Hover 状态 |
| `--color-primary-700` | `#1d4ed8` | Active 状态 |

### Neutral (中性色)
| Token | Value | 用途 |
|---|---|---|
| `--color-white` | `#ffffff` | 纯白背景 |
| `--color-gray-50` | `#f9fafb` | 页面底色 (Body BG) |
| `--color-gray-100` | `#f3f4f6` | 模块背景 / 浅色边框 |
| `--color-gray-200` | `#e5e7eb` | 标准边框 (Border) |
| `--color-gray-300` | `#d1d5db` | 深色边框 / 禁用态 |
| `--color-gray-500` | `#6b7280` | 次要文字 (Secondary Text) |
| `--color-gray-700` | `#374151` | 主要文字 (Primary Text) |
| `--color-gray-900` | `#111827` | 标题文字 (Heading) |

### Semantic (语义色)
| Token | Value | 用途 |
|---|---|---|
| `--color-success` | `#22c55e` | 成功 (Success) |
| `--color-warning` | `#f59e0b` | 警告 (Warning) |
| `--color-error` | `#ef4444` | 错误 (Error) |
| `--color-info` | `#3b82f6` | 信息 (Info) |

---

## 2. Typography (字体)

### Family
- Base: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Mono: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

### Scale
| Token | Size | Line Height | 用途 |
|---|---|---|---|
| `--font-xs` | `12px` | `16px` | 辅助文字 / 标签 |
| `--font-sm` | `14px` | `20px` | **正文小 (Default)** |
| `--font-base` | `16px` | `24px` | 正文大 / 导航 |
| `--font-lg` | `18px` | `28px` | 小标题 (H5) |
| `--font-xl` | `20px` | `28px` | 标题 (H4) |
| `--font-2xl` | `24px` | `32px` | 页面标题 (H3) |
| `--font-3xl` | `30px` | `36px` | 主要标题 (H2) |

---

## 3. Spacing (间距)

> 基准：4px (8pt grid system)

| Token | Value | Pixels |
|---|---|---|
| `--space-1` | `0.25rem` | `4px` |
| `--space-2` | `0.5rem` | `8px` |
| `--space-3` | `0.75rem` | `12px` |
| `--space-4` | `1rem` | `16px` |
| `--space-6` | `1.5rem` | `24px` |
| `--space-8` | `2rem` | `32px` |
| `--space-12` | `3rem` | `48px` |

---

## 4. Radius (圆角)

| Token | Value | 用途 |
|---|---|---|
| `--radius-sm` | `4px` | 小组件 (Checkbox/Tag) |
| `--radius-md` | `6px` | 标准组件 (Button/Input) |
| `--radius-lg` | `8px` | 卡片 (Card) |
| `--radius-xl` | `12px` | 模态框 (Modal) |
| `--radius-full` | `9999px` | 圆形 (Avatar/Pill) |

---

## 5. Shadow (阴影)

| Token | Value | 用途 |
|---|---|---|
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | 细微层级 |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | 悬浮卡片 / 下拉菜单 |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | 模态框 / 抽屉 |

---

## 6. Layout & Alignment (布局与对齐)

### Table & Data Grid (表格与数据网格)
| Property | Value | 说明 |
|---|---|---|
| `RowHeight` | `36px` | **标准行高 (Standard)** - 适用于高密度数据展示 (Compact Mode)；**点击/触控热区不得小于 36px**（行高即最小可点击高度） |
| `Vertical Align` | `Middle` | 单元格内容垂直居中 (Vertically Center) |
| `Text Align` | `Left` | 一般文本、标题、长描述 (Text, Titles) |
| `Number Align` | `Right` | 数字、金额、日期、百分比 (Numbers, Currency) |
| `Boolean/Status` | `Center` | 状态标签、操作图标、布尔值 (Tags, Actions) |

### General Rules (通用规则)
- **水平对齐 (Horizontal):**
  - **Left:** 阅读流文本 (Reading flow content)
  - **Right:** 需要对比量级的数值 (Comparable values)
  - **Center:** 固定的短内容或图标 (Fixed width/Icons)
- **垂直对齐 (Vertical):**
  - 所有列表/表格行内内容默认垂直居中。

### Component Alignment (组件内容对齐)
> 目的：把 Slack 口径落到可检索的规范条款，供 QA/FE 冻结与复测。

- **Button / Badge / Tag：**content alignment = **Horizontal Center + Vertical Center**（默认规则）
- **适用范围：**
  - 默认适用于 *icon only* / *text only* / *icon + text* / *loading*（含 spinner）等常见组合。
  - 组件容器使用 flex 布局时，默认采用 `justify-center` + `items-center`。
- **例外 / 待补充：**
  - 若出现「长文案换行」导致高度增大：仍以**容器内居中**为默认；如业务要求顶对齐/左对齐，需在组件规范或具体业务页面规范中单独声明。
  - 其他视觉/交互例外（如特殊 icon+text 间距、loading 位移策略等）后续若发现差异，以该组件的独立 spec 为准，并在此处补充链接。
