#!/bin/bash

# GitHub Upload Script for Tribit Project
# This script helps you upload the project to GitHub

echo "================================================"
echo "     Tribit Project GitHub Upload Script"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the buagent project directory!"
    echo "Please run this script from /Users/cavin/Desktop/dev/buagent/"
    exit 1
fi

# Check git status
echo "📋 Checking Git status..."
git status --short

# Function to setup GitHub CLI if available
setup_github_cli() {
    if command -v gh &> /dev/null; then
        echo "🔧 GitHub CLI detected. Setting up authentication..."
        gh auth login
        return 0
    else
        return 1
    fi
}

# Function to push using credentials
push_with_credentials() {
    echo ""
    echo "📤 Attempting to push to GitHub..."
    echo "Repository: https://github.com/keevingfu/tribit2.git"
    echo ""
    echo "You will be prompted for:"
    echo "1. Username: Your GitHub username"
    echo "2. Password: Your Personal Access Token (NOT your password)"
    echo ""
    echo "To create a Personal Access Token:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Click 'Generate new token'"
    echo "3. Select 'repo' scope"
    echo "4. Copy the token and use it as password"
    echo ""
    
    git push -u origin main
}

# Function to setup SSH
setup_ssh() {
    echo ""
    echo "🔐 Setting up SSH..."
    echo "Changing remote URL to SSH..."
    git remote set-url origin git@github.com:keevingfu/tribit2.git
    
    echo ""
    echo "Testing SSH connection..."
    ssh -T git@github.com
    
    if [ $? -eq 0 ]; then
        echo "✅ SSH connection successful!"
        git push -u origin main
    else
        echo "❌ SSH connection failed. Please set up SSH keys first."
        echo "Guide: https://docs.github.com/en/authentication/connecting-to-github-with-ssh"
    fi
}

# Main menu
echo ""
echo "Choose upload method:"
echo "1) Use GitHub CLI (recommended if installed)"
echo "2) Use HTTPS with Personal Access Token"
echo "3) Use SSH"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        if setup_github_cli; then
            git push -u origin main
        else
            echo "❌ GitHub CLI not installed."
            echo "Install it from: https://cli.github.com/"
            echo "Falling back to HTTPS method..."
            push_with_credentials
        fi
        ;;
    2)
        push_with_credentials
        ;;
    3)
        setup_ssh
        ;;
    4)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

# Check if push was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Project uploaded to GitHub!"
    echo "🔗 View your repository at: https://github.com/keevingfu/tribit2"
    echo ""
    echo "Next steps:"
    echo "1. Add collaborators in repository settings"
    echo "2. Set up branch protection rules"
    echo "3. Configure GitHub Actions for CI/CD"
    echo "4. Update repository description and topics"
else
    echo ""
    echo "❌ Upload failed. Please check the error messages above."
    echo ""
    echo "Common solutions:"
    echo "1. Make sure you're using a Personal Access Token, not your password"
    echo "2. Ensure the token has 'repo' permissions"
    echo "3. Check if the repository exists and you have access"
    echo "4. Try running: git remote -v to verify the remote URL"
fi