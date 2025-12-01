from django.db import models

# Create your models here.
class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    imagen_url = models.CharField(max_length=200)
    es_promocion = models.BooleanField(default=False)
    es_especialidad = models.BooleanField(default=False)
    tipo_producto = models.CharField(max_length=50, choices=[
        ('entero', 'Pollo Entero'),
        ('presas', 'Pollo por Presas'),
        ('combo', 'Combo de Pollo'),
        ('otro', 'Otro')
    ])

    def __str__(self):
        return self.nombre

# Tabla 1: La Orden (Cabecera del Pedido)
class Orden(models.Model):
    ESTADOS = [
        ('PENDIENTE', 'Pendiente de Preparación'),
        ('PREPARANDO', 'En Preparación'),
        ('ENVIADO', 'En Camino'),
        ('ENTREGADO', 'Entregado'),
    ]
    
    cliente_nombre = models.CharField(max_length=100)
    cliente_direccion = models.CharField(max_length=255)
    
    # CORRECCIÓN CRÍTICA: Permitimos NULL y BLANK para resolver el IntegrityError
    total_orden = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='PENDIENTE')
    metodo_pago = models.CharField(max_length=50)

    def __str__(self):
        return f"Orden #{self.id} - {self.cliente_nombre}"

# Tabla 2: El Detalle de la Orden (Los Productos del Pedido)
class DetalleOrden(models.Model):
    # La clave foránea que relaciona el detalle con la orden principal (relacion 1 a muchos)
    orden = models.ForeignKey(Orden, related_name='detalles', on_delete=models.CASCADE)
    
    # La clave foránea que relaciona el detalle con el producto (usamos RESTRICT para no borrar el producto)
    producto = models.ForeignKey(Producto, on_delete=models.RESTRICT)
    
    nombre_producto = models.CharField(max_length=100)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.cantidad} x {self.nombre_producto} (Orden {self.orden.id})"