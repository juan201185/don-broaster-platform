# productos/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny # <-- IMPORTACIÓN CRÍTICA
from .models import Producto, Orden
from .serializers import ProductoSerializer, OrdenSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    # --- CORRECCIÓN CRÍTICA ---
    # Permitimos que CUALQUIERA (AllowAny) acceda a esta API.
    permission_classes = [AllowAny] 
    # ---------------------------

class OrdenViewSet(viewsets.ModelViewSet):
    # NOTA IMPORTANTE: Esta API (Ordenes) ahora SÍ requiere que el usuario esté autenticado 
    # por la configuración general en settings.py. Esto es correcto, ya que nadie debería 
    # poder crear un pedido sin una cuenta. 
    queryset = Orden.objects.all().order_by('-fecha_pedido')
    serializer_class = OrdenSerializer

    def create(self, request, *args, **kwargs):
        # Tu lógica avanzada de cálculo y guardado iría aquí
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)