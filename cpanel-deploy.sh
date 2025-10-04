#!/bin/bash

# cPanel Deploy Script
echo "🚀 Starting cPanel Deploy..."

# Get cPanel information
read -p "cPanel host address: " CPANEL_HOST
read -p "cPanel username: " CPANEL_USER
read -p "public_html path (example: /home/username/public_html): " PUBLIC_HTML
read -p "backend path (example: /home/username/backend): " BACKEND_PATH

echo "📝 cPanel Information:"
echo "   Host: $CPANEL_HOST"
echo "   User: $CPANEL_USER"
echo "   Frontend: $PUBLIC_HTML"
echo "   Backend: $BACKEND_PATH"
echo ""

# Build Frontend
echo "🏗️ Building Frontend..."
cp .env.production .env
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend built successfully"

# Upload Frontend
echo "📁 Uploading Frontend..."
scp -r dist/* $CPANEL_USER@$CPANEL_HOST:$PUBLIC_HTML/

if [ $? -ne 0 ]; then
    echo "❌ Frontend upload failed"
    exit 1
fi

echo "✅ Frontend uploaded successfully"

# Upload Backend
echo "📁 Uploading Backend..."
scp -r server/* $CPANEL_USER@$CPANEL_HOST:$BACKEND_PATH/

if [ $? -ne 0 ]; then
    echo "❌ Backend upload failed"
    exit 1
fi

echo "✅ Backend uploaded successfully"

# Execute commands on cPanel
echo "🔧 Configuring cPanel..."

ssh $CPANEL_USER@$CPANEL_HOST << EOF
    echo "📦 Installing Backend dependencies..."
    cd $BACKEND_PATH
    npm install --production
    
    echo "📁 Creating images folder..."
    mkdir -p $PUBLIC_HTML/uploads/images
    
    echo "📸 Copying images..."
    cp -r $BACKEND_PATH/uploads/images/* $PUBLIC_HTML/uploads/images/ 2>/dev/null || echo "Images folder is empty"
    
    echo "🔐 Setting permissions..."
    chmod 755 $PUBLIC_HTML/uploads/images/
    chmod 644 $PUBLIC_HTML/uploads/images/* 2>/dev/null || echo "No image files found"
    
    echo "📄 Creating .htaccess..."
    cat > $PUBLIC_HTML/.htaccess << 'HTACCESS_EOF'
RewriteEngine On

# Route API to Node.js
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# Route images to Node.js
RewriteCond %{REQUEST_URI} ^/uploads/images/
RewriteRule ^uploads/images/(.*)$ http://localhost:3001/uploads/images/$1 [P,L]

# Route static files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]
HTACCESS_EOF
    
    echo "📄 Creating .htaccess for images..."
    cat > $PUBLIC_HTML/uploads/images/.htaccess << 'IMG_HTACCESS_EOF'
# Image settings
RewriteEngine On

# Set content type
<FilesMatch "\\.(jpg|jpeg|png|gif|webp|svg)$">
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Security: Prevent PHP execution
<FilesMatch "\\.(php|phtml|php3|php4|php5|php7|pl|py|jsp|asp|sh|cgi)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>
IMG_HTACCESS_EOF
    
    echo "✅ cPanel configuration completed!"
    echo ""
    echo "📋 Next steps in cPanel:"
    echo "1. Open Node.js Selector"
    echo "2. Click Create Application"
    echo "3. Settings:"
    echo "   - Node.js version: 18.x"
    echo "   - Application root: $BACKEND_PATH"
    echo "   - Application URL: /api"
    echo "   - Application startup file: index.js"
    echo "4. Add Environment Variables:"
    echo "   - NODE_ENV=production"
    echo "   - BASE_URL=https://ghesti.peykkhorshid.ir"
    echo "   - PORT=3001"
    echo "   - DB_HOST=localhost"
    echo "   - DB_USER=your_username"
    echo "   - DB_PASSWORD=your_password"
    echo "   - DB_NAME=peykhorshid"
    echo "5. Click Start Application"
EOF

if [ $? -eq 0 ]; then
    echo "🎉 cPanel Deploy completed successfully!"
    echo ""
    echo "📋 Remaining steps:"
    echo "1. cPanel → Node.js Selector"
    echo "2. Create Application"
    echo "3. Configure Environment Variables"
    echo "4. Start Application"
    echo ""
    echo "🔗 Testing:"
    echo "   Frontend: https://ghesti.peykkhorshid.ir"
    echo "   API: https://ghesti.peykkhorshid.ir/api/content/home/hero"
    echo "   Images: https://ghesti.peykkhorshid.ir/uploads/images/"
else
    echo "❌ Error in cPanel configuration"
    exit 1
fi
