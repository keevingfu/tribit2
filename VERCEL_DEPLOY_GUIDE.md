# Vercel 部署指南 - Tribit 项目

## 方法 1：重新连接 GitHub 仓库（推荐）

1. **进入 Vercel 项目设置**
   - 访问：https://vercel.com/keevingfus-projects/tribit/settings/git
   
2. **断开现有 Git 连接（如果有）**
   - 找到 "Git Integration" 部分
   - 点击 "Disconnect" 断开连接

3. **重新连接 GitHub**
   - 点击 "Connect Git Repository"
   - 选择 "GitHub"
   - 搜索并选择 `keevingfu/tribit2` 仓库
   - 确认分支为 `main`

4. **触发部署**
   - 连接后会自动触发部署
   - 或点击 "Redeploy" 按钮

## 方法 2：创建新项目（如果方法 1 失败）

1. **删除旧项目**
   - 在 https://vercel.com/keevingfus-projects/tribit/settings
   - 滚动到底部，点击 "Delete Project"

2. **创建新项目**
   - 访问：https://vercel.com/new
   - 点击 "Import Git Repository"
   - 选择 `keevingfu/tribit2`
   - 项目设置：
     ```
     Project Name: tribit
     Framework Preset: Next.js (自动检测)
     Root Directory: ./
     Build Command: sh vercel-build.sh
     Output Directory: .next
     Install Command: npm install
     ```

3. **环境变量（如需要）**
   ```
   NODE_ENV = production
   ```

4. **点击 "Deploy"**

## 方法 3：使用 Vercel CLI（本地部署）

```bash
# 1. 安装 Vercel CLI（如果还没安装）
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 链接到现有项目
vercel link
# 选择: keevingfus-projects
# 选择: Link to existing project
# 输入: tribit

# 4. 部署到生产环境
vercel --prod
```

## 方法 4：手动上传部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **创建部署包**
   ```bash
   # 创建包含所有必要文件的 zip
   zip -r vercel-deploy.zip . \
     -x "node_modules/*" \
     -x ".git/*" \
     -x ".next/*" \
     -x "coverage/*" \
     -x "*.log" \
     -x ".env*"
   ```

3. **通过 Vercel Dashboard 上传**
   - 如果其他方法都失败，可以联系 Vercel 支持

## 检查清单

确保以下条件满足：
- [ ] GitHub 仓库是公开的或 Vercel 有访问权限
- [ ] `main` 分支有最新代码
- [ ] `vercel.json` 文件存在且配置正确
- [ ] `package.json` 中的脚本正确
- [ ] Node.js 版本兼容（>=18.17.0）

## 常见问题

### 1. Build 失败
- 查看 build logs 中的具体错误
- 确认所有依赖都在 `package.json` 中

### 2. 404 错误
- 检查 `next.config.js` 配置
- 确认路由配置正确

### 3. 数据库错误
- 数据库文件已包含在仓库中
- 连接代码已更新为容错模式

## 需要帮助？

1. 查看部署日志：https://vercel.com/keevingfus-projects/tribit/deployments
2. 检查函数日志：https://vercel.com/keevingfus-projects/tribit/functions
3. 访问健康检查：https://tribit.vercel.app/api/health