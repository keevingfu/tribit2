#!/bin/bash

# 进入脚本所在目录
cd "$(dirname "$0")"

echo "正在启动 BUAgent 应用..."
echo ""

# 检查是否已经安装依赖
if [ ! -d "node_modules" ]; then
    echo "首次运行，正在安装依赖..."
    npm install
fi

# 检查是否已经构建
if [ ! -d "dist" ]; then
    echo "正在构建应用..."
    npx vite build
fi

# 启动应用
echo "正在启动服务器..."
npx vite preview --port 4173 --open

# 保持窗口打开
read -p "按回车键关闭..."