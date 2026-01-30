# TOOLS.md - UIUX

## 设计工具
- Figma：原型 & 高保真设计
- FigJam：用户流程图
- Markdown：设计规范文档

## 设计规范结构
```
design/
├── tokens/           # Design Token
│   ├── colors.md
│   ├── typography.md
│   └── spacing.md
├── components/       # 组件规范
│   ├── button.md
│   ├── input.md
│   └── ...
└── patterns/         # 设计模式
    ├── forms.md
    └── navigation.md
```

## 组件规范模板
```markdown
# Button 组件规范

## Variants
- Primary / Secondary / Ghost

## States
- Default / Hover / Active / Disabled

## Sizes
- Small (28px) / Medium (36px) / Large (44px)

## Spacing
- Padding: 8px 16px

## 可访问性
- 最小点击区域: 44x44px
- 焦点状态可见
```
