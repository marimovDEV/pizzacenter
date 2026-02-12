#!/bin/bash

# VPS Deployment Automation Script
# Run this on your VPS to setup the independent services

echo "🚀 Starting Deployment Setup..."

# 1. Pizza Center Garden Setup
echo "🍕 Setting up Pizza Center Garden..."
cd /var/www/pizzacentergarden
git pull origin main

# Pizza Center uses 'backend' subdirectory for Django
PC_BACKEND="/var/www/pizzacentergarden/backend"
if [ -d "$PC_BACKEND" ]; then
    source "$PC_BACKEND/venv/bin/activate"
    pip install -r "$PC_BACKEND/requirements.txt"
    python3 "$PC_BACKEND/manage.py migrate"
    deactivate
fi

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
    
    # Check if Tokyo has 'backend' subdirectory or if it's in the root
    if [ -f "/root/tokyo/backend/manage.py" ]; then
        TOKYO_ROOT="/root/tokyo/backend"
    else
        TOKYO_ROOT="/root/tokyo"
    fi

    source "/root/tokyo/venv/bin/activate"
    if [ -f "$TOKYO_ROOT/requirements.txt" ]; then
        pip install -r "$TOKYO_ROOT/requirements.txt"
    fi
    if [ -f "$TOKYO_ROOT/manage.py" ]; then
        python3 "$TOKYO_ROOT/manage.py" migrate
    fi
    deactivate

    echo "📋 Creating tokyo.service..."
    cat <<EOF | sudo tee /etc/systemd/system/tokyo.service
[Unit]
Description=Gunicorn instance to serve Tokyo Kafe
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=$TOKYO_ROOT
Environment="PATH=/root/tokyo/venv/bin"
ExecStart=/root/tokyo/venv/bin/gunicorn --workers 3 --bind unix:$TOKYO_ROOT/tokyo.sock restaurant_api.wsgi:application

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
