import { Stack, useRouter } from "expo-router";

export default function SearchStackLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
        }}
      />

      {/*      <Stack.Screen
        name="payment"
        options={{
          title: "",
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.SECONDARY,
          },
          headerTintColor: "#ffffff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace("/(tabs)/cart")}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />*/}
    </Stack>
  );
}
