#!/bin/bash

echo "🚀 Starting server migration process..."

# Connect to server and run migration commands
ssh root@185.174.137.26 << 'EOF'

echo "📂 Navigating to project directory..."
cd /root/tokyo

echo "🔧 Activating virtual environment..."
source venv/bin/activate

echo "📥 Pulling latest changes..."
git fetch origin
git reset --hard origin/main

echo "🗃️ Running migrations..."
python3 manage.py makemigrations menu
python3 manage.py migrate

echo "🛑 Stopping gunicorn..."
pkill -f gunicorn

echo "⏳ Waiting for processes to stop..."
sleep 3

echo "🔄 Starting gunicorn..."
gunicorn restaurant_api.wsgi:application --bind 0.0.0.0:8000 --workers 3 --daemon

echo "✅ Migration completed successfully!"
echo "🌐 Server should be accessible at https://api.tokyokafe.uz"

EOF

echo "🎉 Server migration process completed!"

