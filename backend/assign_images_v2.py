import os
import sys
import django
import urllib.parse
import re

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from menu.models import MenuItem, Category

def clean_text(text):
    if not text: return ""
    text = text.lower().strip()
    text = text.replace('_', ' ').replace('-', ' ').replace('.', ' ')
    text = re.sub(r'[^\w\s]', '', text)
    return ' '.join(text.split())

def main():
    print("🚀 Starting improved Tokyo image assignment v3 (Final Pass)...")
    
    media_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'media')
    menu_items_dir = os.path.join(media_root, 'menu_items')
    
    if not os.path.exists(menu_items_dir):
        print(f"❌ Directory not found: {menu_items_dir}")
        return

    # Map cleaned filenames to their real filenames
    image_files = {} 
    all_files = os.listdir(menu_items_dir)
    
    # Generic buckets for pass 3
    buckets = {
        'pizza': [],
        'burger': [],
        'shashlik': [],
        'kebab': [],
        'sushi': [],
        'roll': [],
        'steak': [],
        'steyk': [],
        'pasta': [],
        'soup': [],
        'shorva': [],
        'dessert': [],
        'shirinlik': [],
        'drink': [],
        'ichimlik': [],
        'salad': [],
        'salat': [],
        'lavash': [],
        'kfc': [],
        'nuggets': []
    }

    for filename in all_files:
        if filename.startswith('.'): continue
            
        decoded_name = urllib.parse.unquote(filename)
        name_only = os.path.splitext(decoded_name)[0].lower()
        cleaned = clean_text(name_only)
        
        if len(cleaned) > 2:
            image_files[cleaned] = filename
            
        # Add to buckets
        for key in buckets:
            if key in cleaned:
                buckets[key].append(filename)

    print(f"📂 Indexed {len(image_files)} substantive images.")

    items = MenuItem.objects.all()
    assigned_count = 0
    matches = {} 

    # PASS 1: Exact matches
    for item in items:
        names = [item.name, item.name_uz, item.name_ru]
        for name in names:
            cleaned_item_name = clean_text(name)
            if cleaned_item_name and cleaned_item_name in image_files:
                matches[item.id] = image_files[cleaned_item_name]
                break

    # PASS 2: Partial matches (substantive)
    image_keys = sorted(image_files.keys(), key=len, reverse=True)
    for item in items:
        if item.id in matches: continue
        names = [item.name, item.name_uz, item.name_ru]
        for name in names:
            cleaned_item_name = clean_text(name)
            if not cleaned_item_name or len(cleaned_item_name) < 4: continue
            for img_key in image_keys:
                if cleaned_item_name in img_key or img_key in cleaned_item_name:
                    matches[item.id] = image_files[img_key]
                    break
            if item.id in matches: break

    # PASS 3: Keyword Buckets Fallback
    for item in items:
        if item.id in matches: continue
        
        full_text = clean_text(f"{item.name} {item.name_uz} {item.category.name if item.category else ''}")
        for key, files in buckets.items():
            if files and (key in full_text):
                # Pick the first one or a relevant one
                matches[item.id] = files[0]
                break
        
        # Absolute fallback by category
        if item.id not in matches and item.category:
            cat_name = item.category.name.lower()
            if 'pizza' in cat_name and buckets['pizza']: matches[item.id] = buckets['pizza'][0]
            elif 'fast food' in cat_name and buckets['burger']: matches[item.id] = buckets['burger'][0]
            elif 'drinks' in cat_name and buckets['drink']: matches[item.id] = buckets['drink'][0]
            elif 'japan' in cat_name and buckets['sushi']: matches[item.id] = buckets['sushi'][0]
            elif 'shashlik' in cat_name and buckets['shashlik']: matches[item.id] = buckets['shashlik'][0]

    # PASS 4: Global Fallback (Last resort)
    global_fallback = 'margherita-pizza.png'
    if global_fallback not in all_files:
        # Just find any pizza
        if buckets['pizza']: global_fallback = buckets['pizza'][0]
        elif all_files: global_fallback = all_files[0]

    # 3. Apply matches
    for item in items:
        filename = matches.get(item.id, global_fallback)
        item.image = f'menu_items/{filename}'
        item.save()
        assigned_count += 1

    print(f"✅ Successfully processed {assigned_count} items.")
    
    # 4. Categories
    print("\n📁 Checking category images...")
    cats = Category.objects.all()
    for cat in cats:
        cat_file = f"category-{cat.name.lower().replace(' & ', '-').replace(' ', '-')}.jpg"
        potential_path = os.path.join(media_root, 'categories', cat_file)
        if os.path.exists(potential_path):
            cat.image = f'categories/{cat_file}'
            cat.save()
            print(f"  ✅ Category {cat.name} -> {cat.image}")

    print("\n✨ Done v3!")

if __name__ == "__main__":
    main()
