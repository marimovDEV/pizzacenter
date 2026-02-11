import os
import django
import sys
from PIL import Image
import io

# Django muhitini sozlash
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from menu.models import MenuItem, Category

def compress_and_convert_to_webp(image_field):
    """Rasmni siqish va WebP formatiga o'tkazish"""
    if not image_field:
        return None
    
    try:
        image_path = image_field.path
        if not os.path.exists(image_path):
            return None
            
        # Agar allaqachon webp bo'lsa, faqat siqishni tekshirish mumkin
        # Lekin biz hamma narsani standartlashtiramiz
        
        img = Image.open(image_path)
        
        # RGBA bo'lsa RGB ga o'tkazish (WebP uchun yaxshi)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
            
        # Hajmini tekshirish va o'zgartirish (max 800px kenglik)
        max_size = 800
        if img.width > max_size:
            ratio = max_size / float(img.width)
            new_height = int(float(img.height) * float(ratio))
            img = img.resize((max_size, new_height), Image.Resampling.LANCZOS)
            
        # Yangi fayl nomi
        base_path = os.path.splitext(image_path)[0]
        webp_path = base_path + ".webp"
        
        # Saqlash
        img.save(webp_path, "WEBP", quality=75, optimize=True)
        
        # Django uchun nisbiy yo'l
        relative_path = os.path.relpath(webp_path, os.path.join(os.path.dirname(os.path.dirname(image_path)), 'media'))
        # Ba'zan relpath xato berishi mumkin, shuning uchun menu_items/ ni qo'shamiz
        if not relative_path.startswith('menu_items/') and 'menu_items' in webp_path:
             relative_path = os.path.join('menu_items', os.path.basename(webp_path))
        if not relative_path.startswith('categories/') and 'categories' in webp_path:
             relative_path = os.path.join('categories', os.path.basename(webp_path))

        return relative_path
        
    except Exception as e:
        print(f"❌ Xatolik ({image_field.name}): {e}")
        return None

def main():
    print("🚀 Rasmlarni optimallashtirish boshlandi...")
    
    # MenuItems
    items = MenuItem.objects.exclude(image='')
    total_items = items.count()
    print(f"📦 {total_items} ta mahsulot rasmi tekshirilmoqda...")
    
    updated_count = 0
    for idx, item in enumerate(items):
        old_ext = os.path.splitext(item.image.name)[1].lower()
        if old_ext == '.webp': # Allaqachon webp bo'lsa o'tkazib yuboramiz (yoki qayta siqamiz)
            # continue
            pass
            
        new_path = compress_and_convert_to_webp(item.image)
        if new_path:
            item.image = new_path
            item.save() # Bu bizning pre_save signalimizni ishga tushiradi va eski faylni o'chiradi
            updated_count += 1
            
        if (idx + 1) % 10 == 0:
            print(f"   {idx + 1}/{total_items} bajarildi...")

    # Categories
    cats = Category.objects.exclude(image='')
    print(f"📂 {cats.count()} ta kategoriya rasmi tekshirilmoqda...")
    for cat in cats:
        new_path = compress_and_convert_to_webp(cat.image)
        if new_path:
            cat.image = new_path
            cat.save()

    print(f"✅ Tayyor! {updated_count} ta rasm optimallashtirildi.")

if __name__ == "__main__":
    main()
