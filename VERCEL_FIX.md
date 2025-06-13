# Vercel 部署修复指南

## 问题原因

构建日志显示了一个阻止部署的命令：
```bash
if [ "$VERCEL_ENV" == "production" ]; then exit 1; else exit 0; fi
```

这个命令在生产环境下会失败（exit 1），导致部署无法完成。

## 解决步骤

### 1. 检查 Vercel 项目设置

1. 访问：https://vercel.com/keevingfus-projects/tribit/settings
2. 找到 "Build & Development Settings"
3. 检查是否有 "Ignored Build Step" 设置
4. **删除或清空** 任何包含 `exit 1` 的命令

### 2. 或者在 Vercel Dashboard 中重置构建设置

1. 进入：Settings → General
2. 找到 "Build & Development Settings"
3. 点击 "Override" 旁边的设置
4. 确保以下设置：
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

### 3. 清除任何自定义的 "Ignored Build Step"

如果有 "Ignored Build Step" 配置：
1. 清空该字段
2. 或者改为：`exit 0`（总是允许构建）

### 4. 环境变量检查

确保没有设置会影响构建的环境变量：
- 删除任何 `VERCEL_ENV` 相关的自定义设置
- Vercel 会自动设置这个变量，不需要手动配置

## 已完成的修复

1. ✅ 简化了 vercel.json 配置
2. ✅ 修复了 Node.js 版本警告
3. ✅ 使用标准的构建命令

## 下一步

推送这些更改后，Vercel 应该能成功构建：
```bash
git add vercel.json package.json
git commit -m "Fix Vercel production build"
git push
```