# 如何取消 Vercel 构建

## 方法 1：通过 Dashboard（推荐）

1. 访问：https://vercel.com/keevingfus-projects/tribit/deployments
2. 找到状态为 "Building" 的部署
3. 点击该部署进入详情页
4. 点击右上角的 "Cancel" 按钮（如果可用）

## 方法 2：使用 Vercel CLI

```bash
# 列出所有部署
npx vercel ls

# 找到正在构建的部署 ID（状态为 BUILDING）
# 取消特定部署
npx vercel rm [deployment-id]
```

## 方法 3：等待超时

- Vercel 构建有最大时间限制（通常是 45 分钟）
- 超时后会自动失败，队列会继续

## 查看构建队列

1. 在 Deployments 页面，你会看到：
   - 🟡 Building - 正在构建
   - ⏸️ Queued - 在队列中等待
   - ✅ Ready - 构建成功
   - ❌ Failed - 构建失败

## 避免构建队列

1. **减少推送频率**
   - 合并多个提交后再推送
   - 使用本地测试确保代码正确

2. **使用 Vercel CLI 预览**
   ```bash
   # 本地预览，不占用构建队列
   npx vercel dev
   ```

3. **升级到 Pro 计划**
   - Pro 计划支持并发构建
   - 可以同时运行多个构建

## 当前状态

- 最新提交已推送：修复了环境变量问题
- 等待当前构建完成后，新构建会自动开始
- 预计需要等待 2-5 分钟