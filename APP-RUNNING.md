# 🎉 应用已启动！

## 🌐 访问地址

### 本地开发环境
- **主页**: http://localhost:3000
- **登录页**: http://localhost:3000/auth/login

### 测试账号
```
邮箱: demo@example.com
密码: demo123
```

或

```
邮箱: admin@example.com
密码: admin123
```

## 📱 主要功能模块

登录后可以访问：

1. **洞察分析** (Insight)
   - http://localhost:3000/insight
   - 搜索关键词分析
   - 消费者声音分析
   - 视频内容分析

2. **KOL管理** (KOL)
   - http://localhost:3000/kol
   - KOL数据仪表板
   - 详细KOL分析
   - 表现趋势

3. **A/B测试** (Testing)
   - http://localhost:3000/testing
   - 测试想法管理
   - 测试执行跟踪
   - 结果分析

4. **广告分析** (Ads)
   - http://localhost:3000/ads
   - 广告活动概览
   - 平台对比
   - 受众洞察

5. **私域运营** (Private)
   - http://localhost:3000/private
   - 私域账号管理
   - 流量分析
   - 转化漏斗

## 🔧 常用操作

### 停止应用
按 `Ctrl + C`

### 使用Turso数据库
```bash
USE_TURSO=true npm run dev
```

### 查看日志
应用运行时会在终端显示实时日志

### 清除缓存
```bash
rm -rf .next
npm run dev
```

## 🚀 生产环境

### Vercel部署地址
- 生产环境: https://tribit2.vercel.app (如果已部署)
- 查看部署状态: https://vercel.com/keevingfu/tribit2

### 部署到生产
```bash
npm run deploy
```

## ⚡ 快速链接

- [API健康检查](http://localhost:3000/api/health)
- [数据库状态](http://localhost:3000/api/health/db)
- [API文档](http://localhost:3000/api-docs) (如果配置)

## 🐛 问题排查

### 端口被占用？
```bash
# 查找占用3000端口的进程
lsof -i :3000

# 或使用其他端口
PORT=3001 npm run dev
```

### 数据库连接错误？
- 检查 `.env.local` 文件
- 确保数据库文件存在: `data/tribit.db`
- 查看终端错误信息

### 页面加载慢？
- 首次启动需要编译，请耐心等待
- 开发模式下性能较慢是正常的

---

**应用正在运行中！** 打开浏览器访问 http://localhost:3000 开始使用。