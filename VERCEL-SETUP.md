# 🚀 Vercel 自动部署快速设置

## 一键设置（推荐）

### 1. 通过Vercel网站导入项目

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/keevingfu/tribit2)

点击上方按钮，然后：
1. 登录GitHub账号
2. 授权Vercel访问仓库
3. 配置环境变量：
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
4. 点击 "Deploy"

### 2. 自动部署已启用！

完成上述步骤后：
- ✅ 推送到 `main` 分支会自动部署到生产环境
- ✅ 其他分支会创建预览部署
- ✅ Pull Request 会自动生成预览链接

## 环境变量配置

在Vercel项目设置中添加：

```bash
# 必需的环境变量
TURSO_DATABASE_URL=libsql://xxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGc...

# 可选的环境变量
NEXT_PUBLIC_API_BASE_URL=https://your-app.vercel.app/api
CRON_SECRET=your-random-secret
```

## 部署状态检查

### 方法1：Vercel Dashboard
访问 https://vercel.com/keevingfu/tribit2

### 方法2：命令行
```bash
# 安装Vercel CLI
npm i -g vercel

# 查看部署列表
vercel list

# 查看最新部署日志
vercel logs
```

### 方法3：部署监控脚本
```bash
# 需要先设置环境变量
export VERCEL_TOKEN=xxx
export VERCEL_PROJECT_ID=xxx

# 运行监控
node scripts/deployment-monitor.js
```

## 常用操作

### 手动触发部署
```bash
vercel --prod
```

### 回滚到上一版本
```bash
vercel rollback
```

### 查看当前部署
```bash
vercel inspect
```

## 故障排除

❌ **部署失败？**
- 查看构建日志：https://vercel.com/keevingfu/tribit2/deployments
- 检查环境变量是否正确设置
- 确认 `npm run build` 本地能成功运行

❌ **自动部署不工作？**
- 检查GitHub集成：Settings → Git → Connected Git Repository
- 确认推送的是 `main` 分支
- 查看GitHub Webhooks是否正常

## 支持

- 📚 [完整文档](docs/VERCEL-AUTO-DEPLOY-GUIDE.md)
- 🐛 [报告问题](https://github.com/keevingfu/tribit2/issues)
- 💬 [Vercel支持](https://vercel.com/support)

---

**就这么简单！** 现在每次推送代码到GitHub，Vercel都会自动部署最新版本。