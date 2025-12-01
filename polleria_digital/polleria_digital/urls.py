from django.urls import path, include
from rest_framework.routers import DefaultRouter
from productos.views import ProductoViewSet, OrdenViewSet
from django.contrib import admin
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
import os

# Importamos las vistas necesarias para manejar los tokens
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'ordenes', OrdenViewSet)

urlpatterns = [
    # Rutas principales de Django
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # --- RUTAS DEL MÓDULO DE AUTENTICACIÓN (DJOSER & JWT) ---
    # Rutas de Djoser para registro, reset de contraseña, etc.
    path('api/auth/', include('djoser.urls')), 
    
    # Rutas para obtener y refrescar Tokens JWT (el estándar de seguridad)
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # ----------------------------------------------------------

    # Rutas del Frontend (las que sirven las páginas HTML)
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('carrito/', TemplateView.as_view(template_name='carrito.html'), name='carrito'),
    path('pago/', TemplateView.as_view(template_name='pago.html'), name='pago'),
]

# SOLUCIÓN FINAL PARA SERVIR ARCHIVOS ESTÁTICOS
if settings.DEBUG:
    # Usamos os.path.join para construir una ruta absoluta
    urlpatterns += static(settings.STATIC_URL, document_root=os.path.join(settings.BASE_DIR, 'frontend'))