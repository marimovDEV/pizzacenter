import os
import json
import django
import sys

# Django muhitini sozlash
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from menu.models import Category, MenuItem

def import_menu():
    json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'menu.json')
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # BAZANI TOZALASH
    print("Mavjud kategoriya va mahsulotlar o'chirilmoqda...")
    MenuItem.objects.all().delete()
    Category.objects.all().delete()
    print("Baza tozalandi.")

    menu = data.get('kafe_menyu', {})
    
    # Kategoriya xaritasi (3 tilda)
    category_map = {
        'pitsa': {'en': 'Pizza', 'uz': 'Pitsa', 'ru': 'Пицца', 'icon': '🍕'},
        'lavash_va_shaverma': {'en': 'Fast Food', 'uz': 'Fast Food', 'ru': 'Фаст Фуд', 'icon': '🌯'},
        'burgerlar': {'en': 'Fast Food', 'uz': 'Fast Food', 'ru': 'Фаст Фуд', 'icon': '🍔'},
        'rollar': {'en': 'Japan Cuisine', 'uz': 'Yapon Oshxonasi', 'ru': 'Японская кухня', 'icon': '🍣'},
        'setlar': {'en': 'Japan Cuisine', 'uz': 'Yapon Oshxonasi', 'ru': 'Японская кухня', 'icon': '🍱'},
        'suplar_va_ramen': {'en': 'Japan Cuisine', 'uz': 'Yapon Oshxonasi', 'ru': 'Японская кухня', 'icon': '🥣'},
        'shashliklar': {'en': 'Shashlik (BBQ)', 'uz': 'Shashlik', 'ru': 'Шашлык', 'icon': '🍢'},
        'issiq_taomlar_va_pastalar': {'en': 'Hot Dishes & Pasta', 'uz': 'Issiq taomlar va pastalar', 'ru': 'Горячие блюда и паста', 'icon': '🍲'},
        'choylar': {'en': 'Drinks', 'uz': 'Ichimliklar', 'ru': 'Напитки', 'icon': '☕'},
        'kofe': {'en': 'Drinks', 'uz': 'Ichimliklar', 'ru': 'Напитки', 'icon': '☕'},
        'freshlar': {'en': 'Drinks', 'uz': 'Ichimliklar', 'ru': 'Напитки', 'icon': '🥤'},
        'gazli_ichimliklar': {'en': 'Drinks', 'uz': 'Ichimliklar', 'ru': 'Напитки', 'icon': '🥤'},
        'salatlar': {'en': 'Salads & Bread', 'uz': 'Salatlar va non', 'ru': 'Салаты и хлеб', 'icon': '🥗'},
        'non': {'en': 'Salads & Bread', 'uz': 'Salatlar va non', 'ru': 'Салаты va хлеб', 'icon': '🍞'},
        'garnirlar_va_kfc': {'en': 'Side Dishes & KFC', 'uz': 'Garnirlar va KFC', 'ru': 'Гарниры и KFC', 'icon': '🍗'},
        'appetizers': {'en': 'Appetizers', 'uz': 'Ishtaha ochuvchilar', 'ru': 'Закуски', 'icon': '🥗'},
        'desertlar': {'en': 'Desserts', 'uz': 'Shirinliklar', 'ru': 'Десерты', 'icon': '🍰'},
        'steyklar': {'en': 'Steaks', 'uz': 'Steyklar', 'ru': 'Стейки', 'icon': '🥩'},
        'fast_fud': {'en': 'Fast Food', 'uz': 'Fast Fut', 'ru': 'Фаст Фуд', 'icon': '🍔'}
    }

    item_count = 0
    
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

    # Pitsa
    pitsa_cat = get_or_create_category('pitsa')
    for p in menu.get('pitsa', []):
        for variant in p.get('turlari', []):
            name_uz = f"{p['nomi']['uz']} {variant['olchami']}"
            name_ru = f"{p['nomi']['ru']} {variant['olchami']}"
            name_en = f"{p['nomi']['en']} {variant['olchami']}"
            
            MenuItem.objects.create(
                name=name_en,
                category=pitsa_cat,
                name_uz=name_uz,
                name_ru=name_ru,
                description=p['tavsifi']['en'],
                description_uz=p['tavsifi']['uz'],
                description_ru=p['tavsifi']['ru'],
                price=variant['narxi'],
                ingredients=p['tarkibi']['en'],
                ingredients_uz=p['tarkibi']['uz'],
                ingredients_ru=p['tarkibi']['ru'],
                is_active=True, available=True
            )
            item_count += 1

    # Boshqa bo'limlar uchun umumiy funksiya
    def process_items(items, cat_key):
        nonlocal item_count
        category = get_or_create_category(cat_key)
        for item in items:
            MenuItem.objects.create(
                name=item['nomi']['en'],
                category=category,
                name_uz=item['nomi']['uz'],
                name_ru=item['nomi']['ru'],
                description=item['tavsifi']['en'],
                description_uz=item['tavsifi']['uz'],
                description_ru=item['tavsifi']['ru'],
                price=item['narxi'],
                ingredients=item['tarkibi']['en'],
                ingredients_uz=item['tarkibi']['uz'],
                ingredients_ru=item['tarkibi']['ru'],
                is_active=True, available=True
            )
            item_count += 1

    # Rekursiv qayta ishlash (nested bo'limlar uchun)
    def walk_menu(data_node, current_key=None):
        if isinstance(data_node, list):
            process_items(data_node, current_key)
        elif isinstance(data_node, dict):
            for key, val in data_node.items():
                if key != "pitsa": # Pitsa alohida ishlandi
                    walk_menu(val, key if not isinstance(val, dict) else key)

    # Menyu bo'limlarini aylanib chiqish
    for key, val in menu.items():
        if key == "pitsa": continue
        if isinstance(val, list):
            process_items(val, key)
        elif isinstance(val, dict):
            for sub_key, sub_val in val.items():
                process_items(sub_val, sub_key)

    print(f"Muvaffaqiyatli yakunlandi! Jami {item_count} ta mahsulot 3 tilda yuklandi.")

if __name__ == '__main__':
    import_menu()
