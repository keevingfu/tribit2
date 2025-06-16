# 🚀 快速开始 - 自动同步机制

## 立即使用

### 1. 手动同步（推荐日常使用）
```bash
# 完整验证后同步
npm run sync

# 快速同步（跳过验证）
npm run sync:quick
```

### 2. 自动监听同步
```bash
# 启动文件监听器（开发时使用）
npm run watch
# 按 Ctrl+C 停止
```

### 3. 检查同步状态
```bash
npm run sync:status
```

## 工作流程

1. **开发模式**：
   - 运行 `npm run watch`
   - 正常编辑文件
   - 系统自动检测变化并同步

2. **手动模式**：
   - 完成功能开发
   - 运行 `npm run sync`
   - 输入提交信息
   - 自动推送到GitHub

## 特性

- ✅ 代码提交前自动验证（lint、type-check、test）
- ✅ 提交后自动推送到远程仓库
- ✅ 文件变化自动检测和同步
- ✅ 智能防抖，避免频繁提交
- ✅ GitHub Actions自动化工作流

## 注意事项

- 确保已配置正确的Git远程仓库
- 敏感文件（.env）不会被同步
- 首次使用可能需要输入GitHub凭据

详细文档请查看 [AUTO-SYNC-GUIDE.md](docs/AUTO-SYNC-GUIDE.md)