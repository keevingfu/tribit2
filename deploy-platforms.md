# 部署平台对比和指南

## 平台对比表

| 平台 | 免费额度 | 部署难度 | 特色功能 | 适合场景 |
|------|---------|---------|---------|---------|
| **Vercel** | 100GB带宽/月 | ⭐ 最简单 | Next.js 官方支持 | Next.js 项目首选 |
| **Netlify** | 100GB带宽/月 | ⭐⭐ 简单 | 表单处理，函数 | 静态站点+轻量API |
| **Railway** | $5额度/月 | ⭐⭐ 简单 | 数据库集成 | 全栈应用 |
| **Render** | 750小时/月 | ⭐⭐⭐ 中等 | 后台任务，Cron | 复杂应用 |
| **Cloudflare Pages** | 无限请求 | ⭐⭐ 简单 | 全球CDN | 高流量站点 |
| **Fly.io** | 3个共享CPU | ⭐⭐⭐⭐ 较难 | 全球部署 | 需要低延迟 |
| **DigitalOcean App Platform** | $0三个月 | ⭐⭐⭐ 中等 | 完整云服务 | 企业应用 |

## 快速部署脚本

### 1. Netlify 部署
```bash
# 安装并部署
npx netlify-cli deploy --prod

# 或创建 netlify.toml
cat > netlify.toml << EOF
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
EOF
```

### 2. Railway 部署
```bash
# 使用 Railway CLI
npm install -g @railway/cli
railway login
railway up

# 或直接从 GitHub
# 访问 https://railway.app/new
```

### 3. Render 部署
创建 `render.yaml`:
```yaml
services:
  - type: web
    name: tribit
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_VERSION
        value: 18.17.0
```

### 4. Cloudflare Pages 部署
```bash
# 方法1: 使用 Wrangler CLI
npm install -g wrangler
wrangler pages project create tribit
wrangler pages deploy .next --project-name=tribit

# 方法2: 通过 Dashboard
# 访问 https://dash.cloudflare.com/pages
# 连接 GitHub 仓库
```

### 5. Fly.io 部署
```bash
# 安装 Fly CLI
curl -L https://fly.io/install.sh | sh

# 部署
fly launch
fly deploy
```

## 特殊配置

### 针对你的项目的注意事项

1. **数据库文件处理**
   - 大多数平台不支持 SQLite 文件
   - 考虑使用云数据库：
     - Planetscale (MySQL)
     - Neon (PostgreSQL)
     - Turso (SQLite 兼容)

2. **环境变量设置**
   所有平台都需要设置：
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=/api
   ```

3. **构建命令统一**
   ```json
   {
     "scripts": {
       "build": "next build",
       "start": "next start -p $PORT"
     }
   }
   ```

## 推荐选择

### 如果你想要...

1. **最简单的部署体验** → Vercel 或 Netlify
2. **最便宜/免费** → Cloudflare Pages
3. **需要数据库** → Railway 或 Render
4. **全球低延迟** → Fly.io 或 Cloudflare Pages
5. **国内访问快** → 腾讯云 Webify 或阿里云

## 国内平台选择

1. **腾讯云 Webify**
   - 支持 Next.js
   - 国内访问快
   - 有免费额度

2. **阿里云 Serverless 应用引擎**
   - 按需付费
   - 自动扩缩容

3. **Deno Deploy**
   - 支持 Next.js
   - 全球边缘部署