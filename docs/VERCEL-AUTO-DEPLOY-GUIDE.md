# Vercel 自动部署配置指南

本指南介绍如何配置GitHub仓库与Vercel的自动同步部署，确保每次代码推送后应用都是最新版本。

## 🚀 快速设置

### 1. Vercel 项目初始化

如果还没有Vercel项目，首先需要导入GitHub仓库：

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 在项目根目录运行
vercel

# 按提示选择：
# - Link to existing project? No
# - What's your project's name? tribit2
# - In which directory is your code located? ./
```

### 2. 连接GitHub仓库

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 Settings → Git
4. 点击 "Connect Git Repository"
5. 选择 GitHub
6. 授权并选择仓库 `keevingfu/tribit2`

### 3. 配置自动部署

在Vercel项目设置中：

#### Git Configuration
- **Production Branch**: `main`
- **Preview Branches**: 所有其他分支
- **Ignored Build Step**: 不设置（每次都构建）

#### Environment Variables
添加以下环境变量：
```
TURSO_DATABASE_URL=你的Turso数据库URL
TURSO_AUTH_TOKEN=你的Turso认证令牌
NEXT_PUBLIC_API_BASE_URL=https://your-domain.vercel.app/api
CRON_SECRET=随机生成的密钥（用于定时任务验证）
```

### 4. 部署触发器

配置完成后，以下操作会自动触发部署：

1. **推送到main分支**
   ```bash
   git push origin main
   # Vercel自动检测并部署
   ```

2. **Pull Request**
   - 创建PR时生成预览部署
   - 合并到main时触发生产部署

3. **手动触发**
   ```bash
   # 使用Vercel CLI
   vercel --prod

   # 或在Dashboard中点击"Redeploy"
   ```

## 📊 部署监控

### 1. 使用部署监控脚本

```bash
# 设置环境变量
export VERCEL_TOKEN=your_vercel_token
export VERCEL_PROJECT_ID=your_project_id

# 单次检查
node scripts/deployment-monitor.js

# 持续监控（每60秒检查一次）
node scripts/deployment-monitor.js --watch

# 自定义检查间隔（30秒）
node scripts/deployment-monitor.js --watch --interval 30000
```

### 2. GitHub Actions 集成

项目已配置GitHub Actions工作流（`.github/workflows/vercel-deployment.yml`），功能包括：

- ✅ 推送到main时自动部署
- ✅ 在commit上添加部署状态评论
- ✅ 创建GitHub deployment记录
- ✅ 部署失败时通知

### 3. Vercel Dashboard 监控

在 [Vercel Dashboard](https://vercel.com/dashboard) 中可以：

- 查看部署历史
- 监控构建日志
- 查看函数调用次数
- 分析性能指标

## 🔧 高级配置

### 1. 部署钩子（Deployment Hooks）

创建部署钩子以通过URL触发部署：

1. 在Vercel项目设置中找到 "Deploy Hooks"
2. 创建新的Hook（例如：`daily-sync`）
3. 使用生成的URL触发部署：

```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx
```

### 2. 部署保护（Deployment Protection）

启用部署保护以防止意外部署：

```javascript
// vercel.json
{
  "github": {
    "enabled": true,
    "autoJobCancelation": true,
    "deploymentProtection": {
      "enabled": true,
      "rules": [
        {
          "type": "REQUIRED_REVIEWERS",
          "value": 1
        }
      ]
    }
  }
}
```

### 3. 自定义域名

1. 在项目设置中添加域名
2. 配置DNS记录：
   - A记录：`76.76.21.21`
   - CNAME记录：`cname.vercel-dns.com`

### 4. 构建优化

```javascript
// next.config.js
module.exports = {
  // 启用SWC压缩
  swcMinify: true,
  
  // 图片优化
  images: {
    domains: ['your-image-domain.com'],
    formats: ['image/avif', 'image/webp']
  },
  
  // 输出优化
  output: 'standalone'
}
```

## 🔍 故障排除

### 问题1：部署失败

检查清单：
1. 查看Vercel构建日志
2. 确认环境变量配置正确
3. 检查`package.json`中的构建命令
4. 验证Node.js版本兼容性

### 问题2：自动部署不触发

解决方案：
1. 检查GitHub集成状态
2. 确认分支配置正确
3. 查看Vercel项目的Git设置
4. 重新连接GitHub仓库

### 问题3：部署成功但应用报错

调试步骤：
1. 查看函数日志：`vercel logs`
2. 检查环境变量是否正确设置
3. 验证数据库连接
4. 使用`vercel dev`本地调试

## 📝 最佳实践

1. **分支策略**
   - `main`：生产环境
   - `develop`：开发环境
   - `feature/*`：功能分支（预览部署）

2. **环境变量管理**
   - 使用Vercel环境变量UI
   - 敏感信息不要提交到代码库
   - 为不同环境设置不同的值

3. **部署前检查**
   - 运行`npm run build`本地验证
   - 执行`npm run test`确保测试通过
   - 使用`npm run lint`检查代码质量

4. **监控和告警**
   - 设置部署通知（Email/Slack）
   - 监控错误率和性能指标
   - 定期检查部署日志

## 🎯 快速命令参考

```bash
# 查看部署状态
vercel list

# 查看部署日志
vercel logs

# 查看环境变量
vercel env ls

# 添加环境变量
vercel env add MY_VAR

# 回滚到上一个部署
vercel rollback

# 查看当前部署信息
vercel inspect
```

## 🔗 相关资源

- [Vercel文档](https://vercel.com/docs)
- [Next.js部署指南](https://nextjs.org/docs/deployment)
- [Vercel CLI参考](https://vercel.com/docs/cli)
- [GitHub集成指南](https://vercel.com/docs/git)

---

通过以上配置，你的应用将实现：
- ✅ 代码推送后自动部署
- ✅ PR预览部署
- ✅ 部署状态实时监控
- ✅ 自动回滚机制
- ✅ 完整的部署日志

确保GitHub仓库更新后，Vercel会在几秒内开始构建和部署，让你的应用始终保持最新！