import os
import json
import django
import sys
import re

# Django muhitini sozlash
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from menu.models import Category, MenuItem

def normalize_name(name):
    """Solishtirish uchun nomni normalizatsiya qilish"""
    if not name:
        return ""
    # Bo'shliqlarni va maxsus belgilarni tozalash, kichik harflarga o'tkazish
    name = str(name).lower().strip()
    name = re.sub(r'[^a-zA-Z0-9\u0400-\u04FF\s]', '', name)
    return " ".join(name.split())

def import_menu_dedup():
    json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'menu.json')
    
    if not os.path.exists(json_path):
        print(f"❌ Fayl topilmadi: {json_path}")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Mavjud mahsulotlarni indekslash (nomlari bo'yicha)
    existing_items = set()
    for item in MenuItem.objects.all():
        existing_items.add(normalize_name(item.name))
        existing_items.add(normalize_name(item.name_uz))
        existing_items.add(normalize_name(item.name_ru))

    print(f"Bazada {len(existing_items)//3} ta mahsulot mavjud (taxminan).")

    menu = data.get('kafe_menyu', {})
    
    # Kategoriya xaritasi (3 tilda) - import_menu.py dagi kabi
    category_map = {
        'pitsa': {'en': 'Pizza', 'uz': 'Pitsa', 'ru': 'Пицца', 'icon': '🍕'},
        'lavash_va_shaverma': {'en': 'Fast Food', 'uz': 'Fast Food', 'ru': 'Фаст Фуд', 'icon': '🌯'},
        'burgerlar': {'en': 'Fast Food', 'uz': 'Fast Food', 'ru': 'Фаст Фуд', 'icon': '🍔'},
        'rollar': {'en': 'Sushi & Rolls', 'uz': 'Sushi va Rollslar', 'ru': 'Суши и Роллы', 'icon': '🍣'},
        'setlar': {'en': 'Sushi & Rolls', 'uz': 'Sushi va Rollslar', 'ru': 'Суши и Роллы', 'icon': '🍱'},
        'suplar_va_ramen': {'en': 'Ramen & Noodles', 'uz': 'Ramen va Lagmon', 'ru': 'Рамен и Лапша', 'icon': '🥣'},
        'shashliklar': {'en': 'Shashlik (BBQ)', 'uz': 'Shashliklar', 'ru': 'Шашлыки', 'icon': '🍢'},
        'issiq_taomlar_va_pastalar': {'en': 'Hot Dishes & Pasta', 'uz': 'Issiq taomlar va pastalar', 'ru': 'Горячие блюда и паста', 'icon': '🍲'},
        'choylar': {'en': 'Drinks', 'uz': 'Ichimliklar', 'ru': 'Напитки', 'icon': '☕'},
        'kofe': {'en': 'Drinks', 'uz': 'Ichimliklar', 'ru': 'Напитки', 'icon': '☕'},
        'freshlar': {'en': 'Drinks', 'uz': 'Ichimliklar', 'ru': 'Напитки', 'icon': '🥤'},
        'gazli_ichimliklar': {'en': 'Drinks', 'uz': 'Ichimliklar', 'ru': 'Напитки', 'icon': '🥤'},
        'salatlar': {'en': 'Salads', 'uz': 'Salatlar', 'ru': 'Салаты', 'icon': '🥗'},
        'non': {'en': 'Bread', 'uz': 'Non', 'ru': 'Хлеб', 'icon': '🍞'},
        'garnirlar_va_kfc': {'en': 'Side Dishes', 'uz': 'Garnirlar', 'ru': 'Гарниры', 'icon': '🍗'},
        'appetizers': {'en': 'Appetizers', 'uz': 'Iftitoh Taomlar', 'ru': 'Закуски', 'icon': '🥗'},
        'desertlar': {'en': 'Desserts', 'uz': 'Desertlar', 'ru': 'Десерты', 'icon': '🍰'},
        'steyklar': {'en': 'Steaks', 'uz': 'Steyklar', 'ru': 'Стейки', 'icon': '🥩'},
        'fast_fud': {'en': 'Fast Food', 'uz': 'Fast food', 'ru': 'Фастфуд', 'icon': '🍔'}
    }

    created_count = 0
    skipped_count = 0
    
    def get_or_create_category(key):
        cat_info = category_map.get(key, {'en': key.replace('_', ' ').title(), 'uz': key.replace('_', ' ').title(), 'ru': key.replace('_', ' ').title(), 'icon': '🍽️'})
        category, created = Category.objects.get_or_create(
            name=cat_info['en'],
            defaults={
                'name_uz': cat_info['uz'],
                'name_ru': cat_info['ru'],
                'icon': cat_info['icon'],
                'is_active': True
            }
        )
        return category

    def is_duplicate(names):
        for name in names:
            if normalize_name(name) in existing_items:
                return True
        return False

    # Pitsa
    pitsa_cat = get_or_create_category('pitsa')
    for p in menu.get('pitsa', []):
        for variant in p.get('turlari', []):
            # Variant nomlarini yaratish (import_menu dagi kabi)
            name_uz = f"{p['nomi']['uz']} {variant['olchami']}"
            name_ru = f"{p['nomi']['ru']} {variant['olchami']}"
            name_en = f"{p['nomi']['en']} {variant['olchami']}"
            
            # Shuningdek (Kichik), (O'rta) formatlarini ham tekshirish (pizzabackup dagi kabi)
            size_map_uz = {"1": "Kichik", "2": "O'rta", "3": "Katta", "4": "Juda katta"}
            size_map_en = {"1": "Small", "2": "Medium", "3": "Large", "4": "Extra Large"}
            size_map_ru = {"1": "Маленькая", "2": "Средняя", "3": "Большая", "4": "Очень большая"}
            
            alt_name_uz = f"{p['nomi']['uz']} Pitsa {variant['olchami']} ({size_map_uz.get(variant['olchami'], '')})"
            alt_name_en = f"{p['nomi']['en']} Pizza {variant['olchami']} ({size_map_en.get(variant['olchami'], '')})"
            alt_name_ru = f"{p['nomi']['ru']} Пицца {variant['olchami']} ({size_map_ru.get(variant['olchami'], '')})"

            if is_duplicate([name_en, name_uz, name_ru, alt_name_en, alt_name_uz, alt_name_ru]):
                skipped_count += 1
                continue
            
            MenuItem.objects.create(
                name=name_en,
                category=pitsa_cat,
                name_uz=name_uz,
                name_ru=name_ru,
                description=p['tavsifi']['en'],
                description_uz=p['tavsifi']['uz'],
                description_ru=p['tavsifi']['ru'],
                price=variant['narxi'],
                ingredients=", ".join(p['tarkibi']['en']) if isinstance(p['tarkibi']['en'], list) else p['tarkibi']['en'],
                ingredients_uz=", ".join(p['tarkibi']['uz']) if isinstance(p['tarkibi']['uz'], list) else p['tarkibi']['uz'],
                ingredients_ru=", ".join(p['tarkibi']['ru']) if isinstance(p['tarkibi']['ru'], list) else p['tarkibi']['ru'],
                is_active=True, available=True
            )
            created_count += 1

    # Boshqa bo'limlar uchun
    def process_items(items, cat_key):
        nonlocal created_count, skipped_count
        category = get_or_create_category(cat_key)
        for item in items:
            name_en = item['nomi']['en']
            name_uz = item['nomi']['uz']
            name_ru = item['nomi']['ru']
            
            if is_duplicate([name_en, name_uz, name_ru]):
                skipped_count += 1
                continue
                
            MenuItem.objects.create(
                name=name_en,
                category=category,
                name_uz=name_uz,
                name_ru=name_ru,
                description=item['tavsifi']['en'],
                description_uz=item['tavsifi']['uz'],
                description_ru=item['tavsifi']['ru'],
                price=item['narxi'],
                ingredients=", ".join(item['tarkibi']['en']) if isinstance(item['tarkibi']['en'], list) else item['tarkibi']['en'],
                ingredients_uz=", ".join(item['tarkibi']['uz']) if isinstance(item['tarkibi']['uz'], list) else item['tarkibi']['uz'],
                ingredients_ru=", ".join(item['tarkibi']['ru']) if isinstance(item['tarkibi']['ru'], list) else item['tarkibi']['ru'],
                is_active=True, available=True
            )
            created_count += 1

    # Menyu bo'limlarini aylanib chiqish
    for key, val in menu.items():
        if key == "pitsa": continue
        if isinstance(val, list):
            process_items(val, key)
        elif isinstance(val, dict):
            for sub_key, sub_val in val.items():
                if isinstance(sub_val, list):
                    process_items(sub_val, sub_key)

    print(f"✅ Yakunlandi!")
    print(f"   Qo'shildi: {created_count}")
    print(f"   O'tkazib yuborildi (dublikat): {skipped_count}")
    print(f"   Jami mahsulotlar: {MenuItem.objects.count()}")

if __name__ == '__main__':
    import_menu_dedup()
