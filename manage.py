#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

# --- CORRECCIÓN DE RUTA PARA DOBLE CARPETA ---
if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Agregamos la carpeta interna profunda al path (polleria_digital/polleria_digital)
    # Esto permite encontrar 'urls.py' y 'settings.py' directamente.
    inner_dir = os.path.join(current_dir, 'polleria_digital', 'polleria_digital')
    if inner_dir not in sys.path:
        sys.path.insert(0, inner_dir)

    # 2. Agregamos la carpeta contenedora (para encontrar 'productos' y 'frontend')
    container_dir = os.path.join(current_dir, 'polleria_digital')
    if container_dir not in sys.path:
        sys.path.insert(0, container_dir)
# ---------------------------------------------

def main():
    """Run administrative tasks."""
    # Apuntamos directo a 'settings' (porque ya agregamos su carpeta al path)
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()