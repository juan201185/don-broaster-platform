# productos/serializers.py
from rest_framework import serializers
from .models import Producto, Orden, DetalleOrden # Asegúrate de importar todos los modelos

# --- INICIO DE LA CORRECCIÓN DE ORDEN ---

# 1. SERIALIZADOR DE DETALLE DE ORDEN (DEBE IR PRIMERO)
class DetalleOrdenSerializer(serializers.ModelSerializer):
    producto = serializers.IntegerField(write_only=True) 

    class Meta:
        model = DetalleOrden
        fields = ['producto', 'nombre_producto', 'cantidad', 'precio_unitario']


# 2. SERIALIZADOR DE PRODUCTO (Sigue en su lugar lógico)
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'


# 3. SERIALIZADOR DE ORDEN (Ahora Python puede ver DetalleOrdenSerializer)
class OrdenSerializer(serializers.ModelSerializer):
    detalles = DetalleOrdenSerializer(many=True) 

    class Meta:
        model = Orden
        fields = ['id', 'cliente_nombre', 'cliente_direccion', 'total_orden', 'metodo_pago', 'detalles']
        read_only_fields = [] 

    # Método para crear la orden y sus detalles CRÍTICOS
    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        orden = Orden.objects.create(**validated_data)

        for detalle_data in detalles_data:
            try:
                producto_id = detalle_data.pop('producto')
                producto_instance = Producto.objects.get(id=producto_id)
            except Producto.DoesNotExist:
                raise serializers.ValidationError(f"El producto con ID {producto_id} no existe.")

            DetalleOrden.objects.create(
                orden=orden,
                producto=producto_instance,
                **detalle_data
            )
            
        return orden