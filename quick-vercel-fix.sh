#!/bin/bash

echo "======================================"
echo "   快速修复 Vercel 部署问题"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}请按照以下步骤操作：${NC}"
echo ""

echo -e "${BLUE}步骤 1: 检查 Vercel Dashboard${NC}"
echo "1. 打开: https://vercel.com/keevingfus-projects/tribit/settings/git"
echo "2. 查看是否已连接到 GitHub"
echo ""
read -p "是否已连接到 GitHub？(y/n): " connected

if [[ "$connected" != "y" ]]; then
  echo ""
  echo -e "${BLUE}步骤 2: 连接 GitHub 仓库${NC}"
  echo "1. 点击 'Connect Git Repository'"
  echo "2. 选择 GitHub"
  echo "3. 搜索 'tribit2'"
  echo "4. 选择 keevingfu/tribit2 仓库"
  echo "5. 确认分支为 'main'"
  echo "6. 点击 'Connect'"
  echo ""
  echo -e "${GREEN}连接后会自动开始部署！${NC}"
else
  echo ""
  echo -e "${BLUE}步骤 2: 触发重新部署${NC}"
  echo "在 Vercel Dashboard 中："
  echo "1. 打开: https://vercel.com/keevingfus-projects/tribit"
  echo "2. 点击 'Deployments' 标签"
  echo "3. 点击最新部署旁边的 '...' 菜单"
  echo "4. 选择 'Redeploy'"
  echo ""
  echo -e "${YELLOW}或者使用空提交触发：${NC}"
  read -p "是否创建空提交触发部署？(y/n): " trigger
  
  if [[ "$trigger" == "y" ]]; then
    git commit --allow-empty -m "Trigger Vercel deployment - Fix no production deployment issue"
    git push origin main
    echo -e "${GREEN}✅ 已推送空提交，Vercel 应该开始部署${NC}"
  fi
fi

echo ""
echo -e "${BLUE}步骤 3: 检查部署状态${NC}"
echo "1. 访问: https://vercel.com/keevingfus-projects/tribit/deployments"
echo "2. 查看最新部署的状态"
echo "3. 如果失败，点击查看详细日志"
echo ""

echo -e "${YELLOW}其他选项：${NC}"
echo ""
echo "A. 如果上述方法都失败，试试创建新项目："
echo "   1. 访问: https://vercel.com/new"
echo "   2. Import Git Repository"
echo "   3. 选择 keevingfu/tribit2"
echo ""
echo "B. 使用 Vercel CLI:"
echo "   npx vercel --prod"
echo ""

echo -e "${GREEN}提示：${NC}"
echo "- 确保 GitHub 仓库是公开的"
echo "- 确保 Vercel 有权限访问你的 GitHub"
echo "- 查看健康检查: https://tribit.vercel.app/api/health"