// Define la URL de la API de tu módulo de productos
const API_URL = 'http://127.0.0.1:8000/api/productos/';

const productosContainer = document.getElementById('productos-container');

// Función para obtener los productos de la API
async function obtenerProductos() {
    try {
        const respuesta = await fetch(API_URL);
        const data = await respuesta.json(); // Leemos el objeto completo de la API
        
        // CORRECCIÓN FINAL: Intentamos obtener la lista de productos
        // Si 'data.results' existe y es un array, usamos eso. Si no, usamos 'data' (por si es un array simple).
        const productosFinal = data && Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);

        // Si la lista de productos finales tiene elementos, los mostramos
        if (productosFinal.length > 0) {
            mostrarProductos(productosFinal);
        } else {
            // Si la lista está vacía, mostramos un mensaje
            productosContainer.innerHTML = '<p>El menú está temporalmente agotado o la API no devolvió productos.</p>';
        }

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        productosContainer.innerHTML = '<p>Lo sentimos, no pudimos cargar el menú. Revisa si el servidor de Django está corriendo.</p>';
    }
}

// Función para mostrar los productos en la página
function mostrarProductos(productos) {
    productosContainer.innerHTML = ''; // Limpia el contenedor
    
    // Ya verificamos que el array no está vacío en obtenerProductos,
    // pero mantenemos la lógica de iteración.
    productos.forEach(producto => {
        const productoHTML = `
            <div class="producto">
                <h2>${producto.nombre}</h2>
                <img src="${producto.imagen_url}" alt="${producto.nombre}">
                <p>${producto.descripcion}</p>
                <p class="precio">$${producto.precio}</p>
            </div>
        `;
        productosContainer.innerHTML += productoHTML;
    });
}

// Llama a la función para cargar los productos al inicio
obtenerProductos();