# TOOLS.md - Infra

## 基础设施
- Docker / Kubernetes
- GitHub Actions / GitLab CI
- Terraform / Ansible

## 监控
- Prometheus / Grafana
- 日志：ELK / Loki

## 部署命令
```bash
# 构建镜像
docker build -t <image>:<tag> .

# 推送镜像
docker push <image>:<tag>

# 部署（K8s）
kubectl apply -f deployment.yaml

# 检查状态
kubectl get pods
kubectl logs <pod>
```

## 回滚流程
```bash
# 查看历史版本
kubectl rollout history deployment/<name>

# 回滚到上一版本
kubectl rollout undo deployment/<name>

# 回滚到指定版本
kubectl rollout undo deployment/<name> --to-revision=<n>
```
