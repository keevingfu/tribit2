#!/bin/bash

# Turso 快速设置脚本 - 在登录后运行

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 设置环境变量
export PATH="/var/root/.turso:$PATH"
TURSO_BIN="/var/root/.turso/turso"
DB_NAME="tribit-prod"
DB_PATH="/Users/cavin/Desktop/dev/buagent/data/tribit.db"
ENV_FILE="/Users/cavin/Desktop/dev/buagent/.env.local"

echo -e "${BLUE}🚀 Turso 数据库快速设置${NC}\n"

# 检查是否已登录
echo -e "${BLUE}检查登录状态...${NC}"
if ! $TURSO_BIN auth whoami &>/dev/null; then
    echo -e "${RED}❌ 您还未登录 Turso${NC}"
    echo -e "${YELLOW}请先运行: /var/root/.turso/turso auth login${NC}"
    exit 1
fi

USER=$($TURSO_BIN auth whoami)
echo -e "${GREEN}✅ 已登录为: $USER${NC}\n"

# 检查并删除已存在的数据库
echo -e "${BLUE}检查现有数据库...${NC}"
if $TURSO_BIN db list | grep -q "$DB_NAME"; then
    echo -e "${YELLOW}⚠️  数据库 $DB_NAME 已存在，删除中...${NC}"
    $TURSO_BIN db destroy $DB_NAME --yes
fi

# 创建数据库
echo -e "\n${BLUE}创建数据库 $DB_NAME...${NC}"
$TURSO_BIN db create $DB_NAME --location sjc
echo -e "${GREEN}✅ 数据库创建成功${NC}"

# 导入数据
echo -e "\n${BLUE}导入 SQLite 数据（这可能需要1-2分钟）...${NC}"
if $TURSO_BIN db shell $DB_NAME < "$DB_PATH"; then
    echo -e "${GREEN}✅ 数据导入成功${NC}"
else
    echo -e "${YELLOW}⚠️  数据导入可能有警告，但通常可以忽略${NC}"
fi

# 获取数据库 URL
echo -e "\n${BLUE}获取连接信息...${NC}"
DB_URL=$($TURSO_BIN db show $DB_NAME --url)
echo -e "数据库 URL: ${GREEN}$DB_URL${NC}"

# 创建访问令牌
AUTH_TOKEN=$($TURSO_BIN db tokens create $DB_NAME)
echo -e "${GREEN}✅ 访问令牌已创建${NC}"

# 创建 .env.local 文件
echo -e "\n${BLUE}创建环境变量文件...${NC}"
cat > "$ENV_FILE" << EOF
# Turso Database Configuration
# Created at $(date)
TURSO_DATABASE_URL=$DB_URL
TURSO_AUTH_TOKEN=$AUTH_TOKEN

# Enable Turso in development (optional)
# USE_TURSO=true
EOF

echo -e "${GREEN}✅ 环境变量已保存到 .env.local${NC}"

# 创建 Vercel 环境变量命令
echo -e "\n${BLUE}生成 Vercel 环境变量...${NC}"
cat > /Users/cavin/Desktop/dev/buagent/vercel-env-commands.txt << EOF
# Vercel 环境变量设置命令
# 在项目目录运行这些命令，或在 Vercel Dashboard 手动添加

vercel env add TURSO_DATABASE_URL production
# 粘贴: $DB_URL

vercel env add TURSO_AUTH_TOKEN production
# 粘贴: $AUTH_TOKEN
EOF

echo -e "${GREEN}✅ Vercel 命令已保存到 vercel-env-commands.txt${NC}"

# 显示总结
echo -e "\n${GREEN}🎉 Turso 设置完成！${NC}\n"
echo -e "${BLUE}下一步：${NC}"
echo "1. 安装客户端库: npm install @libsql/client"
echo "2. 更新代码使用 Turso 连接"
echo "3. 在 Vercel 设置环境变量："
echo "   - 访问: https://vercel.com/keevingfu/tribit/settings/environment-variables"
echo "   - 添加 TURSO_DATABASE_URL 和 TURSO_AUTH_TOKEN"
echo "4. 提交并部署代码"
echo ""
echo -e "${YELLOW}提示：环境变量已保存在 .env.local 文件中${NC}"