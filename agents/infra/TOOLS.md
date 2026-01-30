# TOOLS.md - Infra

## 基础设施
- **容器**：Docker
- **编排**：Kubernetes / Docker Compose
- **CI/CD**：GitHub Actions / GitLab CI
- **IaC**：Terraform / Ansible

## 监控
- **指标**：Prometheus + Grafana
- **日志**：ELK / Loki
- **告警**：Alertmanager / PagerDuty

---

## 常用命令

### Docker
```bash
# 构建镜像
docker build -t <image>:<tag> .

# 推送镜像
docker push <image>:<tag>

# 查看容器
docker ps
docker logs <container>
```

### Kubernetes
```bash
# 部署
kubectl apply -f deployment.yaml

# 检查状态
kubectl get pods
kubectl get services
kubectl describe pod <pod>

# 查看日志
kubectl logs <pod>
kubectl logs -f <pod>  # 实时

# 进入容器
kubectl exec -it <pod> -- /bin/sh
```

### 回滚
```bash
# 查看历史
kubectl rollout history deployment/<name>

# 回滚上一版本
kubectl rollout undo deployment/<name>

# 回滚指定版本
kubectl rollout undo deployment/<name> --to-revision=<n>
```

---

## 部署流程模板
```markdown
## 部署记录

**应用**：[应用名]
**版本**：[版本号/commit]
**时间**：[YYYY-MM-DD HH:MM]
**执行人**：Infra

### 部署前检查
- [ ] CI 构建通过
- [ ] 回滚方案准备
- [ ] 已通知相关方

### 部署步骤
1. [步骤1]
2. [步骤2]
3. [步骤3]

### 部署后验证
- [ ] 健康检查通过
- [ ] 关键接口可用
- [ ] 监控无异常

### 结果
[成功/失败 + 说明]
```

---

## 故障响应模板
```markdown
## 故障报告

**发现时间**：[YYYY-MM-DD HH:MM]
**恢复时间**：[YYYY-MM-DD HH:MM]
**影响时长**：[X 分钟]
**影响范围**：[哪些服务/用户受影响]

### 故障现象
[描述故障表现]

### 影响
[用户影响、业务影响]

### 处理过程
1. [HH:MM] 发现问题
2. [HH:MM] 执行操作
3. [HH:MM] 恢复服务

### 根因
[故障原因]

### 改进措施
- [ ] 措施1
- [ ] 措施2
```

---

## 状态标记
| 标记 | 含义 |
|------|------|
| ✅ | 部署成功 / 服务正常 |
| 🚧 | 部署中 |
| 🔴 | 部署失败 / 服务故障 |
| ⚠️ | 有告警需关注 |

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
gh issue comment 123 --body "开始开发，预计 X 完成" --repo "pleamon/team"

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
