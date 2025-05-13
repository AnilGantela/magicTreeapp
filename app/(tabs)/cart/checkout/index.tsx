import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CartCheckout() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<
    number | null
  >(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync("magicTreeToken");
      if (!token) return;

      const cartRes = await axios.get(
        "https://magictreebackend.onrender.com/user/cart",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const addressRes = await axios.get(
        "https://magictreebackend.onrender.com/user/addresses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCartItems(cartRes.data);
      setAddresses(addressRes.data);
      if (addressRes.data.length > 0) setSelectedAddressIndex(0);
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
    if (!token) return Alert.alert("Unauthorized", "Please login again");

    try {
      setAddingAddress(true);
      const res = await axios.post(
        "https://magictreebackend.onrender.com/user/addresses",
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

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cart Items</Text>
      {cartItems.map((item, idx) => (
        <View key={idx} style={styles.itemBox}>
          <Text>{item.name}</Text>
          <Text>Qty: {item.quantity}</Text>
          <Text>Price: ₹{item.price}</Text>
        </View>
      ))}

      <Text style={styles.total}>Total: ₹{total}</Text>

      <View style={styles.addressSection}>
        <Text style={styles.sectionTitle}>Select Address:</Text>
        {addresses.map((addr, idx) => (
          <Text
            key={idx}
            onPress={() => setSelectedAddressIndex(idx)}
            style={[
              styles.addressBox,
              selectedAddressIndex === idx && styles.selectedAddressBox,
            ]}
          >
            {addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
          </Text>
        ))}

        <Button
          title={showNewAddressForm ? "Cancel" : "Add New Address"}
          onPress={() => setShowNewAddressForm(!showNewAddressForm)}
        />

        {showNewAddressForm && (
          <View style={styles.addressForm}>
            {["street", "city", "state", "zip", "country"].map((field) => (
              <TextInput
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newAddress[field as keyof typeof newAddress]}
                onChangeText={(text) =>
                  setNewAddress((prev) => ({ ...prev, [field]: text }))
                }
                style={styles.input}
              />
            ))}
            <Button
              title={addingAddress ? "Saving..." : "Save Address"}
              onPress={handleAddAddress}
              disabled={addingAddress}
            />
          </View>
        )}
      </View>

      <Button
        title="Place Order"
        onPress={() => {
          if (selectedAddressIndex === null)
            return Alert.alert("No Address Selected");
          Alert.alert(
            "Success",
            `Order placed for ${cartItems.length} items to ${addresses[selectedAddressIndex].street}`
          );
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  itemBox: {
    marginVertical: 8,
  },
  total: {
    fontWeight: "bold",
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  addressSection: {
    marginTop: 20,
  },
  addressBox: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 4,
    borderRadius: 4,
  },
  selectedAddressBox: {
    borderColor: "green",
    backgroundColor: "#eaffea",
  },
  addressForm: {
    marginTop: 12,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 8,
    paddingVertical: 4,
  },
});
