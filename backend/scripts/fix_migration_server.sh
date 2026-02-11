#!/bin/bash

# Server'da migration faylini tuzatish uchun buyruqlar
# Bu buyruqlarni server'da ishga tushiring:

echo "=== Server Migration Fix Commands ==="
echo ""

echo "1. Tokyo papkasiga o'ting:"
echo "cd /root/tokyo"
echo ""

echo "2. Virtual environment'ni faollashtiring:"
echo "source venv/bin/activate"
echo ""

echo "3. Migration faylini o'chiring:"
echo "rm menu/migrations/0014_add_weight_order_fields.py"
echo ""

echo "4. To'g'ri migration faylini yarating:"
echo "cat > menu/migrations/0014_add_weight_order_fields.py << 'EOF'"
echo "# Generated manually"
echo "from django.db import migrations, models"
echo "from django.core.validators import MinValueValidator"
echo ""
echo ""
echo "class Migration(migrations.Migration):"
echo ""
echo "    dependencies = ["
echo "        ('menu', '0013_alter_category_options_alter_menuitem_options_and_more'),"
echo "    ]"
echo ""
echo "    operations = ["
echo "        migrations.AddField("
echo "            model_name='category',"
echo "            name='order',"
echo "            field=models.PositiveIntegerField(default=0, help_text='Display order'),"
echo "        ),"
echo "        migrations.AddField("
echo "            model_name='menuitem',"
echo "            name='weight',"
echo "            field=models.DecimalField(blank=True, decimal_places=2, help_text='Weight in grams', max_digits=8, null=True, validators=[MinValueValidator(0)]),"
echo "        ),"
echo "        migrations.AlterModelOptions("
echo "            name='category',"
echo "            options={'ordering': ['order', 'name'], 'verbose_name': 'Kategoriya', 'verbose_name_plural': 'Kategoriyalar'},"
echo "        ),"
echo "    ]"
echo "EOF"
echo ""

echo "5. Migration'ni ishga tushiring:"
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

echo "9. Tekshiring:"
echo "curl -X GET 'http://localhost:8000/api/menu-items/?show_all=true' | jq '.results[0] | {id, name, weight}'"
echo ""

echo "=== End of Commands ==="

