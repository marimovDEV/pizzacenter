"""
Tokyo rasmlarini PizzaCentr mahsulotlariga biriktirish skripti.
Har bir mahsulotni nomi/kategoriyasi bo'yicha mos rasmga bog'laydi.
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from menu.models import MenuItem, Category

# ====== KEYWORD -> IMAGE MAPPING ======
# Har bir kalit so'z uchun mos rasm
KEYWORD_IMAGE_MAP = {
    # === PIZZA ===
    'pizza': 'menu_items/margherita-pizza.png',
    'pepperoni': 'menu_items/pepperoni-pizza.jpg',
    'margherita': 'menu_items/margherita-pizza.png',
    'quattro': 'menu_items/quattro-formaggi-pizza.jpg',
    'ameriko': 'menu_items/margherita-pizza.png',
    'assorti': 'menu_items/pepperoni-pizza.jpg',
    'barselona': 'menu_items/quattro-formaggi-pizza.jpg',
    'mega': 'menu_items/margherita-pizza.png',
    'meat': 'menu_items/pepperoni-pizza.jpg',
    'go\'shtli': 'menu_items/pepperoni-pizza.jpg',
    'vegetarian': 'menu_items/vegetarian-pizza.jpg',
    'cheese': 'menu_items/quattro-formaggi-pizza.jpg',
    'pishloqli': 'menu_items/quattro-formaggi-pizza.jpg',
    'hawaiian': 'menu_items/margherita-pizza.png',
    'gavayskiy': 'menu_items/margherita-pizza.png',

    # === SALADS ===
    'caesar': 'menu_items/caesar-salad.png',
    'greek': 'menu_items/greek-salad.jpg',
    'salad': 'menu_items/greek-salad.jpg',
    'salat': 'menu_items/greek-salad.jpg',
    'smak': 'menu_items/caesar-salad.png',

    # === STEAKS & MEAT ===
    'steak': 'menu_items/beef-steak.jpg',
    'steyk': 'menu_items/beef-steak.jpg',
    'bon file': 'menu_items/beef-steak.jpg',
    'rib eye': 'menu_items/beef-steak.jpg',
    'ribeye': 'menu_items/beef-steak.jpg',
    'new york': 'menu_items/beef-steak.jpg',
    't-bone': 'menu_items/beef-steak.jpg',
    'bbq': 'menu_items/beef-steak.jpg',
    'bbk': 'menu_items/beef-steak.jpg',

    # === BBQ/SHASHLIK ===
    'kebab': 'menu_items/grilled-chicken.png',
    'shashlik': 'menu_items/grilled-chicken.png',
    'kuskovoy': 'menu_items/grilled-chicken.png',
    'chicken wings': 'menu_items/grilled-chicken.png',
    'lula': 'menu_items/grilled-chicken.png',
    'adana': 'menu_items/grilled-chicken.png',
    'bog\'ir': 'menu_items/grilled-chicken.png',
    'jigar': 'menu_items/grilled-chicken.png',

    # === PASTA ===
    'pasta': 'menu_items/chicken-alfredo.jpg',
    'alfredo': 'menu_items/chicken-alfredo.jpg',
    'carbonara': 'menu_items/chicken-alfredo.jpg',
    'bolognese': 'menu_items/chicken-alfredo.jpg',
    'salmon pasta': 'menu_items/salmon-fillet.jpg',

    # === SUSHI/JAPAN ===
    'sushi': 'menu_items/spring-rolls.jpg',
    'roll': 'menu_items/spring-rolls.jpg',
    'ramen': 'menu_items/tom-yum-soup.jpg',
    'california': 'menu_items/spring-rolls.jpg',
    'dragon': 'menu_items/spring-rolls.jpg',
    'philadelphia': 'menu_items/spring-rolls.jpg',
    'filadelfia': 'menu_items/spring-rolls.jpg',
    'gunkan': 'menu_items/spring-rolls.jpg',
    'maki': 'menu_items/spring-rolls.jpg',
    'nigiri': 'menu_items/spring-rolls.jpg',
    'set': 'menu_items/spring-rolls.jpg',

    # === SOUPS ===
    'soup': 'menu_items/creamy-mushroom-soup.png',
    'sho\'rva': 'menu_items/creamy-mushroom-soup.png',
    'shorva': 'menu_items/creamy-mushroom-soup.png',
    'tom yum': 'menu_items/tom-yum-soup.jpg',

    # === DESSERTS ===
    'cheesecake': 'menu_items/cheesecake.jpg',
    'tiramisu': 'menu_items/tiramisu.jpg',
    'waffle': 'menu_items/cheesecake.jpg',
    'vafl': 'menu_items/cheesecake.jpg',
    'mochi': 'menu_items/panna-cotta.jpg',
    'ice cream': 'menu_items/panna-cotta.jpg',
    'muzqaymoq': 'menu_items/panna-cotta.jpg',
    'chocolate': 'menu_items/decadent-chocolate-cake.png',
    'cake': 'menu_items/decadent-chocolate-cake.png',
    'panna cotta': 'menu_items/panna-cotta.jpg',
    'dessert': 'menu_items/cheesecake.jpg',

    # === APPETIZERS ===
    'bruschetta': 'menu_items/bruschetta.jpg',
    'tempura': 'menu_items/spring-rolls.jpg',
    'edamame': 'menu_items/spring-rolls.jpg',
    'gyoza': 'menu_items/spring-rolls.jpg',
    'spring roll': 'menu_items/spring-rolls.jpg',

    # === DRINKS ===
    'coffee': 'menu_items/iced-coffee.jpg',
    'kofe': 'menu_items/iced-coffee.jpg',
    'americano': 'menu_items/iced-coffee.jpg',
    'cappuccino': 'menu_items/iced-coffee.jpg',
    'latte': 'menu_items/iced-coffee.jpg',
    'espresso': 'menu_items/iced-coffee.jpg',
    'tea': 'menu_items/iced-coffee.jpg',
    'choy': 'menu_items/iced-coffee.jpg',
    'lemonade': 'menu_items/fresh-lemonade.jpg',
    'limonad': 'menu_items/fresh-lemonade.jpg',
    'fresh': 'menu_items/fresh-lemonade.jpg',
    'juice': 'menu_items/glass-of-orange-juice.png',
    'sok': 'menu_items/glass-of-orange-juice.png',
    'mango': 'menu_items/mango-smoothie.jpg',
    'smoothie': 'menu_items/mango-smoothie.jpg',
    'mojito': 'menu_items/fresh-lemonade.jpg',
    'cola': 'menu_items/glass-of-orange-juice.png',
    'fanta': 'menu_items/glass-of-orange-juice.png',
    'sprite': 'menu_items/glass-of-orange-juice.png',
    'ayran': 'menu_items/fresh-lemonade.jpg',
    'ayron': 'menu_items/fresh-lemonade.jpg',
    'milkshake': 'menu_items/mango-smoothie.jpg',

    # === FAST FOOD ===
    'burger': 'menu_items/grilled-chicken.png',
    'haggi': 'menu_items/grilled-chicken.png',
    'lavash': 'menu_items/grilled-chicken.png',
    'doner': 'menu_items/grilled-chicken.png',
    'hot dog': 'menu_items/grilled-chicken.png',
    'xot dog': 'menu_items/grilled-chicken.png',
    'tandir': 'menu_items/grilled-chicken.png',
    'somsa': 'menu_items/grilled-chicken.png',

    # === SIDE DISHES & KFC ===
    'basket': 'menu_items/grilled-chicken.png',
    'kfc': 'menu_items/grilled-chicken.png',
    'nugget': 'menu_items/grilled-chicken.png',
    'finger': 'menu_items/grilled-chicken.png',
    'strips': 'menu_items/grilled-chicken.png',
    'french fries': 'menu_items/grilled-chicken.png',
    'free': 'menu_items/grilled-chicken.png',
    'kartoshka': 'menu_items/grilled-chicken.png',
    'sauce': 'menu_items/grilled-chicken.png',
    'sous': 'menu_items/grilled-chicken.png',

    # === BREAD ===
    'bread': 'menu_items/bruschetta.jpg',
    'non': 'menu_items/bruschetta.jpg',
    'patir': 'menu_items/bruschetta.jpg',
}

# ====== CATEGORY -> FALLBACK IMAGE ======
CATEGORY_FALLBACK = {
    'Pizza': 'menu_items/margherita-pizza.png',
    'Fast Food': 'menu_items/grilled-chicken.png',
    'Japan Cuisine': 'menu_items/spring-rolls.jpg',
    'Shashlik (BBQ)': 'menu_items/grilled-chicken.png',
    'Hot Dishes & Pasta': 'menu_items/chicken-alfredo.jpg',
    'Steaks': 'menu_items/beef-steak.jpg',
    'Desserts': 'menu_items/cheesecake.jpg',
    'Drinks': 'menu_items/fresh-lemonade.jpg',
    'Side Dishes & KFC': 'menu_items/grilled-chicken.png',
    'Salatlar Va Non': 'menu_items/greek-salad.jpg',
    'Appetizers': 'menu_items/bruschetta.jpg',
}

# ====== CATEGORY IMAGE MAPPING ======
CATEGORY_IMAGE_MAP = {
    'Pizza': 'categories/category-pizza.jpg',
    'Fast Food': 'categories/category-main.jpg',
    'Japan Cuisine': 'categories/category-soups.jpg',
    'Shashlik (BBQ)': 'categories/category-main.jpg',
    'Hot Dishes & Pasta': 'categories/category-main.jpg',
    'Steaks': 'categories/category-main.jpg',
    'Desserts': 'categories/category-desserts.jpg',
    'Drinks': 'categories/category-beverages.jpg',
    'Side Dishes & KFC': 'categories/category-main.jpg',
    'Salatlar Va Non': 'categories/category-appetizers.jpg',
    'Appetizers': 'categories/category-appetizers.jpg',
}


def find_image_for_item(item):
    """Mahsulot nomiga qarab eng mos rasmni topish"""
    name_lower = item.name.lower()
    name_uz_lower = (item.name_uz or '').lower()
    
    # 1. To'g'ridan-to'g'ri kalit so'zlar bo'yicha qidirish
    # Uzunroq kalit so'zlarni birinchi tekshirish (spetsifik matchlar)
    sorted_keywords = sorted(KEYWORD_IMAGE_MAP.keys(), key=len, reverse=True)
    
    for keyword in sorted_keywords:
        if keyword in name_lower or keyword in name_uz_lower:
            return KEYWORD_IMAGE_MAP[keyword]
    
    # 2. Kategoriya bo'yicha fallback
    cat_name = item.category.name if item.category else ''
    if cat_name in CATEGORY_FALLBACK:
        return CATEGORY_FALLBACK[cat_name]
    
    # 3. Umumiy fallback
    return 'menu_items/margherita-pizza.png'


def main():
    print("=" * 60)
    print("Tokyo rasmlarini PizzaCentr mahsulotlariga biriktirish")
    print("=" * 60)
    
    # Menu items
    items = MenuItem.objects.all()
    assigned = 0
    stats = {}
    
    for item in items:
        image_path = find_image_for_item(item)
        item.image = image_path
        item.save(update_fields=['image'])
        assigned += 1
        
        # Stats
        img_name = os.path.basename(image_path)
        stats[img_name] = stats.get(img_name, 0) + 1
    
    print(f"\n✅ Jami {assigned} ta mahsulotga rasm biriktirildi!\n")
    print("Rasm taqsimoti:")
    for img, count in sorted(stats.items(), key=lambda x: -x[1]):
        print(f"  {img}: {count} ta")
    
    # Categories
    print(f"\n{'=' * 60}")
    print("Kategoriya rasmlarini biriktirish")
    print("=" * 60)
    
    cats = Category.objects.all()
    cat_assigned = 0
    for cat in cats:
        if cat.name in CATEGORY_IMAGE_MAP:
            cat.image = CATEGORY_IMAGE_MAP[cat.name]
            cat.save(update_fields=['image'])
            cat_assigned += 1
            print(f"  ✅ {cat.name} -> {CATEGORY_IMAGE_MAP[cat.name]}")
    
    print(f"\n✅ {cat_assigned} ta kategoriyaga rasm biriktirildi!")
    print(f"\nBarcha ishlar tugallandi! 🎉")


if __name__ == '__main__':
    main()
