import os
import sys
import django

# --- CORRECCIÓN DE RUTA (Igual que en manage.py) ---
# Agregamos la carpeta 'polleria_digital' al camino para que encuentre settings
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, 'polleria_digital'))
# ---------------------------------------------------

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'polleria_digital.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Cambia 'adminrender' y la contraseña por lo que tú quieras usar en la nube
username = 'adminrender'
email = 'admin@example.com'
password = 'contraseñasegura123'

if not User.objects.filter(username=username).exists():
    print(f"Creando superusuario: {username}")
    User.objects.create_superuser(username, email, password)
    print("¡Superusuario creado con éxito!")
else:
    print("El superusuario ya existe. Omitiendo creación.")