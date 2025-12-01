#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

# --- INICIO DE LA CORRECCIÓN CRÍTICA DE RUTA ---
# Esto asegura que Python pueda encontrar la subcarpeta 'polleria_digital'
# que contiene el settings.py.
def main():
    """Run administrative tasks."""
    
    # Agregamos la carpeta de configuración a la ruta de búsqueda de Python
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, os.path.join(current_dir, 'polleria_digital'))
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'polleria_digital.settings')
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