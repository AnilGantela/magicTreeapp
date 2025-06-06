import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Get screen height and define footer height
const SCREEN_HEIGHT = Dimensions.get("window").height;
const FOOTER_HEIGHT = 180;

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

  // Re-fetch cart every time screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchCartData = async () => {
        const storedToken = await SecureStore.getItemAsync("magicTreeToken");
        if (!storedToken) {
          router.replace("/(auth)/login");
          return;
        }
        setToken(storedToken);
        try {
          setLoading(true);
          const res = await axios.get(
            "https://magictreebackend.onrender.com/cart/items",
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            }
          );
          setCartItems(res.data.items || []);
        } catch (err: any) {
          if (err.response?.status !== 404) {
            console.error("Error fetching cart:", err);
          }
          setCartItems([]);
        } finally {
          setLoading(false);
        }
      };

      fetchCartData();
    }, [])
  );

  // Update total price when cart changes
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) =>
        acc + ((item.price || 0) - (item.discount || 0)) * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  // Manually refresh cart
  const fetchCart = async () => {
    if (!token) return;
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
    router.push("/(tabs)/cart/checkout");
  };

  return (
    <View style={styles.cartContainer}>
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#28a745" />
          </View>
        ) : cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Image
              source={require("@/assets/images/empty-cart.png")}
              resizeMode="contain"
              style={styles.emptyCartImage}
            />
          </View>
        ) : (
          <>
            <ScrollView>
              {cartItems.map((item) => (
                <View key={item.productId} style={styles.cartItemContainer}>
                  <Image
                    source={
                      item.image
                        ? { uri: item.image }
                        : require("@/assets/images/fullLogo.jpg")
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
                      <TouchableOpacity
                        onPress={() => removeItem(item.productId)}
                      >
                        <MaterialIcons name="delete" size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={styles.footerContainer}>
              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalPrice}>₹{totalPrice.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={styles.couponButton}
                onPress={() => {
                  // handle coupon logic
                }}
              >
                <Text style={styles.couponText}>Have a coupon?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutButtonText}>
                  Proceed to Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  contentContainer: {
    minHeight: SCREEN_HEIGHT - 70,
    padding: 16,
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
    gap: 10,
  },
  quantityText: {
    marginHorizontal: 10,
  },
  emptyCartContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  emptyCartImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  footerContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
  },
  couponButton: {
    alignItems: "center",
    marginBottom: 12,
  },
  couponText: {
    color: "#007bff",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  checkoutButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CartScreen;
