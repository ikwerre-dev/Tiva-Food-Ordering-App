import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FoodContext = createContext();

export const useFoodContext = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFoodContext must be used within a FoodProvider');
  }
  return context;
};

export const FoodProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load cart data from AsyncStorage on component mount
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    // Save cart data to AsyncStorage whenever it changes
    saveCartToStorage();
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      // Check if the item with the same id already exists
      const existingItem = prevCart.find((cartItem) => cartItem.item_id === item.item_id);

      if (existingItem) {
        // If it exists, update the quantity and merge the selectedAddOns
        return prevCart.map((cartItem) =>
          cartItem.item_id === item.item_id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
                selectedAddOns: [
                  ...cartItem.selectedAddOns,
                  ...item.selectedAddOns,
                ],
              }
            : cartItem
        );
      } else {
        // If it doesn't exist, add the new item
        return [...prevCart, item];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.item_id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateItemInCart = (itemId, updates) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.item_id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to AsyncStorage:', error);
    }
  };

  const loadCartFromStorage = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      console.log("SavedContext: ", JSON.parse(savedCart))
      if (savedCart !== null) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from AsyncStorage:', error);
    }
  };

  return (
    <FoodContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateItemInCart }}
    >
      {children}
    </FoodContext.Provider>
  );
};