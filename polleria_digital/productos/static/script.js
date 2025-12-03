// CORRECCIÓN: Usamos rutas relativas (sin http://dominio.com)
// Esto hace que funcione automáticamente en Local y en la Nube.

const API_URL = '/api/productos/'; 
const API_ORDENES_URL = '/api/ordenes/';

const productosContainer = document.getElementById('productos-container');

// --- LÓGICA DEL MÓDULO DE CARRITO DE COMPRAS (FRONTEND) ---

function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('carritoDonBroaster');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carritoDonBroaster', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function anadirAlCarrito(productoData) {
    const carrito = obtenerCarrito();
    const { id, nombre, precio } = productoData;
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ id: id, nombre: nombre, precio: parseFloat(precio), cantidad: 1 });
    }

    guardarCarrito(carrito);
    alert(`¡${nombre} añadido al carrito!`);
}

// --- LÓGICA AVANZADA: ACTUALIZAR Y ELIMINAR ---

// Función para aumentar o disminuir cantidad
function actualizarCantidad(productoId, cambio) {
    const carrito = obtenerCarrito();
    const productoIndex = carrito.findIndex(item => item.id === productoId);

    if (productoIndex !== -1) {
        carrito[productoIndex].cantidad += cambio;

        // Si la cantidad es 0 o menor, preguntamos o eliminamos directo
        if (carrito[productoIndex].cantidad <= 0) {
            eliminarDelCarrito(productoId);
        } else {
            guardarCarrito(carrito);
            // Refrescamos la vista si estamos en el carrito
            if (window.location.pathname.includes('/carrito')) {
                mostrarDetalleCarrito();
            }
        }
    }
}

// Función para eliminar un producto
function eliminarDelCarrito(productoId) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== productoId);
    guardarCarrito(carrito);
    
    if (window.location.pathname.includes('/carrito')) {
        mostrarDetalleCarrito();
    }
}

// Asigna el manejador de eventos a los botones de añadir
function asignarManejadoresCarrito() {
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    if (botonesAgregar.length > 0) {
        botonesAgregar.forEach(button => {
            button.addEventListener('click', (event) => {
                const productoData = event.target.dataset;
                anadirAlCarrito(productoData);
            });
        });
    }
}

function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    console.log(`Carrito actualizado: ${totalItems} ítems.`);
    // Aquí podrías actualizar un badge en el icono del carrito
}


// --- LÓGICA DE VISTA DE CARRITO (carrito.html) ---

function mostrarDetalleCarrito() {
    const carrito = obtenerCarrito();
    const carritoDetalle = document.getElementById('carrito-detalle');
    const carritoTotales = document.getElementById('carrito-totales');

    if (carritoDetalle && carritoTotales) {
        if (carrito.length === 0) {
            carritoDetalle.innerHTML = '<p class="alerta-vacio">¡Tu carrito está vacío! ¿Qué esperas para pedir tu Don Broaster?</p>';
            carritoTotales.innerHTML = '';
            return;
        }

        let tablaHTML = `
            <table class="tabla-carrito">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acción</th> </tr>
                </thead>
                <tbody>
        `;
        let totalGeneral = 0;

        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            totalGeneral += subtotal;

            // AQUI ESTÁ LA INTEGRACIÓN DE LOS BOTONES EN LA VISTA
            tablaHTML += `
                <tr>
                    <td>${item.nombre}</td>
                    <td>$${item.precio.toFixed(2)}</td>
                    <td class="cantidad-control">
                        <button class="btn-control" onclick="actualizarCantidad('${item.id}', -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn-control" onclick="actualizarCantidad('${item.id}', 1)">+</button>
                    </td>
                    <td>$${subtotal.toFixed(2)}</td>
                    <td>
                        <button class="btn-eliminar" onclick="eliminarDelCarrito('${item.id}')">X</button>
                    </td>
                </tr>
            `;
        });

        tablaHTML += `
                </tbody>
            </table>
        `;

        carritoDetalle.innerHTML = tablaHTML;
        carritoTotales.innerHTML = `
            <div class="resumen-total">
                <h3>Total a Pagar: $${totalGeneral.toFixed(2)}</h3>
                <a href="/pago/" class="btn-pagar">Proceder al Pago</a>
            </div>
        `;
    }
}


