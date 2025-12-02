import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'polleria_digital.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username='adminrender').exists():
    User.objects.create_superuser('adminrender', 'admin@example.com', 'contraseñasegura123')
    print("Superusuario creado con éxito")
else:
    print("El superusuario ya existe")