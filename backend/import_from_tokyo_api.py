"""
Tokyo API dan barcha ma'lumotlarni PizzaCentr bazasiga import qilish.
Rasmlarni Kirill (rus) nomlari bo'yicha moslashtirish.
"""
import os
import sys
import json
import urllib.parse
import urllib.request
import shutil
import re
import django
import unicodedata

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from menu.models import Category, MenuItem

TOKYO_API = "http://localhost:8001/api"
TOKYO_MEDIA_DIR = "/Users/ogabek/Documents/projects/TOKYO/backend/media"
LOCAL_MEDIA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'media')

def fetch_json(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    if isinstance(data, dict) and 'results' in data:
        return data['results']
    return data

def normalize(text):
    """Normalize text for matching - keeps ALL Unicode chars including Cyrillic"""
    if not text:
        return ""
    text = urllib.parse.unquote(text)
    text = text.lower().strip()
    text = text.replace('_', ' ').replace('-', ' ')
    # Remove file extensions
    for ext in ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.jfif']:
        if text.endswith(ext):
            text = text[:-len(ext)]
    # Remove Django dedup suffixes like "_EuYa1eh"
    text = re.sub(r'\s+[a-zA-Z0-9]{7}$', '', text)
    # Collapse whitespace
    text = ' '.join(text.split())
    return text

def build_image_index(items_dir):
    """Build index: normalized_name -> filename"""
    index = {}
    if not os.path.exists(items_dir):
        return index
    
    valid_exts = {'.jpg', '.jpeg', '.png', '.webp', '.avif', '.jfif'}
    
    for filename in os.listdir(items_dir):
        if filename.startswith('.'):
            continue
        ext = os.path.splitext(filename)[1].lower()
        if ext not in valid_exts:
            continue
        
        norm = normalize(filename)
        if len(norm) > 2:
            # Don't overwrite if we already have a match (prefer originals over Django dupes)
            if norm not in index:
                index[norm] = filename
    
    return index

def find_image(item_data, image_index):
    """Find the best matching image for a menu item"""
    # Names to try matching against
    names = [
        item_data.get('name_ru', ''),      # Russian name matches Cyrillic filenames
        item_data.get('name_uz', ''),      
        item_data.get('name', ''),          # English name
    ]
    
    # Also try without size suffixes and numbers
    for name in list(names):
        if name:
            names.append(re.sub(r'\s*\d+\s*$', '', name))           # Remove trailing numbers
            names.append(re.sub(r'\s*\(.*?\)\s*', '', name))        # Remove (Small) etc
            names.append(re.sub(r'\s*\d+\s*\(.*?\)\s*$', '', name)) # Remove "1 (Small)"
    
    # Pass 1: Exact normalized match
    for name in names:
        norm = normalize(name)
        if norm and norm in image_index:
            return image_index[norm]
    
    # Pass 2: Containment match (longer names first for specificity)
    sorted_keys = sorted(image_index.keys(), key=len, reverse=True)
    for name in names:
        norm = normalize(name)
        if not norm or len(norm) < 4:
            continue
        for img_key in sorted_keys:
            if len(img_key) < 4:
                continue
            if norm in img_key or img_key in norm:
                return image_index[img_key]
    
    # Pass 3: Word overlap (at least 2 shared words)
    for name in names[:3]:  # Only try main names
        norm = normalize(name)
        if not norm:
            continue
        item_words = set(norm.split())
        if len(item_words) < 1:
            continue
        
        best_match = None
        best_score = 0
        for img_key, filename in image_index.items():
            img_words = set(img_key.split())
            overlap = item_words & img_words
            if len(overlap) >= 2 or (len(overlap) >= 1 and len(item_words) == 1):
                score = len(overlap) / max(len(item_words), len(img_words))
                if score > best_score:
                    best_score = score
                    best_match = filename
        
        if best_match and best_score > 0.3:
            return best_match
    
    return None

def main():
    print("=" * 60)
    print("🚀 Tokyo API → PizzaCentr Import (v2 — Full Cyrillic)")
    print("=" * 60)
    
    # 1. Build image index
    items_dir = os.path.join(LOCAL_MEDIA_DIR, 'menu_items')
    image_index = build_image_index(items_dir)
    print(f"📂 {len(image_index)} ta noyob rasm indekslandi")
    
    # 2. Import categories
    print("\n📁 Kategoriyalarni yuklash...")
    tokyo_cats = fetch_json(f"{TOKYO_API}/categories/")
    
    cat_map = {}
    for tc in tokyo_cats:
        cat, created = Category.objects.get_or_create(
            name=tc['name'],
            defaults={
                'name_uz': tc.get('name_uz', tc['name']),
                'name_ru': tc.get('name_ru', tc['name']),
                'icon': tc.get('icon', '🍽️'),
                'is_active': tc.get('is_active', True),
            }
        )
        cat_map[tc['id']] = cat
        s = "✨" if created else "✅"
        print(f"   {s} {cat.name}")
    
    # 3. Import menu items
    print(f"\n🍽️  Taomlarni yuklash...")
    tokyo_items = fetch_json(f"{TOKYO_API}/menu-items/")
    print(f"   Tokyo-da {len(tokyo_items)} ta taom topildi")
    
    created_count = 0
    image_matched = 0
    unmatched = []
    
    for item_data in tokyo_items:
        category = cat_map.get(item_data.get('category'))
        if not category:
            cat_name = item_data.get('category_name', '')
            category = Category.objects.filter(name=cat_name).first()
        if not category:
            continue
        
        # Format ingredients
        def fmt_ing(ing):
            if isinstance(ing, list):
                return ', '.join(ing)
            return ing or ''
        
        # Find matching image
        image_filename = find_image(item_data, image_index)
        image_path = ''
        if image_filename:
            image_path = f'menu_items/{image_filename}'
            image_matched += 1
        else:
            unmatched.append(item_data.get('name', ''))
        
        MenuItem.objects.create(
            name=item_data.get('name', ''),
            name_uz=item_data.get('name_uz', ''),
            name_ru=item_data.get('name_ru', ''),
            description=item_data.get('description', ''),
            description_uz=item_data.get('description_uz', ''),
            description_ru=item_data.get('description_ru', ''),
            price=item_data.get('price', '0'),
            weight=item_data.get('weight') or None,
            category=category,
            available=item_data.get('available', True),
            is_active=item_data.get('is_active', True),
            prep_time=item_data.get('prep_time', ''),
            rating=item_data.get('rating') or 0,
            ingredients=fmt_ing(item_data.get('ingredients')),
            ingredients_uz=fmt_ing(item_data.get('ingredients_uz')),
            ingredients_ru=fmt_ing(item_data.get('ingredients_ru')),
            image=image_path,
        )
        created_count += 1

    print(f"\n✅ {created_count} ta taom yaratildi!")
    print(f"🖼️  {image_matched} ta taomga rasm biriktirildi")
    
    if unmatched:
        print(f"\n⚠️  {len(unmatched)} ta taomga rasm topilmadi:")
        for name in unmatched[:20]:
            print(f"   - {name}")
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 YAKUNIY NATIJA:")
    print(f"   Kategoriyalar: {Category.objects.count()}")
    print(f"   Taomlar: {MenuItem.objects.count()}")
    print(f"   Rasmli: {MenuItem.objects.exclude(image='').count()}")
    print(f"   Rasmsiz: {MenuItem.objects.filter(image='').count()}")
    print("=" * 60)

if __name__ == '__main__':
    main()
