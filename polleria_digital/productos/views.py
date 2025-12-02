from rest_framework import viewsets, status
from rest_framework.response import Response
# Importación crítica para permitir acceso sin login
from rest_framework.permissions import AllowAny 
from .models import Producto, Orden
from .serializers import ProductoSerializer, OrdenSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    # --- CORRECCIÓN CRÍTICA ---
    # Permitimos que CUALQUIERA vea el menú.
    permission_classes = [AllowAny]
    # ---------------------------

class OrdenViewSet(viewsets.ModelViewSet):
    queryset = Orden.objects.all().order_by('-fecha_pedido')
    serializer_class = OrdenSerializer
    
    # --- AJUSTE TEMPORAL ---
    # Permitimos crear órdenes sin login para que el checkout funcione 
    # mientras construimos el módulo de Autenticación en el frontend.
    permission_classes = [AllowAny]
    # -----------------------

    def create(self, request, *args, **kwargs):
        # Tu lógica avanzada de cálculo y guardado
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)