import React, { useState } from 'react';

function Producto({ product, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(prevQuantity => prevQuantity + 1);

  const decreaseQuantity = () => setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));


  const handleAddToCart = () => {
    addToCart(product, quantity); 
    setQuantity(1); 
  };

  return (
    <div className="product">
      <img src={product.foto} alt={product.nombre} />
      <h2>{product.nombre}</h2>
      <p>{product.marca}</p>
      <p>{product.precio}</p>
      <div className="quantity-control">
        <button onClick={decreaseQuantity}>-</button>
        <span>{quantity}</span>
        <button onClick={increaseQuantity}>+</button>
      </div>
      <button onClick={handleAddToCart}>Agregar al Carrito</button>
    </div>
  );
}

export default Producto;
