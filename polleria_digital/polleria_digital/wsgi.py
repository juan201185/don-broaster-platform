"""
WSGI config for polleria_digital project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
import sys
from django.core.wsgi import get_wsgi_application

# --- CORRECCIÓN DE RUTA PARA RENDER ---

# 1. Obtenemos la ruta absoluta donde está este archivo (la carpeta interna)
current_dir = os.path.dirname(os.path.abspath(__file__))

# 2. Obtenemos la carpeta padre (la carpeta del proyecto contenedora)
# Esto es necesario para que el sistema pueda encontrar la app 'productos'
parent_dir = os.path.dirname(current_dir)

# 3. Agregamos AMBAS rutas al sistema de búsqueda de Python
# Usamos insert(0, ...) para darles prioridad máxima sobre otras rutas
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# --------------------------------------

# Apuntamos DIRECTAMENTE al módulo 'settings' (sin prefijo)
# Esto funciona porque agregamos 'current_dir' al sys.path
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')

application = get_wsgi_application()