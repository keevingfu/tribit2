# Vercel 环境变量修复指南

## 问题诊断
TURSO_AUTH_TOKEN 在 Vercel 中包含了换行符，导致 HTTP header 无效。

## 通过 Web UI 修复（推荐）

### 步骤 1：登录 Vercel
访问：https://vercel.com/keevingfus-projects/tribit/settings/environment-variables

### 步骤 2：编辑 TURSO_AUTH_TOKEN

1. 找到 `TURSO_AUTH_TOKEN` 变量
2. 点击右侧的三个点（⋮）
3. 选择 "Edit"

### 步骤 3：正确粘贴 Token

**复制这个完整的 token（确保是一行）：**

```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA
```

**操作步骤：**
1. 清空 Value 输入框
2. 确保光标在输入框最开始
3. 粘贴 token（Cmd+V 或 Ctrl+V）
4. **检查**：确保 token 在输入框中是一行，没有换行
5. 确保所有环境都选中：
   - ✅ Production
   - ✅ Preview
   - ✅ Development
6. 点击 "Save"

### 步骤 4：验证 TURSO_DATABASE_URL

确保 `TURSO_DATABASE_URL` 的值是：
```
libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io
```

### 步骤 5：重新部署

在 Vercel 项目页面：
1. 点击 "Deployments" 标签
2. 找到最新的部署
3. 点击右侧的三个点（⋮）
4. 选择 "Redeploy"
5. 在弹出的对话框中点击 "Redeploy"

或者通过命令行：
```bash
vercel --prod --yes
```

### 步骤 6：等待部署完成

部署通常需要 1-2 分钟。

### 步骤 7：验证连接

```bash
node scripts/check-vercel-db-connection.js
```

## 重要提示 ⚠️

1. **Token 必须是一行**：在 Vercel 的输入框中，token 应该是一个长长的字符串，没有任何换行
2. **不要使用引号**：不要在 token 周围加引号
3. **检查空格**：确保 token 前后没有空格

## 如果还是不行

### 方案 A：完全删除并重新添加

1. 在 Vercel 环境变量页面，删除 `TURSO_AUTH_TOKEN`
2. 点击 "Add New"
3. Key: `TURSO_AUTH_TOKEN`
4. Value: 粘贴上面的 token
5. 选择所有环境
6. Save

### 方案 B：使用不同的 Token

如果当前 token 有问题，可以创建新的：
```bash
turso db tokens create tribit-prod
```

## 验证环境变量

在 Vercel 项目的 Functions 标签下，可以查看环境变量是否正确加载。

## 直接访问测试

部署成功后，直接访问：
- https://tribit-keevingfus-projects.vercel.app/api/insight/search
- https://tribit-keevingfus-projects.vercel.app/api/kol/tribit-2024

如果返回 JSON 数据而不是错误，说明连接成功。