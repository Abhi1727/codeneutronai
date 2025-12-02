#!/bin/bash

# CodeNeutronAI Deployment Script
# Run this after making changes to deploy to live site

echo "🚀 Deploying CodeNeutronAI..."

# Copy all files to web directory
sudo cp -r /root/codeneutroai/* /var/www/codeneutronai.com/

# Set proper ownership
sudo chown -R www-data:www-data /var/www/codeneutronai.com/

# Clear nginx cache (if any)
sudo systemctl reload nginx

echo "✅ Deployment complete!"
echo "🌐 Your site is live at: https://codeneutronai.com"
