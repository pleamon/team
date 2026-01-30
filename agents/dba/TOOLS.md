# TOOLS.md - DBA

## 数据库类型
- **主要**：PostgreSQL
- **备选**：MySQL
- **缓存**：Redis

## 迁移工具
- Flyway
- Prisma Migrate
- TypeORM Migrations

---

## 命名规范
```
表名：小写下划线
  users, user_accounts, order_items

字段名：小写下划线
  id, created_at, user_id, order_status

索引名：idx_<table>_<columns>
  idx_users_email
  idx_orders_user_id_status

外键名：fk_<table>_<ref_table>
  fk_orders_users
```

---

## 迁移脚本模板
```sql
-- Migration: V001__create_users_table.sql
-- Author: DBA
-- Date: YYYY-MM-DD
-- Description: 创建用户表

-- Up
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

COMMENT ON TABLE users IS '用户表';
COMMENT ON COLUMN users.status IS '状态: active, inactive, banned';

-- Down
DROP TABLE IF EXISTS users;
```

---

## Schema 设计模板
```markdown
# Schema 设计: [模块名]

## 表结构

### users
| 字段 | 类型 | 约束 | 默认值 | 说明 |
|------|------|------|-------|------|
| id | UUID | PK | gen_random_uuid() | 主键 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | - | 邮箱 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |

### 索引
| 索引名 | 字段 | 类型 | 用途 |
|-------|------|------|------|
| idx_users_email | email | BTREE | 登录查询 |

### 关系
- users 1:N orders（通过 orders.user_id）
```

---

## 变更评估模板
```markdown
## Schema 变更评估

**变更内容**：[描述]
**影响表**：[表名]
**表大小**：[行数/数据量]

### 影响分析
- 锁影响：[是否锁表、锁多久]
- 性能影响：[是否影响在线服务]
- 回滚方案：[如何回滚]

### 执行计划
- 执行时间：[低峰期]
- 执行步骤：[1. 2. 3.]
- 通知范围：[BE, Infra]
```

---

## 性能分析
```sql
-- 查看执行计划
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'xxx';

-- 查看表大小
SELECT pg_size_pretty(pg_total_relation_size('users'));

-- 查看索引使用情况
SELECT * FROM pg_stat_user_indexes WHERE relname = 'users';
```

---

## 状态标记
| 标记 | 含义 |
|------|------|
| ✅ | 设计/迁移完成 |
| 🚧 | 进行中 |
| 🔴 | 阻塞（缺数据模型） |
| ⚠️ | 需要评估影响 |
