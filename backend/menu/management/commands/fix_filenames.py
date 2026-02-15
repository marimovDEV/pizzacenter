import os
import re
from django.core.management.base import BaseCommand
from django.conf import settings
from menu.models import MenuItem, Category, Promotion, SiteSettings, RestaurantInfo
from menu.utils import transliterate

class Command(BaseCommand):
    help = 'Fixes Cyrillic filenames by transliterating them and updating DB records'

    def handle(self, *args, **options):
        self.fix_model_images(MenuItem, 'image')
        self.fix_model_images(Category, 'image')
        self.fix_model_images(Promotion, 'image')
        self.fix_model_images(SiteSettings, 'logo')
        self.fix_model_images(SiteSettings, 'favicon')
        self.fix_model_images(RestaurantInfo, 'hero_image')
        self.fix_model_images(RestaurantInfo, 'about_image')
        self.stdout.write(self.style.SUCCESS('Successfully fixed filenames'))

    def fix_model_images(self, model, field_name):
        self.stdout.write(f"Checking {model.__name__}.{field_name}...")
        queryset = model.objects.exclude(**{f"{field_name}": ""}).exclude(**{f"{field_name}__isnull": True})
        
        count = 0
        for instance in queryset:
            field = getattr(instance, field_name)
            if not field or not field.name:
                continue
                
            old_path = field.path
            old_name = field.name
            
            # Check if filename contains non-ASCII characters
            if any(ord(char) > 127 for char in old_name):
                # Split path and filename
                dir_name = os.path.dirname(old_name)
                base_name = os.path.basename(old_name)
                name, ext = os.path.splitext(base_name)
                
                # Transliterate and sanitize
                new_name_base = transliterate(name)
                new_name_base = re.sub(r'[^a-zA-Z0-9_-]', '_', new_name_base)
                new_name_base = re.sub(r'_+', '_', new_name_base).strip('_')
                
                new_name = f"{new_name_base}{ext.lower()}"
                new_relative_path = os.path.join(dir_name, new_name)
                new_full_path = os.path.join(settings.MEDIA_ROOT, new_relative_path)
                
                # Ensure directory exists
                os.makedirs(os.path.dirname(new_full_path), exist_ok=True)
                
                if os.path.exists(old_path):
                    if old_path != new_full_path:
                        self.stdout.write(f"  Renaming: {old_name} -> {new_relative_path}")
                        try:
                            os.rename(old_path, new_full_path)
                            # Update DB
                            setattr(instance, field_name, new_relative_path)
                            instance.save()
                            count += 1
                        except Exception as e:
                            self.stdout.write(self.style.ERROR(f"    Error renaming: {e}"))
                else:
                    # File missing on disk, but let's try to update DB if the name is broken
                    self.stdout.write(self.style.WARNING(f"  File missing on disk: {old_path}"))
                    # We might want to fix the DB path anyway if the user intends to upload again or fix manually
                    
        self.stdout.write(self.style.SUCCESS(f"Finished {model.__name__}: {count} files fixed"))
