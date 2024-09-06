let carrito = [];
let productos = [];

function mostrarProductos() {
    const contenedor = document.getElementById('lista-productos');
    contenedor.innerHTML = '';
    
    productos.forEach(producto => {
        const div = document.createElement('div');
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        contenedor.appendChild(div);
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    actualizarCarrito();
    guardarCarrito();
}

function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    listaCarrito.innerHTML = '';

    let total = 0;
    carrito.forEach((producto, index) => {
        const li = document.createElement('li');
        li.textContent = `${producto.nombre} - $${producto.precio.toFixed(2)}`;
        listaCarrito.appendChild(li);
        total += producto.precio;
    });

    totalCarrito.textContent = total.toFixed(2);
}

function mostrarCarrito() {
    const carritoModal = document.getElementById('carrito-modal');
    carritoModal.style.display = 'flex';
}

function cerrarModales() {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
}

function confirmarPago() {
    const metodoPago = document.getElementById('medio-pago').value;
    
    Swal.fire({
        title: '¡Pago Confirmado!',
        text: `Método de pago seleccionado: ${metodoPago}`,
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        // Limpiar el carrito después de mostrar la alerta
        carrito = [];
        actualizarCarrito();
        guardarCarrito();
        cerrarModales();
    });
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

function cargarProductos() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
            mostrarProductos();
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarCarrito();

    document.getElementById('carrito').addEventListener('click', mostrarCarrito);
    document.querySelectorAll('.close').forEach(btn => btn.addEventListener('click', cerrarModales));

    document.getElementById('comprar').addEventListener('click', () => {
        document.getElementById('pago-modal').style.display = 'flex';
    });

    document.getElementById('confirmar-pago').addEventListener('click', confirmarPago);
});