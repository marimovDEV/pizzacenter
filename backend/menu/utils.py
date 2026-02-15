import os
import uuid
import re

def transliterate(text):
    """
    Simple transliteration for Cyrillic names to ASCII.
    """
    mapping = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'A': 'a', 'B': 'b', 'V': 'v', 'G': 'g', 'D': 'd', 'E': 'e', 'Yo': 'yo',
        'Zh': 'zh', 'Z': 'z', 'I': 'i', 'J': 'j', 'K': 'k', 'L': 'l', 'M': 'm',
        'N': 'n', 'O': 'o', 'P': 'p', 'R': 'r', 'S': 's', 'T': 't', 'U': 'u',
        'F': 'f', 'Kh': 'kh', 'Ts': 'ts', 'Ch': 'ch', 'Sh': 'sh', 'Shch': 'shch',
        'Y': 'y', 'Yu': 'yu', 'Ya': 'ya'
    }
    
    result = []
    for char in text:
        result.append(mapping.get(char, char))
    
    return "".join(result)

def get_upload_path(instance, filename, sub_dir=''):
    """
    Standardizes the upload path and filename.
    Translates Cyrillic to ASCII and replaces spaces with underscores.
    """
    name, ext = os.path.splitext(filename)
    
    # Transliterate and sanitize
    name = transliterate(name)
    name = re.sub(r'[^a-zA-Z0-9_-]', '_', name)
    name = re.sub(r'_+', '_', name).strip('_')
    
    # Add a short unique suffix to avoid collisions
    unique_id = uuid.uuid4().hex[:6]
    
    new_filename = f"{name}_{unique_id}{ext.lower()}"
    
    if sub_dir:
        return os.path.join(sub_dir, new_filename)
    return new_filename

def menu_item_upload_path(instance, filename):
    return get_upload_path(instance, filename, 'menu_items')

def category_upload_path(instance, filename):
    return get_upload_path(instance, filename, 'categories')

def promotion_upload_path(instance, filename):
    return get_upload_path(instance, filename, 'promotions')

def site_settings_upload_path(instance, filename):
    return get_upload_path(instance, filename, 'site')

def restaurant_info_upload_path(instance, filename):
    return get_upload_path(instance, filename, 'restaurant')
