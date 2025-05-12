import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const AdScreen = () => {
  const router = useRouter();

  const sampleAd = {
    title: "Big Summer Sale!",
    description: "Get up to 50% off on top electronics in your city!",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1695022313/sample.jpg",
    cta: "Shop Now",
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
      }}
    >
      <ImageBackground
        source={{ uri: sampleAd.image }}
        resizeMode="cover"
        style={{
          width: "100%",
          height: 250,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {sampleAd.title}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#F3F4F6",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {sampleAd.description}
          </Text>

          <TouchableOpacity
            onPress={() => router.push("./search")}
            style={{
              backgroundColor: "#007AFF",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="flash-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: "#fff", fontSize: 14 }}>{sampleAd.cta}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default AdScreen;
