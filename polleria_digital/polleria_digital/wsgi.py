import os
import sys
from pathlib import Path
from django.core.wsgi import get_wsgi_application

# 1. Obtener la ruta de la carpeta ACTUAL (donde están wsgi.py y settings.py)
current_path = Path(__file__).resolve().parent

# 2. Obtener la ruta de la carpeta PADRE (donde están 'productos' y 'frontend')
parent_path = current_path.parent

# 3. Agregar la carpeta ACTUAL al inicio de la lista de búsqueda
# Esto permite importar 'settings' directamente sin prefijos
sys.path.insert(0, str(current_path))

# 4. Agregar la carpeta PADRE también (para que encuentre 'productos')
sys.path.insert(1, str(parent_path))

# 5. Apuntar DIRECTAMENTE al módulo 'settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')

application = get_wsgi_application()