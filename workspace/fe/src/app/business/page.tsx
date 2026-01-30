export default function BusinessPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[24px] font-bold text-[var(--color-text-primary)]">Business</h1>
        <p className="mt-2 text-[14px] text-[var(--color-text-secondary)]">
          业务规则与使用规范：让业务组件/表单/错误处理/状态管理保持一致。
        </p>
      </header>

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)] p-6">
        <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)]">业务组件规则</h2>
        <ul className="mt-3 list-disc pl-5 text-[14px] text-[var(--color-text-secondary)] space-y-2">
          <li>业务组件必须基于 Design Layer（src/components/design）组合，不直接硬编码颜色/阴影/圆角。</li>
          <li>统一状态：Loading / Empty / Error / Disabled，优先使用 Empty 与 Skeleton。</li>
          <li>所有业务表单字段都应提供 label、错误提示、可访问性属性（aria-*)。</li>
        </ul>
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)] p-6">
        <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)]">表单验证规范</h2>
        <ul className="mt-3 list-disc pl-5 text-[14px] text-[var(--color-text-secondary)] space-y-2">
          <li>前端校验：必填、格式（邮箱/手机号/金额）、长度、跨字段依赖（如开始/结束日期）。</li>
          <li>错误提示：靠近字段展示，描述可执行的修正动作，避免仅展示错误码。</li>
          <li>提交策略：提交中禁用关键按钮；失败保留用户输入；成功给予明确反馈。</li>
        </ul>
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)] p-6">
        <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)]">错误处理规范</h2>
        <ul className="mt-3 list-disc pl-5 text-[14px] text-[var(--color-text-secondary)] space-y-2">
          <li>网络错误：建议展示可重试操作（Retry）并保留当前页面上下文。</li>
          <li>权限错误：解释原因（无权限/登录过期）并提供下一步（申请权限/重新登录）。</li>
          <li>服务端错误：降级为 Empty(error-server)，并记录可观测信息（request id 等）。</li>
        </ul>
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)] p-6">
        <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)]">状态管理规范</h2>
        <ul className="mt-3 list-disc pl-5 text-[14px] text-[var(--color-text-secondary)] space-y-2">
          <li>页面状态优先分层：页面级（route）/模块级（card、table）/控件级（button、field）。</li>
          <li>数据请求状态：Loading 使用 Skeleton；空数据使用 Empty；错误使用 Empty(error-*)。</li>
          <li>避免“全屏 Spinner”遮盖已加载区域，减少感知等待。</li>
        </ul>
      </section>
    </div>
  )
}
