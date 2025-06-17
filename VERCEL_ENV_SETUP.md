# Vercel 环境变量配置指南

## 步骤 1：登录 Vercel

```bash
vercel login
```

选择你喜欢的登录方式（GitHub、Email 等）。

## 步骤 2：配置环境变量

### 方法 A：通过 Web 界面（推荐）

1. 访问：https://vercel.com/keevingfus-projects/tribit/settings/environment-variables

2. 添加以下环境变量：

#### TURSO_DATABASE_URL
- **Key**: `TURSO_DATABASE_URL`
- **Value**: `libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

#### TURSO_AUTH_TOKEN
- **Key**: `TURSO_AUTH_TOKEN`
- **Value**: 
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA
```
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

⚠️ **重要提示**：
- 复制 token 时确保是完整的一行，没有换行符
- 不要在值周围加引号
- 确保选中所有三个环境

### 方法 B：通过命令行

登录后，运行以下命令：

```bash
# 添加 TURSO_DATABASE_URL
vercel env add TURSO_DATABASE_URL production
# 粘贴: libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io

vercel env add TURSO_DATABASE_URL preview
# 粘贴相同的值

vercel env add TURSO_DATABASE_URL development
# 粘贴相同的值

# 添加 TURSO_AUTH_TOKEN
vercel env add TURSO_AUTH_TOKEN production
# 粘贴完整的 token（一行）

vercel env add TURSO_AUTH_TOKEN preview
# 粘贴相同的 token

vercel env add TURSO_AUTH_TOKEN development
# 粘贴相同的 token
```

## 步骤 3：重新部署

```bash
vercel --prod --yes
```

## 步骤 4：验证连接

部署成功后，运行：

```bash
node scripts/check-vercel-db-connection.js
```

## 故障排除

如果遇到问题：

1. **检查环境变量是否正确设置**：
   ```bash
   vercel env ls
   ```

2. **查看部署日志**：
   ```bash
   vercel logs --prod
   ```

3. **本地测试 Turso 连接**：
   ```bash
   export TURSO_DATABASE_URL="libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io"
   export TURSO_AUTH_TOKEN="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA"
   USE_TURSO=true npm run dev
   ```

4. **访问部署的应用**：
   https://tribit-keevingfus-projects.vercel.app

## 预期结果

配置成功后，你应该能够：
- ✅ 访问应用的所有页面
- ✅ API 端点返回数据库中的数据
- ✅ 没有 500 错误或连接错误

## 安全提示

- 这些凭据仅用于演示目的
- 生产环境中应该使用更安全的 token 管理
- 定期轮换认证 token