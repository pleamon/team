#!/bin/bash
# init-labels.sh - 初始化 GitHub Labels
# Usage: ./init-labels.sh <owner/repo>
# Example: ./init-labels.sh pleamon/team

set -e

REPO="${1:?Usage: ./init-labels.sh <owner/repo>}"

echo "🏷️  初始化 Labels for $REPO"

# 角色 Labels（蓝色系）
gh label create "role:pm" --description "产品经理任务" --color "0052CC" --repo "$REPO" 2>/dev/null || gh label edit "role:pm" --description "产品经理任务" --color "0052CC" --repo "$REPO"
gh label create "role:uiux" --description "设计任务" --color "1D76DB" --repo "$REPO" 2>/dev/null || gh label edit "role:uiux" --description "设计任务" --color "1D76DB" --repo "$REPO"
gh label create "role:arch" --description "架构任务" --color "0E8A16" --repo "$REPO" 2>/dev/null || gh label edit "role:arch" --description "架构任务" --color "0E8A16" --repo "$REPO"
gh label create "role:fe" --description "前端任务" --color "5319E7" --repo "$REPO" 2>/dev/null || gh label edit "role:fe" --description "前端任务" --color "5319E7" --repo "$REPO"
gh label create "role:be" --description "后端任务" --color "006B75" --repo "$REPO" 2>/dev/null || gh label edit "role:be" --description "后端任务" --color "006B75" --repo "$REPO"
gh label create "role:dba" --description "数据库任务" --color "1D76DB" --repo "$REPO" 2>/dev/null || gh label edit "role:dba" --description "数据库任务" --color "1D76DB" --repo "$REPO"
gh label create "role:qa" --description "测试任务" --color "0052CC" --repo "$REPO" 2>/dev/null || gh label edit "role:qa" --description "测试任务" --color "0052CC" --repo "$REPO"
gh label create "role:infra" --description "运维任务" --color "006B75" --repo "$REPO" 2>/dev/null || gh label edit "role:infra" --description "运维任务" --color "006B75" --repo "$REPO"
echo "  ✓ 角色 Labels"

# 优先级 Labels
gh label create "P0-blocker" --description "阻塞发布，立即处理" --color "B60205" --repo "$REPO" 2>/dev/null || gh label edit "P0-blocker" --description "阻塞发布，立即处理" --color "B60205" --repo "$REPO"
gh label create "P1-critical" --description "影响核心功能，本周内" --color "D93F0B" --repo "$REPO" 2>/dev/null || gh label edit "P1-critical" --description "影响核心功能，本周内" --color "D93F0B" --repo "$REPO"
gh label create "P2-normal" --description "重要但不紧急，本迭代内" --color "FBCA04" --repo "$REPO" 2>/dev/null || gh label edit "P2-normal" --description "重要但不紧急，本迭代内" --color "FBCA04" --repo "$REPO"
gh label create "P3-low" --description "优化改进，排期处理" --color "C2E0C6" --repo "$REPO" 2>/dev/null || gh label edit "P3-low" --description "优化改进，排期处理" --color "C2E0C6" --repo "$REPO"
echo "  ✓ 优先级 Labels"

# 类型 Labels
gh label create "type:feature" --description "新功能" --color "0E8A16" --repo "$REPO" 2>/dev/null || gh label edit "type:feature" --description "新功能" --color "0E8A16" --repo "$REPO"
gh label create "type:bug" --description "Bug 修复" --color "D73A4A" --repo "$REPO" 2>/dev/null || gh label edit "type:bug" --description "Bug 修复" --color "D73A4A" --repo "$REPO"
gh label create "type:design" --description "设计任务" --color "7057FF" --repo "$REPO" 2>/dev/null || gh label edit "type:design" --description "设计任务" --color "7057FF" --repo "$REPO"
gh label create "type:infra" --description "基础设施" --color "008672" --repo "$REPO" 2>/dev/null || gh label edit "type:infra" --description "基础设施" --color "008672" --repo "$REPO"
gh label create "type:docs" --description "文档" --color "0075CA" --repo "$REPO" 2>/dev/null || gh label edit "type:docs" --description "文档" --color "0075CA" --repo "$REPO"
gh label create "type:refactor" --description "重构" --color "A2EEEF" --repo "$REPO" 2>/dev/null || gh label edit "type:refactor" --description "重构" --color "A2EEEF" --repo "$REPO"
gh label create "type:test" --description "测试" --color "BFD4F2" --repo "$REPO" 2>/dev/null || gh label edit "type:test" --description "测试" --color "BFD4F2" --repo "$REPO"
echo "  ✓ 类型 Labels"

# 状态 Labels
gh label create "status:ready" --description "准备就绪，可开始" --color "C5DEF5" --repo "$REPO" 2>/dev/null || gh label edit "status:ready" --description "准备就绪，可开始" --color "C5DEF5" --repo "$REPO"
gh label create "status:in-progress" --description "进行中" --color "5319E7" --repo "$REPO" 2>/dev/null || gh label edit "status:in-progress" --description "进行中" --color "5319E7" --repo "$REPO"
gh label create "status:blocked" --description "阻塞中" --color "B60205" --repo "$REPO" 2>/dev/null || gh label edit "status:blocked" --description "阻塞中" --color "B60205" --repo "$REPO"
gh label create "status:review" --description "等待审核" --color "FBCA04" --repo "$REPO" 2>/dev/null || gh label edit "status:review" --description "等待审核" --color "FBCA04" --repo "$REPO"
echo "  ✓ 状态 Labels"

# QA 审核 Labels
gh label create "qa:pending" --description "等待 QA 审核" --color "F9D0C4" --repo "$REPO" 2>/dev/null || gh label edit "qa:pending" --description "等待 QA 审核" --color "F9D0C4" --repo "$REPO"
gh label create "qa:passed" --description "QA 审核通过" --color "0E8A16" --repo "$REPO" 2>/dev/null || gh label edit "qa:passed" --description "QA 审核通过" --color "0E8A16" --repo "$REPO"
gh label create "qa:failed" --description "QA 审核未通过" --color "B60205" --repo "$REPO" 2>/dev/null || gh label edit "qa:failed" --description "QA 审核未通过" --color "B60205" --repo "$REPO"
echo "  ✓ QA 审核 Labels"

echo ""
echo "✅ Labels 初始化完成: $REPO"
echo "   查看: https://github.com/$REPO/labels"
