import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync("magicTreeToken");
      if (!token) return router.replace("/login");

      try {
        const userRes = await fetch(
          "https://magictreebackend.onrender.com/user/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = await userRes.json();
        setUser(userData);

        const orderRes = await fetch(
          "https://magictreebackend.onrender.com/order/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const orderData = await orderRes.json();

        const filteredOrders = orderData.filter(
          (order: any) => order.payment && order.payment.status
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("magicTreeToken");
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user?.name}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{user?.phone}</Text>
      </View>

      <Text style={styles.title}>My Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.message}>No orders found.</Text>
      ) : (
        orders.map((order: any) => (
          <View key={order._id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text>Order ID: {order._id}</Text>
              <Text
                style={[
                  styles.status,
                  order.status === "Pending"
                    ? styles.pending
                    : styles.completed,
                ]}
              >
                {order.status}
              </Text>
            </View>
            <Text style={styles.detail}>
              Shipping Name: {order.shippingName}
            </Text>
            <Text style={styles.detail}>Phone: {order.phoneNumber}</Text>
            <Text style={styles.detail}>Address: {order.shippingAddress}</Text>
            <Text style={styles.detail}>Total: ₹{order.totalAmount / 100}</Text>
            <Text style={styles.detail}>
              Payment: {order.payment.method} ({order.payment.status})
            </Text>
            {order.products.map((item: any) => (
              <View key={item._id} style={styles.productRow}>
                <Image
                  source={{ uri: item.product.images[0] }}
                  style={styles.productImage}
                />
                <View>
                  <Text style={styles.productName}>{item.product.name}</Text>
                  <Text>Qty: {item.quantity}</Text>
                  <Text>₹{item.product.price}</Text>
                </View>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default ProfilePage;

// ------------------ Styles ------------------

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 26,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#222",
  },
  logoutText: {
    color: "#e53935",
    fontWeight: "600",
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    color: "#333",
  },
  value: {
    marginBottom: 8,
    color: "#444",
  },
  message: {
    fontSize: 16,
    color: "#555",
    marginVertical: 20,
  },
  orderCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: "500",
  },
  pending: {
    backgroundColor: "#ffe082",
    color: "#e65100",
  },
  completed: {
    backgroundColor: "#c8e6c9",
    color: "#1b5e20",
  },
  detail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  productName: {
    fontWeight: "600",
    marginBottom: 4,
  },
});
