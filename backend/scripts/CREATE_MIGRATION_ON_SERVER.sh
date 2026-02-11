#!/bin/bash

# Server'da yangi migration yaratish uchun buyruqlar
# Bu buyruqlarni server'da ishga tushiring:

echo "=== Server Migration Creation Commands ==="
echo ""

echo "1. Tokyo papkasiga o'ting:"
echo "cd /root/tokyo"
echo ""

echo "2. Virtual environment'ni faollashtiring:"
echo "source venv/bin/activate"
echo ""

echo "3. Git'dan yangi o'zgarishlarni oling:"
echo "git pull origin main"
echo ""

echo "4. Yangi migration yarating:"
echo "python3 manage.py makemigrations menu"
echo ""

echo "5. Migration'larni ishga tushiring:"
echo "python3 manage.py migrate"
echo ""

echo "6. Gunicorn'ni to'xtating:"
echo "pkill -f gunicorn"
echo ""

echo "7. 3 soniya kutib turing:"
echo "sleep 3"
echo ""

echo "8. Gunicorn'ni qayta ishga tushiring:"
echo "gunicorn restaurant_api.wsgi:application --bind 0.0.0.0:8000 --workers 3 --daemon"
echo ""

echo "9. Migration holatini tekshiring:"
echo "python3 manage.py showmigrations menu"
echo ""

echo "10. API'ni test qiling:"
echo "curl -X GET 'http://localhost:8000/api/menu-items/?show_all=true' | jq '.results[0] | {id, name, weight}'"
echo ""

echo "=== End of Commands ==="
echo ""
echo "Bu buyruqlarni ketma-ket server'da ishga tushiring!"

