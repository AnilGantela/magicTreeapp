import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSendOtp = async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await axios.post("https://magictreebackend.onrender.com/user/send-otp", {
        email,
      });
      console.log("OTP sent successfully");
      setOtpSent(true);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to send OTP.";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtpAndReset = async () => {
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await axios.post(
        "https://magictreebackend.onrender.com/user/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      Alert.alert("Success", "Password reset successful!");
      router.replace("/login");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to reset password.";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.exitIcon, { left: 20 }]}
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
          source={require("@/assets/images/AppLogo.jpg")}
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
        <Text style={styles.title}>Forgot Password</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!otpSent ? (
          <>
            <TextInput
              style={styles.emailInput}
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!submitting}
              placeholderTextColor="#fff"
            />

            <Pressable onPress={handleSendOtp} disabled={submitting || !email}>
              <LinearGradient
                colors={
                  submitting
                    ? ["#ccc", "#aaa"]
                    : ["hsla(151, 93%, 22%, 1)", "hsla(151, 97%, 12%, 1)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, submitting && { opacity: 0.8 }]}
              >
                <Text style={styles.buttonText}>
                  {submitting ? "Sending OTP..." : "Send OTP"}
                </Text>
              </LinearGradient>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="New password"
                secureTextEntry={!showPassword1}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholderTextColor="#fff"
              />
              <Pressable
                onPress={() => setShowPassword1(!showPassword1)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword1 ? "eye-off" : "eye"}
                  size={22}
                  color="#fff"
                />
              </Pressable>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm password"
                secureTextEntry={!showPassword2}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#fff"
              />
              <Pressable
                onPress={() => setShowPassword2(!showPassword2)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword2 ? "eye-off" : "eye"}
                  size={22}
                  color="#fff"
                />
              </Pressable>
            </View>

            <TextInput
              style={styles.otpInput}
              placeholder="Enter 6-digit OTP"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              placeholderTextColor="#fff"
            />

            <Pressable onPress={handleVerifyOtpAndReset} disabled={submitting}>
              <LinearGradient
                colors={
                  submitting
                    ? ["#ccc", "#aaa"]
                    : ["hsla(151, 93%, 22%, 1)", "hsla(151, 97%, 12%, 1)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, submitting && { opacity: 0.8 }]}
              >
                <Text style={styles.buttonText}>
                  {submitting ? "Resetting..." : "Reset Password"}
                </Text>
              </LinearGradient>
            </Pressable>
          </>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e4e2",
    justifyContent: "center",
  },
  exitIcon: {
    position: "absolute",
    top: 40,
    zIndex: 10,
    backgroundColor: "#e3e4e2",
    borderRadius: 20,
    padding: 2,
  },
  formContainer: {
    marginTop: 10,
    paddingHorizontal: 30,
    paddingTop: 30,
    borderRadius: 15,
    paddingBottom: 40,
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "left",
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
    position: "relative",
    marginBottom: 15,
  },
  passwordInput: {
    borderWidth: 1.5,
    borderColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    height: 55,
    color: "white",
    paddingRight: 45,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
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
  otpInput: {
    borderWidth: 1.5,
    borderColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    height: 55,
    color: "white",
    letterSpacing: 10,
    textAlign: "center",
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
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
});
