import { createContext, useContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item._id !== productId);
    setCart(newCart);
  };

  const removeAllWithId = (productId) => {
    const newCart = cart.filter((item) => item._id !== productId);
    setCart(newCart);
  };

  const setNewCart = (newCart) => {
    setCart(newCart);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, removeAllWithId, setNewCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const { cart, addToCart, removeFromCart, removeAllWithId, setNewCart } =
    useContext(CartContext);
  return { cart, addToCart, removeFromCart, removeAllWithId, setNewCart };
};
