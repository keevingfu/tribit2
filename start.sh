#!/bin/bash

# 清理旧进程
echo "正在清理旧进程..."
pkill -f "node.*vite" 2>/dev/null

# 检查端口是否被占用
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "端口 3000 被占用，正在清理..."
    kill -9 $(lsof -Pi :3000 -sTCP:LISTEN -t) 2>/dev/null
    sleep 1
fi

# 启动开发服务器
echo "正在启动应用..."
npm run dev &

# 等待服务器启动
sleep 3

# 检查服务器是否启动成功
if curl -s http://localhost:3000 > /dev/null ; then
    echo "✅ 应用已成功启动！"
    echo "🌐 访问地址: http://localhost:3000"
else
    echo "❌ 应用启动失败，请检查日志"
fi