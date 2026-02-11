#!/bin/bash

# Server'da migration ishga tushirish uchun buyruqlar
# Bu buyruqlarni server'da ishga tushiring:

echo "=== Server Migration Commands ==="
echo ""

echo "1. Tokyo papkasiga o'ting:"
echo "cd /root/tokyo"
echo ""

echo "2. Virtual environment'ni faollashtiring:"
echo "source venv/bin/activate"
echo ""

echo "3. Migration holatini tekshiring:"
echo "python3 manage.py showmigrations menu"
echo ""

echo "4. Yangi migration'larni qo'shing:"
echo "python3 manage.py migrate"
echo ""

echo "5. Gunicorn'ni to'xtating:"
echo "pkill -f gunicorn"
echo ""

echo "6. 3 soniya kutib turing:"
echo "sleep 3"
echo ""

echo "7. Gunicorn'ni qayta ishga tushiring:"
echo "gunicorn restaurant_api.wsgi:application --bind 0.0.0.0:8000 --workers 3 --daemon"
echo ""

echo "8. Migration holatini qayta tekshiring:"
echo "python3 manage.py showmigrations menu"
echo ""

echo "=== End of Commands ==="
echo ""
echo "Bu buyruqlarni ketma-ket server'da ishga tushiring!"

