import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

const Register = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "email",
      "password",
      "phone",
      "street",
      "city",
      "state",
      "zip",
      "country",
    ];
    for (let key of requiredFields) {
      if (!form[key]) {
        Alert.alert("Validation Error", `Please fill ${key} field`);
        return false;
      }
    }
    if (!form.email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email.");
      return false;
    }
    if (form.password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const userPayload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      addresses: [
        {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
          isDefault: true,
        },
      ],
    };

    try {
      const res = await fetch(
        "https://magictreebackend.onrender.com/user/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userPayload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      await SecureStore.setItemAsync("jwtToken", data.token);

      Alert.alert("Success", "Account created. Please login.");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      {Object.entries(form).map(([key, value]) => (
        <TextInput
          key={key}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          onChangeText={(text) => handleChange(key, text)}
          style={styles.input}
        />
      ))}

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/auth/login")}>
        <Text style={styles.link}>Already a member? Login here</Text>
      </Pressable>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { color: "#007bff", marginTop: 10, textAlign: "center" },
});
