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

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Warning: Vercel CLI is not installed. You'll need to install it for Vercel deployment."
    echo "Run: npm install -g vercel"
    VERCEL_INSTALLED=false
else
    VERCEL_INSTALLED=true
fi

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

# Step 4: Add GitHub remote
echo "Adding GitHub remote..."
git remote add origin https://github.com/harl00/dgx-radar-2025.git
echo "GitHub remote added."

# Step 5: Push to GitHub
echo "Pushing to GitHub..."
echo "This will push to the main branch. If you want to use a different branch, please modify this script."
git push -u origin main
echo "Pushed to GitHub."

# Step 6: Deploy to Vercel
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
echo "1. Visit your GitHub repository: https://github.com/harl00/dgx-radar-2025"
echo "2. If you deployed to Vercel, check your deployment on the Vercel dashboard"
echo ""
echo "Thank you for using the DGX Radar 2025 Deployment Script!"
