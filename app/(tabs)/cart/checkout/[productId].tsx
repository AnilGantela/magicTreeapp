import axios from "axios";
import { useLocalSearchParams } from "expo-router";
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

export default function SingleProductCheckout() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
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

      const [productRes, addressRes] = await Promise.all([
        axios.get(
          `https://magictreebackend.onrender.com/products/${productId}`
        ),
        axios.get("https://magictreebackend.onrender.com/user/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProduct(productRes.data.product);
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

  if (!product) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>Price: ₹{product.price}</Text>

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
        title="Proceed to Pay"
        onPress={() => {
          if (selectedAddressIndex === null)
            return Alert.alert("No Address Selected");
          Alert.alert(
            "Success",
            `Order placed for ${product.name} to ${addresses[selectedAddressIndex].street}`
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
    color: "#333",
  },
  price: {
    marginVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
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
