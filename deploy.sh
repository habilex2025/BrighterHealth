#!/bin/bash
set -e

# Start deployment
echo "🚀 Starting deployment for {SITE_DOMAIN}"
cd {RELEASE}

# Ensure working directory matches commit
echo "🔄 Ensuring working directory matches commit..."
echo "Release directory: {RELEASE}"
echo "Current commit: $(git rev-parse HEAD)"
echo "Current branch: $(git branch --show-current)"

# Force fetch and reset to latest origin
echo "🔄 Fetching latest from origin..."
git fetch origin
git reset --hard origin/{BRANCH}
git clean -fd
echo "After fetch/reset: $(git rev-parse HEAD)"

# Install PHP dependencies
if [ -f "composer.json" ]; then
    echo "📦 Installing PHP dependencies..."
    {SITE_COMPOSER} install --no-interaction --prefer-dist --optimize-autoloader --no-dev
fi

# Build frontend assets
if [ -f "package.json" ]; then
    echo "🎨 Building frontend assets..."
    export NVM_DIR="$HOME/.nvm"
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        \. "$NVM_DIR/nvm.sh"
    else
        echo "❌ nvm is not installed at $NVM_DIR"
        exit 1
    fi

    if [ -f ".nvmrc" ]; then
        NODE_VERSION="$(tr -d '[:space:]' < .nvmrc)"

        if [ "$(nvm version "$NODE_VERSION")" = "N/A" ]; then
            echo "⬇️ Installing Node.js $NODE_VERSION..."
            nvm install "$NODE_VERSION"
        fi

        nvm use "$NODE_VERSION"
    else
        nvm use
    fi

    # Clear Vite cache to ensure fresh build
    rm -rf node_modules/.vite

    npm ci
    npm run prod
fi

# Shared files
echo "🔗 Setting up shared files..."
SHARED_DIR="/home/ploi/{SITE_DOMAIN}-shared"
mkdir -p ${SHARED_DIR}/uploads
mkdir -p ${SHARED_DIR}/imager
mkdir -p ${SHARED_DIR}/storage

# Require a real shared .env
if [ ! -f "${SHARED_DIR}/.env" ]; then
    if [ -f ".env" ] && [ ! -L ".env" ]; then
        echo "Moving existing .env to shared location"
        cp .env ${SHARED_DIR}/.env
    else
        echo "❌ No ${SHARED_DIR}/.env found. Please create it with real credentials"
        exit 1
    fi
fi

# Secrets file: owner-only. PHP-FPM runs as the same user (ploi).
chmod 600 ${SHARED_DIR}/.env

# Always link to shared .env (force symlink)
echo "🔗 Linking shared .env to release..."
rm -f .env  # Remove any existing .env (real file or symlink)
ln -sf ${SHARED_DIR}/.env .env

# Set up shared uploads symlink in release
echo "🔗 Linking shared uploads to release..."
rm -rf public_html/uploads
rm -rf public_html/imager
rm -rf storage
ln -sf ${SHARED_DIR}/uploads public_html/uploads
ln -sf ${SHARED_DIR}/imager public_html/imager
ln -sf ${SHARED_DIR}/storage storage

# Set permissions
echo "🔐 Setting permissions..."
chown -R ploi:ploi .
find . -type d -exec chmod 755 {} +
find . -type f -exec chmod 644 {} +

# Set shared directory permissions
chmod 755 ${SHARED_DIR}
chmod 755 ${SHARED_DIR}/uploads
chmod 755 ${SHARED_DIR}/imager
chmod 755 ${SHARED_DIR}/storage

# Clean up dev files
echo "🧹 Cleaning up dev files..."
rm -rf node_modules/ README.md .editorconfig .phpuse .sshpath AGENTS.md maintenance.md working.md .env.example .vscode/

# Craft up
echo "🔄 Craft up..."
php craft up --interactive=0

# Reload nginx
echo "🔄 Reloading nginx..."
sudo systemctl reload nginx 2>/dev/null || true

# Warm new release
echo "🔥 Cache warm-up will run ~20s after release switch"
nohup bash -c '
    sleep 20
    curl -sk --max-time 30 "https://{SITE_DOMAIN}/" > /dev/null || true
' > /dev/null 2>&1 &

echo "🚀 Deployment complete for {SITE_DOMAIN}!"
echo "📁 Release: {RELEASE}"
