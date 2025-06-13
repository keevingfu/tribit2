#!/bin/bash

echo "=========================================="
echo "   选择部署平台 - Tribit Project"
echo "=========================================="
echo ""
echo "1) Netlify    - 最接近 Vercel，免费 100GB/月"
echo "2) Railway    - 简单快速，$5 免费额度"
echo "3) Render     - 功能全面，750 小时/月"
echo "4) Cloudflare - 性能最佳，无限请求"
echo "5) Fly.io     - 全球部署，3 个免费实例"
echo ""
read -p "选择平台 (1-5): " choice

case $choice in
  1)
    echo "部署到 Netlify..."
    echo "方法 1: 拖拽部署"
    echo "  1. 运行: npm run build"
    echo "  2. 访问: https://app.netlify.com/drop"
    echo "  3. 拖拽 .next 文件夹到页面"
    echo ""
    echo "方法 2: CLI 部署"
    echo "  npx netlify-cli deploy --prod"
    ;;
    
  2)
    echo "部署到 Railway..."
    echo "1. 访问: https://railway.app/new"
    echo "2. 选择 'Deploy from GitHub repo'"
    echo "3. 选择: keevingfu/tribit2"
    echo "4. 点击 'Deploy Now'"
    ;;
    
  3)
    echo "部署到 Render..."
    echo "1. 访问: https://dashboard.render.com/new/web"
    echo "2. 连接 GitHub: keevingfu/tribit2"
    echo "3. 使用这些设置:"
    echo "   - Build Command: npm run build"
    echo "   - Start Command: npm start"
    ;;
    
  4)
    echo "部署到 Cloudflare Pages..."
    echo "1. 访问: https://dash.cloudflare.com/pages"
    echo "2. 创建项目 → 连接 Git"
    echo "3. 选择: keevingfu/tribit2"
    echo "4. 构建设置:"
    echo "   - 构建命令: npm run build"
    echo "   - 构建输出: .next"
    ;;
    
  5)
    echo "部署到 Fly.io..."
    echo "1. 安装 Fly CLI:"
    echo "   curl -L https://fly.io/install.sh | sh"
    echo "2. 登录: flyctl auth login"
    echo "3. 部署: flyctl launch"
    ;;
esac

echo ""
echo "需要帮助？查看 deploy-platforms.md 获取详细指南"