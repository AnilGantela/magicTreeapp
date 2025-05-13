import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function SearchStackLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerShown: true,
          headerTintColor: "#ffffff",
          headerBackground: () => (
            <LinearGradient
              colors={["hsla(20, 100%, 22%, 1)", "hsla(19, 100%, 56%, 1)"]}
              start={[0, 0]}
              end={[1, 0]}
              style={StyleSheet.absoluteFill}
            />
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{ paddingHorizontal: 10 }}
              onPress={() => router.replace("/(tabs)/cart")}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="[productId]"
        options={{
          title: "",
          headerShown: true,
          headerTintColor: "#ffffff",
          headerBackground: () => (
            <LinearGradient
              colors={["hsla(20, 100%, 22%, 1)", "hsla(19, 100%, 56%, 1)"]}
              start={[0, 0]}
              end={[1, 0]}
              style={StyleSheet.absoluteFill}
            />
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{ paddingHorizontal: 10 }}
              onPress={() => router.replace("/(tabs)/cart")}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
