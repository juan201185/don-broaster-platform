from django.contrib import admin
# 1. Importar todos los modelos necesarios
from .models import Producto, Orden, DetalleOrden 

# Registramos el modelo Producto (ya lo tenías)
admin.site.register(Producto) 

# 2. Registramos el modelo DetalleOrden (los ítems individuales del pedido)
admin.site.register(DetalleOrden)

# 3. Registramos la Orden principal con una vista personalizada para más detalle
@admin.register(Orden)
class OrdenAdmin(admin.ModelAdmin):
    # Campos que se mostrarán en la lista principal de órdenes
    list_display = ('id', 'cliente_nombre', 'total_orden', 'estado', 'fecha_pedido', 'metodo_pago')
    
    # Filtros laterales para búsqueda rápida
    list_filter = ('estado', 'metodo_pago', 'fecha_pedido')
    
    # Campos por los que se puede buscar texto
    search_fields = ('cliente_nombre', 'cliente_direccion')