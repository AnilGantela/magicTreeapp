import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return false;
    }
    if (password.length < 1) {
      setError("Please enter a valid password.");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://magictreebackend.onrender.com/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      await SecureStore.setItemAsync("magicTreeToken", data.token);
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Login Failed", err.message);
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

      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("@/assets/images/FullLogo.jpg")}
          alt="app-logo"
          resizeMode="contain"
        />
      </View>

      <LinearGradient
        colors={["hsla(20, 100%, 22%, 1)", "hsla(19, 100%, 56%, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.formContainer}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.title}>Login</Text>
          <Pressable onPress={() => router.push("/(auth)/forgotpassword")}>
            <Text style={styles.link}>forgot password</Text>
          </Pressable>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.emailInput}
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholderTextColor="#fff"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, color: "#fff" }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#fff"
          />
          <Pressable onPress={() => setShowPassword((prev) => !prev)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={24}
              color="white"
            />
          </Pressable>
        </View>
        <Pressable onPress={handleLogin} disabled={loading}>
          <LinearGradient
            colors={
              loading
                ? ["#ccc", "#aaa"]
                : ["hsla(151, 93%, 22%, 1)", "hsla(151, 97%, 12%, 1)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.button, loading && { opacity: 0.8 }]}
          >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </Pressable>
        <Pressable onPress={() => router.push("/(auth)/signin")}>
          <Text style={styles.link}>Not a member? Register here</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e4e2",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  exitIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "#e3e4e2",
    borderRadius: 20,
    padding: 2,
    elevation: 0,
  },
  imageContainer: {
    backgroundColor: "#e3e4e2",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 50,
  },
  image: {
    width: 200,
    height: 150,
    marginTop: 10,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  input: {
    padding: 12,
    borderRadius: 8,
    height: 55,
    fontSize: 16,
  },
  emailInput: {
    borderWidth: 1.5,
    borderColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    height: 55,
    color: "white",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
    borderRadius: 8,
    height: 55,
    marginBottom: 15,
    paddingRight: 10,
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
  error: {
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  link: {
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
