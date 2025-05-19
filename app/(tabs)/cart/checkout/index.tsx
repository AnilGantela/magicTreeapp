import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CartCheckout = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<
    number | null
  >(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const discount = 50;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync("magicTreeToken");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const [cartRes, addressRes] = await Promise.all([
          axios.get("https://magictreebackend.onrender.com/cart/items", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://magictreebackend.onrender.com/user/addresses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCartItems(cartRes.data.items);
        setAddresses(addressRes.data);
        const defaultIdx = addressRes.data.findIndex((a: any) => a.isDefault);
        setSelectedAddressIndex(defaultIdx !== -1 ? defaultIdx : 0);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const handleAddAddress = async () => {
    const { street, city, state, zip, country } = newAddress;
    if (!street || !city || !state || !zip || !country) {
      Alert.alert("Missing Info", "Please fill all fields");
      return;
    }

    const token = await SecureStore.getItemAsync("magicTreeToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      setAddingAddress(true);
      const res = await axios.post(
        "https://magictreebackend.onrender.com/user/address",
        newAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses((prev) => [...prev, res.data]);
      setSelectedAddressIndex(addresses.length);
      setShowNewAddressForm(false);
      setNewAddress({ street: "", city: "", state: "", zip: "", country: "" });
    } catch (err) {
      Alert.alert("Error", "Failed to save address");
    } finally {
      setAddingAddress(false);
    }
  };

  const calculateTotal = () =>
    cartItems.reduce(
      (sum, item) => sum + (item.price - (item.discount || 0)) * item.quantity,
      0
    ) - discount;

  const calculateTotalSaved = () =>
    cartItems.reduce(
      (sum, item) => sum + (item.discount || 0) * item.quantity,
      0
    );

  const handlePlaceOrder = async () => {
    if (!name || !phone || selectedAddressIndex === null) {
      Alert.alert("Error", "Please complete all required fields");
      return;
    }

    const token = await SecureStore.getItemAsync("magicTreeToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    const selectedAddress = addresses[selectedAddressIndex];
    const shippingAddress = `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.zip}, ${selectedAddress.country}`;

    try {
      setLoading(true);
      const orderRes = await axios.post(
        "https://magictreebackend.onrender.com/order/create",
        {
          products: cartItems.map((item) => ({
            product: item.productId || item._id,
            quantity: item.quantity,
            price: Math.ceil(item.price - (item.discount || 0)),
          })),
          shippingAddress,
          shippingName: name,
          phoneNumber: phone,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentMethod === "Cash on Delivery") {
        Alert.alert("Success", "Order placed successfully!");
        router.replace("/(tabs)/profile");
      } else {
        const { razorpayOrderId, razorpayKeyId, amount, currency } =
          orderRes.data;
        router.replace({
          pathname: "/(auth)/RazorpayWebView",
          params: {
            razorpayOrderId,
            razorpayKeyId,
            amount,
            name,
            phone,
            currency,
          },
        });
      }
    } catch (err) {
      console.error("Order failed:", err);
      Alert.alert("Error", "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Checkout</Text>

      <Text style={styles.sectionTitle}>Your Order</Text>
      {cartItems.map((item, idx) => (
        <View key={item._id} style={styles.productContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.discountedPrice}>₹{item.price}</Text>
            </View>
            <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
          </View>
        </View>
      ))}

      {/* Customer Information */}
      <Text style={styles.sectionTitle}>Customer Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Address Section */}
      <View style={styles.addressHeader}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TouchableOpacity
          onPress={() => setShowNewAddressForm(!showNewAddressForm)}
        >
          <Text style={styles.addAddressText}>
            {showNewAddressForm ? "Cancel" : "+ Add New Address"}
          </Text>
        </TouchableOpacity>
      </View>

      {showNewAddressForm && (
        <View style={styles.addressForm}>
          {["street", "city", "state", "zip", "country"].map((field) => (
            <TextInput
              key={field}
              style={styles.input}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newAddress[field as keyof typeof newAddress]}
              onChangeText={(text) =>
                setNewAddress((prev) => ({ ...prev, [field]: text }))
              }
            />
          ))}
          <TouchableOpacity
            style={styles.saveAddressButton}
            onPress={handleAddAddress}
            disabled={addingAddress}
          >
            {addingAddress ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveAddressButtonText}>Save Address</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {addresses.length > 0 && (
        <View style={styles.addressList}>
          {addresses.map((address, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.addressItem,
                selectedAddressIndex === idx && styles.selectedAddressItem,
              ]}
              onPress={() => setSelectedAddressIndex(idx)}
            >
              <View style={styles.radioButton}>
                {selectedAddressIndex === idx && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <View style={styles.addressDetails}>
                <Text style={styles.addressText}>{address.street}</Text>
                <Text style={styles.addressText}>
                  {address.city}, {address.state} {address.zip}
                </Text>
                <Text style={styles.addressText}>{address.country}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Payment Method */}
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.paymentMethods}>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => setPaymentMethod("Cash on Delivery")}
        >
          <View style={styles.radioButton}>
            {paymentMethod === "Cash on Delivery" && (
              <View style={styles.radioButtonSelected} />
            )}
          </View>
          <Text style={styles.paymentText}>Cash on Delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => setPaymentMethod("Online payment")}
        >
          <View style={styles.radioButton}>
            {paymentMethod === "Online payment" && (
              <View style={styles.radioButtonSelected} />
            )}
          </View>
          <Text style={styles.paymentText}>Pay Now</Text>
        </TouchableOpacity>
      </View>

      {/* Order Summary */}
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>
          ₹
          {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Discount</Text>
        <Text style={[styles.summaryValue, styles.discountText]}>
          -₹{discount}
        </Text>
      </View>
      {calculateTotalSaved() > 0 && (
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>You Saved</Text>
          <Text style={[styles.summaryValue, styles.savedText]}>
            ₹{calculateTotalSaved()}
          </Text>
        </View>
      )}
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Delivery</Text>
        <Text style={styles.summaryValue}>FREE</Text>
      </View>
      <View style={[styles.summaryItem, styles.totalItem]}>
        <Text style={[styles.summaryLabel, styles.totalLabel]}>Total</Text>
        <Text style={[styles.summaryValue, styles.totalValue]}>
          ₹{calculateTotal()}
        </Text>
      </View>

      <Text style={styles.deliveryEstimate}>
        Estimated delivery by {deliveryDate.toDateString()}
      </Text>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>
              {paymentMethod === "Cash on Delivery" ? "Place Order" : "Pay Now"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  productContainer: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  savedText: {
    fontSize: 12,
    color: "#4CAF50",
    marginBottom: 5,
  },
  quantityText: {
    fontSize: 14,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addAddressText: {
    color: "#1E88E5",
    fontWeight: "600",
  },
  addressForm: {
    marginBottom: 15,
  },
  saveAddressButton: {
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveAddressButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  addressList: {
    marginBottom: 15,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedAddressItem: {
    borderColor: "#1E88E5",
    backgroundColor: "#E3F2FD",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#999",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1E88E5",
  },
  addressDetails: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: "#333",
  },
  paymentMethods: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
  },
  discountText: {
    color: "#4CAF50",
  },
  totalItem: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  totalValue: {
    fontWeight: "bold",
    fontSize: 16,
  },
  deliveryEstimate: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 15,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  backButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  payButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#1E88E5",
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CartCheckout;
