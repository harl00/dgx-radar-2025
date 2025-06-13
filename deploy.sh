#!/bin/bash

# DGX Radar 2025 Deployment Script
# This script helps deploy the project to GitHub and Vercel

echo "=== DGX Radar 2025 Deployment Script ==="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git first."
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "Warning: GitHub CLI (gh) is not installed. We'll use curl for GitHub API calls instead."
    echo "For a better experience, consider installing GitHub CLI: https://cli.github.com/"
    GH_CLI_INSTALLED=false
else
    GH_CLI_INSTALLED=true
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Warning: Vercel CLI is not installed. You'll need to install it for Vercel deployment."
    echo "Run: npm install -g vercel"
    VERCEL_INSTALLED=false
else
    VERCEL_INSTALLED=true
fi

# GitHub repository details
GITHUB_USER="harl00"
REPO_NAME="dgx-radar-2025"
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo "This script will help you deploy the DGX Radar 2025 project to GitHub and Vercel."
echo ""
echo "Steps:"
echo "1. Initialize a git repository (if not already done)"
echo "2. Add all files to git"
echo "3. Commit changes"
echo "4. Add GitHub remote (https://github.com/harl00/dgx-radar-2025.git)"
echo "5. Push to GitHub"
echo "6. Deploy to Vercel (if Vercel CLI is installed)"
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read

# Step 1: Initialize git repository if not already done
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    echo "Git repository initialized."
else
    echo "Git repository already exists."
fi

# Step 2: Add all files to git
echo "Adding files to git..."
git add .
echo "Files added to git."

# Step 3: Commit changes
echo "Committing changes..."
echo "Enter a commit message (default: 'Initial commit of DGX Radar 2025'):"
read commit_message
if [ -z "$commit_message" ]; then
    commit_message="Initial commit of DGX Radar 2025"
fi
git commit -m "$commit_message"
echo "Changes committed."

# Step 4: Check if repository exists and create it if needed
echo "Checking if GitHub repository exists..."

# Function to create GitHub repository
create_github_repo() {
    if [ "$GH_CLI_INSTALLED" = true ]; then
        echo "Creating GitHub repository using GitHub CLI..."
        gh auth status || (echo "Please login to GitHub CLI first" && gh auth login)
        gh repo create "$GITHUB_USER/$REPO_NAME" --public --description "DGX Radar 2025 - Interactive visualization of digital skills and technologies" || return 1
    else
        echo "Creating GitHub repository using GitHub API..."
        echo "Please enter your GitHub personal access token (needs 'repo' scope):"
        read -s GITHUB_TOKEN
        
        if [ -z "$GITHUB_TOKEN" ]; then
            echo "No token provided. Cannot create repository."
            return 1
        fi
        
        echo "Creating repository..."
        curl -s -X POST \
          -H "Authorization: token $GITHUB_TOKEN" \
          -H "Accept: application/vnd.github.v3+json" \
          https://api.github.com/user/repos \
          -d "{\"name\":\"$REPO_NAME\",\"description\":\"DGX Radar 2025 - Interactive visualization of digital skills and technologies\",\"private\":false}" || return 1
    fi
    
    return 0
}

# Check if repository exists
REPO_EXISTS=false
if [ "$GH_CLI_INSTALLED" = true ]; then
    if gh repo view "$GITHUB_USER/$REPO_NAME" &>/dev/null; then
        REPO_EXISTS=true
    fi
else
    # Try to access the repo via git to see if it exists
    if git ls-remote "$REPO_URL" &>/dev/null; then
        REPO_EXISTS=true
    fi
fi

if [ "$REPO_EXISTS" = false ]; then
    echo "Repository does not exist. Creating it..."
    if ! create_github_repo; then
        echo "Failed to create repository. Please create it manually at https://github.com/new"
        echo "Repository name: $REPO_NAME"
        echo "Then press Enter to continue..."
        read
    else
        echo "Repository created successfully."
    fi
else
    echo "Repository already exists."
fi

# Step 5: Add GitHub remote
echo "Adding GitHub remote..."
git remote remove origin &>/dev/null # Remove if exists
git remote add origin "$REPO_URL"
echo "GitHub remote added."

# Step 6: Push to GitHub
echo "Pushing to GitHub..."
echo "This will push to the main branch. If you want to use a different branch, please modify this script."
git push -u origin main
echo "Pushed to GitHub."

# Step 7: Deploy to Vercel
if [ "$VERCEL_INSTALLED" = true ]; then
    echo "Do you want to deploy to Vercel now? (y/n)"
    read deploy_vercel
    if [ "$deploy_vercel" = "y" ] || [ "$deploy_vercel" = "Y" ]; then
        echo "Deploying to Vercel..."
        vercel
        echo "Deployed to Vercel."
        
        echo "Do you want to deploy to production? (y/n)"
        read deploy_prod
        if [ "$deploy_prod" = "y" ] || [ "$deploy_prod" = "Y" ]; then
            echo "Deploying to production..."
            vercel --prod
            echo "Deployed to production."
        fi
    else
        echo "Skipping Vercel deployment."
    fi
else
    echo "Skipping Vercel deployment (Vercel CLI not installed)."
    echo "To deploy to Vercel later, install the Vercel CLI and run 'vercel' in this directory."
fi

echo ""
echo "=== Deployment process completed ==="
echo ""
echo "Next steps:"
echo "1. Visit your GitHub repository: $REPO_URL"
echo "2. If you deployed to Vercel, check your deployment on the Vercel dashboard"
echo ""
echo "Thank you for using the DGX Radar 2025 Deployment Script!"
