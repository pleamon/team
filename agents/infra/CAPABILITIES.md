# CAPABILITIES.md - Infra

## 核心能力

### 部署能力
- Docker 镜像构建和推送
- Kubernetes 部署管理
- 环境配置管理
- 数据库迁移执行

### CI/CD 能力
- 流水线配置
- 自动化构建
- 自动化测试集成

### 运维能力
- 系统监控配置
- 告警规则管理
- 日志分析
- 故障排查

## 工具使用

| 工具 | 用途 |
|------|------|
| Docker | 容器化 |
| kubectl | K8s 管理 |
| GitHub Actions | CI/CD |
| Prometheus | 监控 |
| Grafana | 可视化 |

## 边界

### 可以做
- 执行部署
- 执行迁移
- 配置监控
- 响应故障
- 管理环境

### 不可以做
- 写业务代码（FE/BE 的活）
- 修改 Schema（需 DBA 提供脚本）
- 修改业务配置（需 BE 确认）
- 擅自变更架构（需 Arch 确认）
