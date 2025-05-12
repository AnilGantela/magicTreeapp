import { COLORS } from "@/constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function SearchStackLayout() {
  const router = useRouter();

  return (
    <Stack>
      {/* Hide header for /search/index */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="[productId]"
        options={{
          title: "",
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.SECONDARY,
          },
          headerTintColor: "#ffffff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace("/(tabs)/Search")}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
