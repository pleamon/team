# TOOLS.md - DBA

## 数据库类型
- PostgreSQL（主要）
- MySQL
- Redis（缓存）

## 迁移工具
- Flyway / Liquibase
- 或框架自带（Prisma Migrate、TypeORM Migrations）

## 规范
- 表名：小写下划线（user_account）
- 字段名：小写下划线（created_at）
- 索引名：idx_<table>_<columns>
- 外键名：fk_<table>_<ref_table>

## 迁移脚本模板
```sql
-- Migration: V001__create_users_table.sql
-- Author: DBA
-- Date: YYYY-MM-DD

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```
