# GitHub 推送指南

## 方法 1：使用个人访问令牌（推荐）

1. **创建 Personal Access Token**
   - 访问 https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - Token 名称：`Tribit Dashboard Push`
   - 选择权限：☑️ repo (全部)
   - 点击 "Generate token"
   - **重要**：复制生成的 token（只显示一次！）

2. **推送代码**
   在终端运行：
   ```bash
   git push -u origin main
   ```
   
   当提示输入时：
   - Username: `keevingfu`
   - Password: 粘贴你的 Personal Access Token（不是 GitHub 密码！）

## 方法 2：使用 GitHub Desktop（最简单）

1. 下载 GitHub Desktop: https://desktop.github.com/
2. 登录你的 GitHub 账户
3. 添加本地仓库：File → Add Local Repository
4. 选择 `/Users/cavin/Desktop/dev/tribit2`
5. 点击 "Publish repository" 或 "Push origin"

## 方法 3：使用 SSH（已配置）

1. 将之前生成的 SSH 公钥添加到 GitHub：
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBK+7WWbQ7ZTLj7iU7ZuCUBwC4D7HlZZ0qsQU41yqsG1 keevingfu@gmail.com
   ```
   
2. 添加到 https://github.com/settings/keys

3. 切换到 SSH 并推送：
   ```bash
   git remote set-url origin git@github.com:keevingfu/tribit3.git
   git push -u origin main
   ```

## 当前仓库状态

- 所有文件已提交 ✅
- 共 3 个提交准备推送
- 远程仓库：https://github.com/keevingfu/tribit3.git

## 需要推送的文件

- 所有 HTML 仪表板文件
- index.html (门户页面)
- vercel.json (Vercel 配置)
- README.md
- CLAUDE.md