import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Calculate cartCount dynamically
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch complete cart details
  const fetchCartDetails = useCallback(async () => {
    setCartLoading(true);
    try {
      const response = await fetch("/api/cart", { credentials: "include" });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setCartItems(result.data.items || []);
        }
      }
    } catch (err) {
      console.error("Error fetching cart details:", err);
    } finally {
      setCartLoading(false);
    }
  }, []);

  // Add item to cart
  const addToCart = useCallback(async (bookId, quantity = 1) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, quantity }),
        credentials: "include"
      });
      const result = await response.json();
      if (result.success) {
        await fetchCartDetails();
        setIsCartDrawerOpen(true); // Open the drawer immediately on success
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      return { success: false, message: "Server connection error" };
    }
  }, [fetchCartDetails]);

  // Update item quantity
  const updateCartItemQuantity = useCallback(async (bookId, quantity) => {
    if (quantity < 1) return { success: false, message: "Quantity must be at least 1" };
    try {
      const response = await fetch("/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, quantity }),
        credentials: "include"
      });
      const result = await response.json();
      if (result.success) {
        await fetchCartDetails();
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      return { success: false, message: "Server connection error" };
    }
  }, [fetchCartDetails]);

  // Remove item from cart
  const removeCartItem = useCallback(async (bookId) => {
    try {
      const response = await fetch(`/api/cart/remove/${bookId}`, {
        method: "DELETE",
        credentials: "include"
      });
      const result = await response.json();
      if (result.success) {
        await fetchCartDetails();
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error("Error removing item:", err);
      return { success: false, message: "Server connection error" };
    }
  }, [fetchCartDetails]);

  const openCartDrawer = useCallback(() => setIsCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setIsCartDrawerOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartLoading,
        isCartDrawerOpen,
        fetchCartDetails,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        openCartDrawer,
        closeCartDrawer,
        setIsCartDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
