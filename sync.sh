#!/bin/bash
# sync.sh — 同步 team-config 到 Agent workspace
# 用法: ./sync.sh <agent_name>
# 示例: ./sync.sh alex

set -e

AGENT=${1:?用法: ./sync.sh <agent_name>}
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE=~/team/workspace/$AGENT

if [ ! -d "$REPO_DIR/agents/$AGENT" ]; then
  echo "❌ Agent '$AGENT' 不存在于 agents/ 目录中"
  echo "可用 Agent: $(ls agents/)"
  exit 1
fi

echo "🔄 同步 $AGENT 配置..."

# 1. 拉取最新
cd "$REPO_DIR"
git pull --ff-only 2>/dev/null || echo "⚠️ git pull 跳过（可能无远程或已是最新）"

# 2. 确保 workspace 存在
mkdir -p "$WORKSPACE/skills" "$WORKSPACE/shared"

# 3. 同步共享约定（SSOT）
echo "  📋 同步共享约定..."
for f in "$REPO_DIR/shared"/*.md; do
  [ -f "$f" ] && cp "$f" "$WORKSPACE/shared/"
done

# 4. 同步 Agent 配置文件（不覆盖 MEMORY.md）
echo "  📄 同步配置文件..."
for f in "$REPO_DIR/agents/$AGENT"/*.md; do
  [ -f "$f" ] && cp "$f" "$WORKSPACE/"
done

# 5. 同步共享 Skills
echo "  🔧 同步共享 Skills..."
for skill_dir in "$REPO_DIR/skills"/*/; do
  [ -d "$skill_dir" ] || continue
  skill_name=$(basename "$skill_dir")
  [ "$skill_name" = "README.md" ] && continue
  mkdir -p "$WORKSPACE/skills/$skill_name"
  cp -r "$skill_dir"* "$WORKSPACE/skills/$skill_name/" 2>/dev/null
done

# 6. 同步 Agent 专属 Skills
if [ -d "$REPO_DIR/agents/$AGENT/skills" ]; then
  echo "  🔧 同步专属 Skills..."
  for skill_dir in "$REPO_DIR/agents/$AGENT/skills"/*/; do
    [ -d "$skill_dir" ] || continue
    skill_name=$(basename "$skill_dir")
    mkdir -p "$WORKSPACE/skills/$skill_name"
    cp -r "$skill_dir"* "$WORKSPACE/skills/$skill_name/" 2>/dev/null
  done
fi

echo "✅ $AGENT 同步完成 → $WORKSPACE"
echo "  配置: $(ls "$WORKSPACE"/*.md 2>/dev/null | wc -l) 个 .md 文件"
echo "  共享: $(ls "$WORKSPACE/shared"/*.md 2>/dev/null | wc -l) 个 shared 文件"
echo "  Skills: $(ls -d "$WORKSPACE/skills"/*/ 2>/dev/null | wc -l) 个 skills"
