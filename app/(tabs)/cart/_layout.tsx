import { Stack, useRouter } from "expo-router";

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
        name="checkout"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
