import os
import sys
from django.core.wsgi import get_wsgi_application

# 1. Ruta de la carpeta INTERNA (donde están settings.py y urls.py)
current_dir = os.path.dirname(os.path.abspath(__file__))

# 2. Ruta de la carpeta EXTERNA (donde está la carpeta productos)
parent_dir = os.path.dirname(current_dir)

# 3. Agregamos AMBAS a la lista de búsqueda de Python
# Esto es lo que faltaba: ¡Añadir la interna también!
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# 4. Apuntamos DIRECTO al archivo settings (sin prefijos de carpeta)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')

application = get_wsgi_application()