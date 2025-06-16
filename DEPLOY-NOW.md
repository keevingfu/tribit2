# 🚀 立即部署到 Vercel

## 方法1：通过 Vercel 网站（推荐首次部署）

1. **访问 Vercel 导入页面：**
   https://vercel.com/new/clone?repository-url=https://github.com/keevingfu/tribit2

2. **登录并授权：**
   - 使用你的 GitHub 账号登录
   - 授权 Vercel 访问 `keevingfu/tribit2` 仓库

3. **配置项目：**
   - 项目名称：`tribit2`（或自定义）
   - Framework Preset：`Next.js`
   - Root Directory：`./`

4. **添加环境变量：**
   点击 "Environment Variables" 添加：
   ```
   TURSO_DATABASE_URL = libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io
   TURSO_AUTH_TOKEN = [你的Turso认证令牌]
   ```

5. **点击 "Deploy"**

## 方法2：通过命令行（需要已有项目）

### 首次设置
```bash
# 1. 安装 Vercel CLI（如果还没安装）
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 链接项目
vercel link
# 选择已有项目或创建新项目
```

### 部署命令
```bash
# 部署到生产环境
npm run deploy

# 或直接使用
npx vercel --prod
```

## 方法3：自动部署（已配置）

由于项目已经配置了 GitHub 集成，你也可以：

```bash
# 推送到 main 分支会自动触发部署
git push origin main
```

## 🔍 部署后验证

1. **查看部署状态：**
   - Vercel Dashboard: https://vercel.com/dashboard
   - 或运行: `npx vercel list`

2. **访问应用：**
   - 生产URL: `https://tribit2.vercel.app`（或你的自定义域名）
   - 预览URL: 每次部署都会生成唯一URL

3. **检查功能：**
   - 数据库连接是否正常
   - 所有页面是否可访问
   - API端点是否响应

## ⚠️ 注意事项

1. **环境变量：**
   确保在 Vercel 中设置了所有必需的环境变量：
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`

2. **构建设置：**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --force`

3. **如果部署失败：**
   - 查看构建日志
   - 检查环境变量
   - 确认本地 `npm run build` 能成功

## 📞 需要帮助？

- 查看详细指南: [VERCEL-AUTO-DEPLOY-GUIDE.md](docs/VERCEL-AUTO-DEPLOY-GUIDE.md)
- Vercel 文档: https://vercel.com/docs
- 项目问题: https://github.com/keevingfu/tribit2/issues