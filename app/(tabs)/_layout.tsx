import { COLORS } from "@/constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => (
          <LinearGradient
            colors={["hsla(151, 93%, 22%, 1)", "hsla(151, 97%, 12%, 1)"]}
            start={[0, 0]}
            end={[1, 0]}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: COLORS.WHITE,
        tabBarInactiveTintColor: COLORS.BLACK,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
