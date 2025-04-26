const productos = [
  {
    id: 1,
    nombre: "Balón de Baloncesto",
    precio: 30.00,
    categoria: "balones",
    imagen: "https://exitocol.vteximg.com.br/arquivos/ids/2167404/Balon-Baloncesto-Super-1321354_a.jpg"
  },
  {
    id: 2,
    nombre: "Balón de Fútbol",
    precio: 28.00,
    categoria: "balones",
    imagen: "https://deportivoscarvajal.com/cdn/shop/files/zapato2_a7e04d9b-147f-4c61-b47a-0729380ec91f_1080x1080.jpg?v=1734543198"
  },
  {
    id: 3,
    nombre: "Raqueta de Tenis",
    categoria: "proteccion",
    precio: 75.00,
    imagen: "https://i5.walmartimages.com/seo/Wilson-Burn-25-Ages-9-10-Junior-Tennis-Racket-Pink_6f2317be-6133-4a23-8125-2ce46285260c.851da120f1cb97923c875bfb49af7f90.png"
  },
  {
    id: 4,
    nombre: "Mancuernas",
    precio: 55.00,
    categoria: "fuerza",
    imagen: "https://rvtsports.mx/cdn/shop/products/53.png?v=1679772235"
  },
  {
    id: 5,
    nombre: "Guantes de Boxeo",
    precio: 65.00,
    categoria: "proteccion",
    imagen: "https://fsssportwear.com/wp-content/uploads/2024/06/GUANTE-BOXEO-EVERLAST.jpg"
  },
  {
    id: 6,
    nombre: "Rodilleras Deportivas",
    precio: 20.00,
    categoria: "proteccion",
    imagen: "https://cirugiarex.com.ar/wp-content/uploads/2020/05/RAS.jpg"
  }
];

const carrito = [];

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const cantidadProductos = document.getElementById("cantidad");

function mostrarProductos(productosFiltrados = productos) {
  contenedorProductos.innerHTML = "";
  productosFiltrados.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio.toFixed(2)}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const itemExistente = carrito.find(p => p.id === id);

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`;
    listaCarrito.appendChild(li);
    total += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;
  });

  totalCarrito.textContent = total.toFixed(2);
  cantidadProductos.textContent = cantidadTotal;

  // Mostrar botón de PayPal solo si hay productos
  const paypalBtn = document.getElementById("paypal-button-container");
  if (paypalBtn) {
    paypalBtn.style.display = carrito.length > 0 ? "block" : "none";
  }
}

function vaciarCarrito() {
  if (carrito.length === 0) {
    alert("El carrito ya está vacío.");
    return;
  }

  const confirmar = confirm("¿Deseas vaciar todo el carrito?");
  if (confirmar) {
    carrito.length = 0;
    actualizarCarrito();
    alert("🧹 Carrito vaciado.");
  }
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  alert("✅ ¡Gracias por tu compra deportiva! 🏆");
  carrito.length = 0;
  actualizarCarrito();
}

function filtrarPorCategoria() {
  const categoriaSeleccionada = document.getElementById("filtro-categoria").value;
  if (categoriaSeleccionada === "todas") {
    mostrarProductos();
  } else {
    const filtrados = productos.filter(p => p.categoria === categoriaSeleccionada);
    mostrarProductos(filtrados);
  }
}

mostrarProductos();

// PayPal botón de pago
paypal.Buttons({
  createOrder: function(data, actions) {
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: total.toFixed(2)
        }
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert(`✅ ¡Gracias ${details.payer.name.given_name} por tu compra!`);
      carrito.length = 0;
      actualizarCarrito();
    });
  },
  onError: function(err) {
    console.error(err);
    alert("❌ Hubo un error al procesar el pago.");
  }
}).render('#paypal-button-container');

