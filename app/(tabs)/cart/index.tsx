import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CartItemType {
  productId: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  quantity: number;
}

const CartScreen: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await SecureStore.getItemAsync("jwtToken");
      if (!storedToken) {
        router.replace("/(auth)/login");
        return;
      }
      setToken(storedToken);
    };
    getToken();
  }, []);

  const fetchCart = async () => {
    if (!token) return setCartItems([]);
    try {
      setLoading(true);
      const res = await axios.get(
        "https://magictreebackend.onrender.com/cart/items",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) =>
        acc + ((item.price || 0) - (item.discount || 0)) * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const updateQuantity = async (productId: string, newQty: number) => {
    if (!token || newQty < 1) return;
    try {
      await axios.put(
        "https://magictreebackend.onrender.com/cart/update",
        { productId, quantity: newQty },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const removeItem = async (productId: string) => {
    if (!token) return;
    try {
      await axios.delete(`https://magictreebackend.onrender.com/cart/remove`, {
        data: { productId },
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleCheckout = () => {
    router.push("/Checkout"); // Use global state or backend for cart transfer
  };

  return (
    <View style={styles.cartContainer}>
      {loading ? (
        <Text>Loading cart...</Text>
      ) : cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Image
            source={require("@/assets/images/AppLogo.jpg")}
            style={styles.emptyCartImage}
          />
          <Text>No items in cart</Text>
        </View>
      ) : (
        <ScrollView>
          {cartItems.map((item) => (
            <View key={item.productId} style={styles.cartItemContainer}>
              <Image
                source={
                  item.image
                    ? { uri: item.image }
                    : require("@/assets/images/AppLogo.jpg") // fallback image
                }
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text>{item.name}</Text>
                <Text>
                  ₹{((item.price || 0) - (item.discount || 0)).toFixed(2)}
                </Text>
                <View style={styles.quantityWrapper}>
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeItem(item.productId)}>
                    <MaterialIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          <View style={styles.totalSection}>
            <Text>Total:</Text>
            <Text>₹{totalPrice.toFixed(2)}</Text>
          </View>
          <Button title="Proceed to Checkout" onPress={handleCheckout} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    flex: 1,
    padding: 20,
  },
  cartItemContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  itemImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  quantityWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  quantityText: {
    marginHorizontal: 10,
  },
  totalSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  emptyCartContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyCartImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});

export default CartScreen;
