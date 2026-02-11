#!/bin/bash

# =======================================================
# Tokyo Kafe - Beget Server Yangilash Buyruqlari
# =======================================================

echo "======================================"
echo "Tokyo Kafe - Beget Server Update"
echo "======================================"
echo ""
echo "Quyidagi buyruqlarni tartib bilan bajaring:"
echo ""

# USERNAME ni o'zgartiring!
BEGET_USER="u1234567"  # <-- SHU YERNI O'ZGARTIRING!
DOMAIN="tokyokafe.uz"

echo "1. SSH orqali serverga ulanish:"
echo "   ssh ${BEGET_USER}@${DOMAIN} -p 22"
echo ""

echo "2. Backend papkasiga kirish:"
echo "   cd ~/public_html/backend"
echo ""

echo "3. Yangi settings.py faylini ko'chirish (mahalliy mashinada):"
echo "   scp -P 22 /Users/ogabek/Documents/projects/TOKYO/backend/restaurant_api/settings.py ${BEGET_USER}@${DOMAIN}:~/public_html/backend/restaurant_api/"
echo ""

echo "4. Serverga ulanganingizdan keyin, serverni restart qilish:"
echo "   cd ~/public_html/backend"
echo "   bash restart_beget.sh"
echo ""

echo "5. Status tekshirish:"
echo "   bash status_beget.sh"
echo ""

echo "6. Log ni ko'rish:"
echo "   tail -50 logs/django.log"
echo ""

echo "======================================"
echo "Muammolar bo'lsa, DEPLOY_UPDATES.md ni o'qing"
echo "======================================"


