#!/bin/bash

echo "Pushing to GitHub repository..."
echo "You will be prompted for your GitHub username and Personal Access Token"
echo ""
echo "To create a Personal Access Token:"
echo "1. Go to https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Give it a name and select 'repo' scope"
echo "4. Copy the token and use it as your password"
echo ""
echo "Press Enter to continue..."
read

git push -u origin main