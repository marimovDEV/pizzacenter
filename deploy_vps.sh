#!/bin/bash

# VPS Deployment Automation Script
# Run this on your VPS to setup the independent services

echo "🚀 Starting Deployment Setup..."

# 1. Pizza Center Garden Setup
echo "🍕 Setting up Pizza Center Garden..."
cd /var/www/pizzacentergarden
git pull origin main
source backend/venv/bin/activate
pip install -r backend/requirements.txt
python3 backend/manage.py migrate
deactivate

# 2. Create Systemd Service for Pizza Center
echo "📋 Creating pizzacenter.service..."
cat <<EOF | sudo tee /etc/systemd/system/pizzacenter.service
[Unit]
Description=Gunicorn instance to serve Pizza Center Garden
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/var/www/pizzacentergarden/backend
Environment="PATH=/var/www/pizzacentergarden/backend/venv/bin"
ExecStart=/var/www/pizzacentergarden/backend/venv/bin/gunicorn --workers 3 --bind unix:/var/www/pizzacentergarden/backend/pizzacenter.sock restaurant_api.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

# 3. Create Systemd Service for Tokyo (if exists)
if [ -d "/root/tokyo" ]; then
    echo "🍣 Setting up Tokyo Kafe..."
    cd /root/tokyo
    # Manual check: make sure Tokyo origin is correct
    # git pull origin main 
    source venv/bin/activate
    pip install -r backend/requirements.txt
    python3 backend/manage.py migrate
    deactivate

    echo "📋 Creating tokyo.service..."
    cat <<EOF | sudo tee /etc/systemd/system/tokyo.service
[Unit]
Description=Gunicorn instance to serve Tokyo Kafe
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/root/tokyo/backend
Environment="PATH=/root/tokyo/backend/venv/bin"
ExecStart=/root/tokyo/backend/venv/bin/gunicorn --workers 3 --bind unix:/root/tokyo/backend/tokyo.sock restaurant_api.wsgi:application

[Install]
WantedBy=multi-user.target
EOF
fi

# 4. Restart and Enable Services
echo "🔄 Reloading systemd and restarting services..."
sudo systemctl daemon-reload
sudo systemctl enable pizzacenter.service
sudo systemctl restart pizzacenter.service

if [ -f "/etc/systemd/system/tokyo.service" ]; then
    sudo systemctl enable tokyo.service
    sudo systemctl restart tokyo.service
fi

echo "✅ Deployment Setup Complete!"
echo "Check status with: sudo systemctl status pizzacenter tokyo"
