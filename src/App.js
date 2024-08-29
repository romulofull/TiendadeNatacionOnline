import React, { useState } from "react";
import Producto from "./Producto";
import gallery from "./assets/gallery";
import "./estilos.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const paypalOptions = {
  clientId: CLIENTIDESTAENENV,
  currency: "USD",
};

const tienda = [
  { id: 1, nombre: "Gorro", foto: gallery.imagen1, marca: "Adidas", precio: "$10" },
  { id: 2, nombre: "Gafas", foto: gallery.imagen2, marca: "Adidas", precio: "$45" },
  { id: 3, nombre: "Tabla", foto: gallery.imagen3, marca: "Arena", precio: "$10" },
  { id: 4, nombre: "Pullboy", foto: gallery.imagen4, marca: "Arena", precio: "$5" },
  { id: 5, nombre: "Aletas", foto: gallery.imagen5, marca: "Speedo", precio: "$15" },
];

const parsePrice = (price) => {
  return parseFloat(price.replace(/[^0-9.-]+/g, "")) || 0;
};

function App() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const addToCart = (product, quantity) => {
    const existingProduct = cart.find((p) => p.id === product.id);
    if (existingProduct) {
      setCart(cart.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Compra realizada");
  };

  const total = cart.reduce((acc, item) => acc + parsePrice(item.precio) * item.quantity, 0);
  const formattedTotal = total > 0 ? total.toFixed(2) : '50.00';

  const clearCart = () => {
    setCart([]);
  };

  const handlePayment = async (details, data) => {
    try {
      const response = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cart,
          total: formattedTotal,
          paypalOrderId: data.orderID,
        }),
      });

      if (!response.ok) throw new Error("Error al procesar la compra");

      const result = await response.json();
      alert("Compra realizada con éxito");
      clearCart();
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      alert("Error al procesar la compra");
    }
  };

  return (
    <div>
      <h1>Tienda de Natación</h1>
      <div className="product-list">
        {tienda.map((product) => (
          <Producto key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>

      {cart.length > 0 && (
        <div className="cart-section">
          <h2>Carrito</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.nombre} - {item.quantity} x {item.precio}
              </li>
            ))}
          </ul>
          <p>Total: ${formattedTotal}</p>
          <button onClick={clearCart}>Poner en Cero la Compra</button>
        </div>
      )}

      <div className="checkout-section">
        <h2>Formulario de Pago</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Dirección:
            <input type="text" name="address" value={form.address} onChange={handleChange} required />
          </label>
          <label>
            Teléfono:
            <input type="text" name="phone" value={form.phone} onChange={handleChange} required />
          </label>
          <label>
            Correo Electrónico:
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <h3>Detalles de la Compra</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.nombre} - {item.quantity} x {item.precio}
              </li>
            ))}
          </ul>
          <p>Total a pagar: ${formattedTotal}</p>

          <PayPalScriptProvider options={paypalOptions}>
            <PayPalButtons
              createOrder={async (data, actions) => {
                try {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: formattedTotal
                      },
                    }],
                  });
                } catch (error) {
                  console.error("Error creating order:", error);
                }
              }}
              onApprove={async (data, actions) => {
                try {
                  const details = await actions.order.capture();
                  handlePayment(details, data); 
                } catch (error) {
                  console.error("Error capturing order:", error);      
                }
              }}
              onError={(err) => {
                console.error("PayPal error:", err);
              }}
            />
          </PayPalScriptProvider>
        </form>
      </div>
    </div>
  );
}

export default App;
