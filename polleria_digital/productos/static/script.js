// Define la URL de la API de tu módulo de productos
const API_URL = 'http://127.0.0.1:8000/api/productos/';
// Nueva URL de la API de Pedidos (¡Usaremos esta para el POST!)
const API_ORDENES_URL = 'http://127.0.0.1:8000/api/ordenes/';

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

// Asigna el manejador de eventos a todos los botones "Añadir al Carrito"
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

// Contador del carrito
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    console.log(`Carrito actualizado: ${totalItems} ítems.`); 
}

// --- LÓGICA AVANZADA: ACTUALIZAR Y ELIMINAR ÍTEMS DEL CARRITO ---

/**
 * Función para actualizar la cantidad (aumentar o disminuir)
 * @param {string} productoId - ID del producto a modificar.
 * @param {number} cambio - Cantidad a sumar (1) o restar (-1).
 */
function actualizarCantidad(productoId, cambio) {
    const carrito = obtenerCarrito();
    // Encontrar el índice del producto en el array del carrito
    const productoIndex = carrito.findIndex(item => item.id === productoId);

    if (productoIndex !== -1) {
        carrito[productoIndex].cantidad += cambio;
        
        // CRÍTICO: Si la cantidad llega a cero o menos, se elimina el producto
        if (carrito[productoIndex].cantidad <= 0) {
            eliminarDelCarrito(productoId);
        } else {
            guardarCarrito(carrito);
            // Si la página del carrito está abierta, la recargamos para mostrar el cambio
            if (window.location.pathname.includes('/carrito')) {
                mostrarDetalleCarrito(); 
            }
        }
    }
}

/**
 * Función para eliminar un producto completamente del carrito.
 * @param {string} productoId - ID del producto a eliminar.
 */
function eliminarDelCarrito(productoId) {
    let carrito = obtenerCarrito();
    // Filtra el carrito para crear una nueva lista sin el producto
    carrito = carrito.filter(item => item.id !== productoId);

    guardarCarrito(carrito);
    
    // Si la página del carrito está abierta, la recargamos
    if (window.location.pathname.includes('/carrito')) {
        mostrarDetalleCarrito();
    }
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
                        <th>Eliminar</th> </tr>
                </thead>
                <tbody>
        `;
        let totalGeneral = 0;

        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            totalGeneral += subtotal;

            tablaHTML += `
                <tr>
                    <td>${item.nombre}</td>
                    <td>$${item.precio.toFixed(2)}</td>
                    
                    <td class="cantidad-control">
                        <button class="btn-control" onclick="actualizarCantidad('${item.id}', -1)">-</button>
                        ${item.cantidad}
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

        // Mostrar la tabla y los totales
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
// (Misma lógica de Pago/Simulación de API)

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

function procesarPago(event) {
    event.preventDefault(); 
    // ... (El resto de la lógica de envío de la orden) ...
    // Nota: El código real de envío de datos fue reemplazado por la simulación
    // para mantener el flujo funcional hasta que se decida qué API usar.
    
    const carrito = obtenerCarrito();
    const totalPagar = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const cliente_nombre = document.getElementById('nombre').value;
    const cliente_direccion = document.getElementById('direccion').value;

    if (carrito.length === 0) {
        alert("El carrito está vacío. Por favor, agregue productos.");
        return;
    }
    
    if (!cliente_nombre || !cliente_direccion) {
        alert("Por favor, complete su Nombre y Dirección de Entrega.");
        return;
    }

    // El código de envío real a la API de Órdenes debe ser habilitado aquí
    // Por ahora, solo simulación para no romper el flujo:
    
    // Finalización exitosa del pedido (simulación)
    alert("¡PEDIDO CONFIRMADO CON ÉXITO!\nGracias por su compra. Su pollo Don Broaster está en camino.");

    localStorage.removeItem('carritoDonBroaster');
    actualizarContadorCarrito();
    window.location.href = "/"; 
}

// Conecta el botón en pago.html al manejador de eventos.
function conectarBotonPago() {
    const formularioPago = document.getElementById('formulario-pago');
    if (formularioPago) {
        formularioPago.addEventListener('submit', procesarPago);
    }
}

// --- LÓGICA DE CARGA DE PRODUCTOS DESDE API ---

// Función para obtener los productos de la API
async function obtenerProductos() {
    try {
        const respuesta = await fetch(API_URL);
        const data = await respuesta.json(); 
        
        // Asume que la lista de productos está en 'results' (estándar de DRF)
        const productos = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);

        if (productos && Array.isArray(productos) && productos.length > 0) {
            mostrarProductos(productos);
        } else {
            productosContainer.innerHTML = '<p>El menú está temporalmente agotado.</p>';
        }

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        productosContainer.innerHTML = '<p>Lo sentimos, no pudimos cargar el menú. Revisa si el servidor de Django está corriendo.</p>';
    }
}

// Función para mostrar los productos en la página y crear los botones
function mostrarProductos(productos) {
    productosContainer.innerHTML = ''; // Limpia el contenedor

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

// --- LLAMADAS DE INICIO (Función de control para ejecución segura) ---

function iniciarAplicacion() {
    const ruta = window.location.pathname;
    
    // 1. Lógica para la página de INICIO (index.html)
    if (ruta === '/' || ruta === '/index.html') {
        obtenerProductos();
    }
    
    // 2. Lógica para la página del CARRITO (carrito.html)
    if (ruta.includes('/carrito')) {
        mostrarDetalleCarrito();
    }
    
    // 3. Lógica para la página de PAGO (pago.html)
    if (ruta.includes('/pago')) {
        mostrarResumenPago();
        conectarBotonPago();
    }
    
    // El contador del carrito se actualiza en todas las páginas
    actualizarContadorCarrito();
}

// Ejecución FINAL: Forzamos la ejecución de la lógica después de que el DOM esté listo.
document.addEventListener('DOMContentLoaded', iniciarAplicacion);