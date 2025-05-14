import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, View } from "react-native";
import { WebView } from "react-native-webview";
import { getRazorpayHTML } from "../../../utils/razorpayCheckoutHTML";

const RazorpayWebView = () => {
  const router = useRouter();
  const { razorpayOrderId, razorpayKeyId, amount, name, email, phone } =
    useLocalSearchParams();

  const user = { name, email, phone };
  const htmlContent = getRazorpayHTML(
    razorpayOrderId as string,
    razorpayKeyId as string,
    Number(amount),
    user
  );

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.cancelled) {
        Alert.alert("Payment Cancelled", "You cancelled the payment.");
        router.back();
        return;
      }
      console.log("Payment response:", data);
      if (!data.razorpay_order_id || !data.razorpay_payment_id) {
        Alert.alert("Error", "Invalid payment response.");
        return;
      }

      router.push({
        pathname: "/verifyPayment", // replace with your verification page
        params: {
          razorpayOrderId: data.razorpay_order_id,
          razorpayPaymentId: data.razorpay_payment_id,
          razorpaySignature: data.razorpay_signature,
        },
      });
    } catch (err) {
      Alert.alert("Error", "Could not process Razorpay response.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

export default RazorpayWebView;
