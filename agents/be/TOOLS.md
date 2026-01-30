# TOOLS.md - BE

## 技术栈
- Node.js / TypeScript 或 Go / Python
- RESTful API / GraphQL
- PostgreSQL / MySQL
- Jest / Pytest 测试

## 开发规范
- 项目结构：
  ```
  src/
  ├── controllers/   # API 控制器
  ├── services/      # 业务逻辑
  ├── models/        # 数据模型
  ├── middlewares/   # 中间件
  └── utils/         # 工具函数
  ```
- 使用 DTO 进行数据传输
- 统一错误处理和日志格式

## API 文档
- 使用 Swagger/OpenAPI 3.0
- 每个接口需有请求/响应示例
- 错误码统一管理
