import React from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SUPPORT_PHONE = "9110769027";
const SUPPORT_WHATSAPP = "9110769027";
const SUPPORT_EMAIL = "anilkumar.gantela77@gmail.com";

const Support: React.FC = () => {
  const handleCall = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() =>
      Alert.alert("Error", "Could not open phone dialer.")
    );
  };

  const handleWhatsApp = () => {
    const url = `whatsapp://send?phone=${SUPPORT_WHATSAPP}&text=Hello, I need support.`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "WhatsApp not installed.")
    );
  };

  const handleEmail = () => {
    const subject = "Support Request";
    const body = "Hi Support Team, I need help with...";
    const mailUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailUrl).catch(() =>
      Alert.alert("Error", "Could not open mail client.")
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Support</Text>
      <Text style={styles.description}>
        Need help? Contact our support team:
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleCall}>
        <Text style={styles.buttonText}>📞 Call Us</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.whatsapp]}
        onPress={handleWhatsApp}
      >
        <Text style={styles.buttonText}>💬 WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.email]}
        onPress={handleEmail}
      >
        <Text style={styles.buttonText}>📧 Email</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    color: "#555",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  whatsapp: {
    backgroundColor: "#25D366",
  },
  email: {
    backgroundColor: "#FF5722",
  },
});