// --- LÓGICA DE PROCESAMIENTO DE PAGO (pago.html) ---

function mostrarResumenPago() {
    const carrito = obtenerCarrito();
    const totalPagar = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const resumenPagoDiv = document.getElementById('resumen-pago');

    if (resumenPagoDiv) {
        resumenPagoDiv.innerHTML = `
            <p class="resumen-total">Total de la Orden: <strong>$${totalPagar.toFixed(2)}</strong></p>
        `;
    }
}

// Función REAL para enviar pedido al Backend
async function procesarPago(event) {
    event.preventDefault();

    const carrito = obtenerCarrito();
    const totalPagar = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    const cliente_nombre = document.getElementById('nombre').value;
    const cliente_direccion = document.getElementById('direccion').value;
    const metodo_pago = document.getElementById('metodo-pago').value;

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    
    if (!cliente_nombre || !cliente_direccion) {
        alert("Por favor, complete sus datos de envío.");
        return;
    }

    // 1. Preparar datos para la API
    const detalles = carrito.map(item => ({
        producto: item.id,
        nombre_producto: item.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
    }));

    const ordenData = {
        cliente_nombre: cliente_nombre,
        cliente_direccion: cliente_direccion,
        total_orden: totalPagar.toFixed(2),
        metodo_pago: metodo_pago,
        detalles: detalles,
    };

    // 2. Obtener token CSRF (seguridad)
    const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
    const csrfToken = csrfInput ? csrfInput.value : '';

    // 3. Enviar a la API
    try {
        const respuesta = await fetch(API_ORDENES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(ordenData),
        });

        if (respuesta.ok) {
            alert("¡PEDIDO CONFIRMADO Y GUARDADO EN DB!\nGracias por su compra.");
            localStorage.removeItem('carritoDonBroaster');
            actualizarContadorCarrito();
            window.location.href = "/"; 
        } else {
            const errorData = await respuesta.json();
            console.error("Error del servidor:", errorData);
            alert(`Error al procesar el pedido. Intente nuevamente.`);
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("Error de conexión.");
    }
}

function conectarBotonPago() {
    const formularioPago = document.getElementById('formulario-pago');
    if (formularioPago) {
        formularioPago.addEventListener('submit', procesarPago);
    }
}

// --- LÓGICA DE CARGA DE PRODUCTOS DESDE API ---

async function obtenerProductos() {
    try {
        const respuesta = await fetch(API_URL);
        const data = await respuesta.json();
        
        const productos = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);

        if (productos && productos.length > 0) {
            mostrarProductos(productos);
        } else {
            if (productosContainer) productosContainer.innerHTML = '<p>El menú está temporalmente agotado.</p>';
        }

    } catch (error) {
        console.error('Error API:', error);
        if (productosContainer) productosContainer.innerHTML = '<p>No se pudo cargar el menú.</p>';
    }
}

function mostrarProductos(productos) {
    if (!productosContainer) return;
    productosContainer.innerHTML = '';

    productos.forEach(producto => {
        const productoHTML = `
            <div class="producto">
                <h2>${producto.nombre}</h2>
                <img src="${producto.imagen_url}" alt="${producto.nombre}">
                <p>${producto.descripcion}</p>
                <p class="precio">$${producto.precio}</p>
                <button class="btn-agregar" 
                        data-id="${producto.id}" 
                        data-nombre="${producto.nombre}" 
                        data-precio="${producto.precio}">
                    Añadir al Carrito
                </button>
            </div>
        `;
        productosContainer.innerHTML += productoHTML;
    });

    asignarManejadoresCarrito();
}

// --- FUNCIÓN DE INICIO UNIFICADA ---

function iniciarAplicacion() {
    const ruta = window.location.pathname;
    
    // Lógica para Home
    if (ruta === '/' || ruta === '/index.html' || ruta.endsWith('/')) {
        obtenerProductos();
    }
    
    // Lógica para Carrito
    if (ruta.includes('/carrito')) {
        mostrarDetalleCarrito();
    }
    
    // Lógica para Pago
    if (ruta.includes('/pago')) {
        mostrarResumenPago();
        conectarBotonPago();
    }
    
    actualizarContadorCarrito();
}

// Ejecución segura al cargar el DOM
document.addEventListener('DOMContentLoaded', iniciarAplicacion);