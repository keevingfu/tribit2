# 自动同步机制使用指南

本项目配置了完整的自动化代码同步机制，确保本地代码更新后能自动验证并同步到远程GitHub仓库。

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装自动同步所需的依赖
npm install --save-dev husky chokidar lodash.debounce

# 初始化Husky（Git hooks）
npx husky install
```

### 2. 配置npm脚本

在 `package.json` 中添加以下脚本：

```json
{
  "scripts": {
    "sync": "node scripts/auto-sync.js",
    "sync:quick": "node scripts/auto-sync.js --skip-validation",
    "watch": "node scripts/watch-and-sync.js",
    "prepare": "husky install"
  }
}
```

## 📋 功能组件

### 1. Git Hooks（自动验证）

**位置**: `.husky/`

- **pre-commit**: 提交前自动运行代码检查
  - ✅ ESLint 代码规范检查
  - ✅ TypeScript 类型检查
  - ✅ 单元测试

- **post-commit**: 提交后自动推送到远程仓库

### 2. 手动同步脚本

**命令**: `npm run sync`

功能：
- 🔍 检查Git状态
- 🧪 运行完整验证（lint、type-check、test）
- 📦 暂存所有更改
- 💬 创建提交（可自定义消息）
- 🚀 自动推送到远程仓库

快速同步（跳过验证）：
```bash
npm run sync:quick
```

### 3. 文件监听自动同步

**命令**: `npm run watch`

功能：
- 👀 实时监控文件变化
- ⏱️ 变化后等待5秒（防抖）
- 🤖 自动提交并推送
- 📝 智能的提交消息

监控的目录：
- `src/`, `app/`, `public/`, `styles/`
- 配置文件（package.json, tsconfig.json等）
- 文档文件（*.md）

### 4. GitHub Actions工作流

**位置**: `.github/workflows/auto-sync.yml`

触发条件：
- 推送到main分支
- Pull Request到main分支
- 每日定时同步（UTC 2:00）

功能：
- 🔄 自动验证代码质量
- 📦 构建项目
- 🚀 部署到Vercel（需配置密钥）

## 🛠️ 使用场景

### 场景1：日常开发

```bash
# 开发时开启文件监听
npm run watch

# 文件保存后会自动：
# 1. 检测到变化
# 2. 等待5秒（收集批量变化）
# 3. 自动提交并推送
```

### 场景2：手动同步

```bash
# 完成一个功能后手动同步
npm run sync

# 紧急修复，跳过验证
npm run sync:quick
```

### 场景3：使用Git命令

```bash
# 传统方式依然可用，会触发hooks
git add .
git commit -m "feat: new feature"
# post-commit hook会自动推送
```

## 📊 同步状态检查

```bash
# 检查同步状态
node scripts/check-sync-status.js

# 输出内容：
# - Git状态
# - 本地/远程差异
# - 文件统计
```

## ⚙️ 高级配置

### 自定义监听路径

编辑 `scripts/watch-and-sync.js`：

```javascript
this.watchPaths = [
  'src/**/*',
  'your-custom-path/**/*'
];
```

### 自定义忽略路径

```javascript
this.ignorePaths = [
  'node_modules/**',
  'your-ignore-path/**'
];
```

### 修改防抖时间

```javascript
// 默认5秒，可以修改为其他值（毫秒）
this.debouncedSync = debounce(this.syncChanges.bind(this), 10000); // 10秒
```

## 🔐 安全注意事项

1. **敏感文件**：确保 `.env` 文件在 `.gitignore` 中
2. **认证信息**：不要在代码中硬编码密钥
3. **自动推送**：确保只推送到你控制的仓库

## 🐛 故障排除

### 问题1：Husky hooks不工作

```bash
# 重新安装husky
rm -rf .husky
npx husky install
npm run prepare
```

### 问题2：推送失败

```bash
# 检查远程仓库权限
git remote -v

# 手动设置远程仓库
git remote set-url origin https://github.com/keevingfu/tribit2.git
```

### 问题3：文件监听占用过多资源

```bash
# 减少监听的文件路径
# 或增加防抖时间
```

## 📈 最佳实践

1. **定期手动检查**：虽然有自动同步，但建议定期手动检查同步状态
2. **合理的提交粒度**：使用手动同步来控制提交的粒度
3. **验证很重要**：不要总是跳过验证，确保代码质量
4. **监控资源使用**：文件监听可能占用资源，不用时记得关闭

## 🚦 工作流程图

```
本地开发
   ↓
文件变化 → 文件监听器检测
   ↓            ↓
手动同步      自动同步（5秒延迟）
   ↓            ↓
代码验证（可选）  ↓
   ↓            ↓
Git提交 ←-------┘
   ↓
自动推送到GitHub
   ↓
GitHub Actions验证
   ↓
部署到生产环境
```

## 💡 提示

- 使用 `npm run watch` 进行实时开发
- 重要更新使用 `npm run sync` 手动控制
- 配置 GitHub Actions 实现持续集成/部署
- 定期运行 `node scripts/check-sync-status.js` 确保同步

---

通过这套自动同步机制，你可以专注于代码开发，而不用担心忘记提交或推送代码。系统会自动处理这些繁琐的工作，确保本地和远程仓库始终保持同步。