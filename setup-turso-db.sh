#!/bin/bash

# Turso 数据库自动设置脚本

set -e

echo "🚀 开始设置 Turso 数据库..."

# 设置环境变量
export PATH="/var/root/.turso:$PATH"
TURSO_BIN="/var/root/.turso/turso"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Turso 是否已安装
if [ ! -f "$TURSO_BIN" ]; then
    echo "❌ Turso CLI 未找到，请先安装"
    exit 1
fi

echo -e "${GREEN}✅ Turso CLI 已安装${NC}"
$TURSO_BIN --version

# 检查是否已登录
echo -e "\n${BLUE}📝 检查登录状态...${NC}"
if ! $TURSO_BIN auth status 2>/dev/null | grep -q "Logged in"; then
    echo -e "${YELLOW}请在浏览器中完成登录，然后按回车继续...${NC}"
    $TURSO_BIN auth login
    read -p "登录完成后按回车继续..."
fi

# 数据库名称
DB_NAME="tribit-prod"
DB_PATH="/Users/cavin/Desktop/dev/buagent/data/tribit.db"

# 检查数据库是否已存在
echo -e "\n${BLUE}🗄️  检查数据库...${NC}"
if $TURSO_BIN db list | grep -q "$DB_NAME"; then
    echo -e "${YELLOW}数据库 $DB_NAME 已存在${NC}"
    read -p "是否删除并重新创建？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "删除现有数据库..."
        $TURSO_BIN db destroy $DB_NAME --yes
    else
        echo "使用现有数据库"
        DB_EXISTS=true
    fi
fi

# 创建数据库
if [ -z "$DB_EXISTS" ]; then
    echo -e "\n${BLUE}🏗️  创建数据库...${NC}"
    $TURSO_BIN db create $DB_NAME --location sjc
    echo -e "${GREEN}✅ 数据库创建成功${NC}"
fi

# 导入数据
if [ -f "$DB_PATH" ]; then
    echo -e "\n${BLUE}📤 导入 SQLite 数据...${NC}"
    echo "这可能需要几分钟..."
    $TURSO_BIN db shell $DB_NAME < "$DB_PATH"
    echo -e "${GREEN}✅ 数据导入成功${NC}"
else
    echo -e "${YELLOW}⚠️  未找到本地数据库文件: $DB_PATH${NC}"
fi

# 获取连接信息
echo -e "\n${BLUE}🔑 获取连接信息...${NC}"
DB_URL=$($TURSO_BIN db show $DB_NAME --url)
echo -e "数据库 URL: ${GREEN}$DB_URL${NC}"

# 创建访问令牌
echo -e "\n${BLUE}🎫 创建访问令牌...${NC}"
AUTH_TOKEN=$($TURSO_BIN db tokens create $DB_NAME)
echo -e "访问令牌已创建"

# 创建 .env.local 文件
ENV_FILE="/Users/cavin/Desktop/dev/buagent/.env.local"
echo -e "\n${BLUE}📝 创建环境变量文件...${NC}"

cat > "$ENV_FILE" << EOF
# Turso Database Configuration
TURSO_DATABASE_URL=$DB_URL
TURSO_AUTH_TOKEN=$AUTH_TOKEN

# Existing environment variables (if any)
EOF

echo -e "${GREEN}✅ 环境变量已保存到 .env.local${NC}"

# 显示 Vercel 配置指南
echo -e "\n${BLUE}📋 Vercel 配置步骤：${NC}"
echo "1. 访问 https://vercel.com/your-username/tribit/settings/environment-variables"
echo "2. 添加以下环境变量："
echo -e "   ${YELLOW}TURSO_DATABASE_URL${NC} = $DB_URL"
echo -e "   ${YELLOW}TURSO_AUTH_TOKEN${NC} = [已保存在 .env.local]"
echo ""
echo -e "${GREEN}✅ Turso 数据库设置完成！${NC}"
echo ""
echo "下一步："
echo "1. 运行 'npm install @libsql/client' 安装客户端"
echo "2. 更新代码以支持 Turso"
echo "3. 在 Vercel 中配置环境变量"
echo "4. 部署到 Vercel"