import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

const VerifyPaymentPage = () => {
  const router = useRouter();
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    useLocalSearchParams();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Validate parameters
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
          throw new Error("Missing Razorpay payment details");
        }

        const token = await SecureStore.getItemAsync("magicTreeToken");
        if (!token) {
          throw new Error("Authentication required");
        }

        // Verify payment on backend
        const response = await axios.post(
          "https://magictreebackend.onrender.com/payment/verify",
          {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          Alert.alert("Payment Successful", "Your payment was verified.");
          router.replace("/(tabs)/profile");
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        Alert.alert(
          "Verification Failed",
          error.message || "Unable to verify payment"
        );
        router.back();
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#06038d" />
          <Text style={styles.text}>Verifying Payment...</Text>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#06038d",
  },
});

export default VerifyPaymentPage;
