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
# 1. Obtenemos la ruta absoluta donde está este archivo (la carpeta 'polleria_digital' interna)
current_dir = os.path.dirname(os.path.abspath(__file__))

# 2. Obtenemos la carpeta padre (la carpeta del proyecto contenedora)
parent_dir = os.path.dirname(current_dir)

# 3. Agregamos la carpeta padre AL INICIO del sistema de rutas de Python
# Usamos insert(0, ...) en lugar de append para darle prioridad máxima
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
# --------------------------------------

# Apuntamos al módulo de configuración
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'polleria_digital.settings')

application = get_wsgi_application()