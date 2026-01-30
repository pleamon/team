#!/bin/bash
# sync-all.sh — 同步所有 Agent 的配置
# 用法: ./sync-all.sh

set -e
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🔄 同步所有 Agent 配置..."
echo ""

for agent_dir in "$REPO_DIR/agents"/*/; do
  agent=$(basename "$agent_dir")
  "$REPO_DIR/sync.sh" "$agent"
  echo ""
done

echo "🎉 全员同步完成"
