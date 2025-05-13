import { StyleSheet, Text, View } from "react-native";

const ComingSoon = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚧 Coming Soon 🚧</Text>
    </View>
  );
};

export default ComingSoon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // You can change to a gradient or dark background if needed
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
  },
});
