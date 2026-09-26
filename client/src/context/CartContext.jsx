import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('veyra_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('veyra_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

  /**
   * Add product to cart with strict stock limit checking
   */
  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      showNotification(`"${product?.name || 'Item'}" is currently out of stock.`, 'danger');
      return false;
    }

    let success = true;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product === product._id);

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > product.stock) {
          showNotification(
            `Maximum available stock for "${product.name}" is ${product.stock}. Cart updated to maximum.`,
            'warning'
          );
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: product.stock,
          };
          return updated;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        showNotification(`Updated quantity of "${product.name}" in cart.`, 'success');
        return updated;
      } else {
        const initialQty = Math.min(quantity, product.stock);
        showNotification(`Added "${product.name}" to cart.`, 'success');
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock,
            quantity: initialQty,
          },
        ];
      }
    });

    return success;
  };

  /**
   * Update quantity of an item directly
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product === productId) {
          if (newQuantity > item.stock) {
            showNotification(`Cannot exceed available stock of ${item.stock} units.`, 'warning');
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((i) => i.product === productId);
      if (itemToRemove) {
        showNotification(`Removed "${itemToRemove.name}" from cart.`, 'info');
      }
      return prevItems.filter((item) => item.product !== productId);
    });
  };

  /**
   * Clear all items from cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculated values
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = Math.round(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100
  ) / 100;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        subtotal,
        notification,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        showNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
