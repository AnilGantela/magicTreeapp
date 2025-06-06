import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
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
      "phone",
      "password",
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
    setLoading(true);

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

      await SecureStore.setItemAsync("magicTreeToken", data.token);
      Alert.alert("Success", "Account created successfully.");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={styles.imageContainer}>
          <Pressable
            style={[styles.exitIcon, { left: 20, right: undefined }]}
            onPress={() => router.replace("/")}
            hitSlop={10}
          >
            <Ionicons
              name="exit-outline"
              size={32}
              color="#333"
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </Pressable>
          <Image
            style={styles.image}
            source={require("@/assets/images/fullLogo.jpg")}
            resizeMode="contain"
          />
        </View>

        <LinearGradient
          colors={["hsla(20, 100%, 22%, 1)", "hsla(19, 100%, 56%, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.formWrapper}
        >
          <ScrollView
            contentContainerStyle={styles.formContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Register</Text>

            <TextInput
              placeholder="Name"
              placeholderTextColor="#000"
              value={form.name}
              onChangeText={(text) => handleChange("name", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#000"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Phone"
              placeholderTextColor="#000"
              value={form.phone}
              onChangeText={(text) => handleChange("phone", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={form.password}
              placeholderTextColor="#000"
              secureTextEntry
              onChangeText={(text) => handleChange("password", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Street"
              value={form.street}
              placeholderTextColor="#000"
              onChangeText={(text) => handleChange("street", text)}
              style={styles.input}
            />

            <View style={styles.row}>
              <TextInput
                placeholder="City"
                value={form.city}
                placeholderTextColor="#000"
                onChangeText={(text) => handleChange("city", text)}
                style={[styles.input, styles.halfInput, { marginRight: 10 }]}
              />
              <TextInput
                placeholder="Zip"
                placeholderTextColor="#000"
                value={form.zip}
                onChangeText={(text) => handleChange("zip", text)}
                style={[styles.input, styles.halfInput]}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                placeholder="State"
                value={form.state}
                placeholderTextColor="#000"
                onChangeText={(text) => handleChange("state", text)}
                style={[styles.input, styles.halfInput, { marginRight: 10 }]}
              />
              <TextInput
                placeholder="Country"
                value={form.country}
                placeholderTextColor="#000"
                onChangeText={(text) => handleChange("country", text)}
                style={[styles.input, styles.halfInput]}
              />
            </View>

            <Pressable onPress={handleSubmit}>
              <LinearGradient
                colors={["hsla(151, 93%, 22%, 1)", "hsla(151, 97%, 12%, 1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Register</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.link}>Already a member? Login here</Text>
            </Pressable>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e4e2",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },
  image: {
    width: 200,
    height: 150,
  },
  exitIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "#e3e4e2",
    borderRadius: 20,
    padding: 2,
  },
  formWrapper: {
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    color: "#333",
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
