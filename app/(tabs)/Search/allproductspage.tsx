import { ActivityIndicator } from "react-native";

import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function allproductspage() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://magictreebackend.onrender.com/products/"
        );
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch products");

        const grouped = data.products.reduce((acc, product) => {
          const category = product.category || "Other";
          if (!acc[category]) acc[category] = [];
          acc[category].push(product);
          return acc;
        }, {});
        setGroupedProducts(grouped);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <View style={styles.mainContainer}>
      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContainer}>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 50,
            }}
          >
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ marginTop: 10, fontSize: 16, color: "#555" }}>
              Loading products...
            </Text>
          </View>
        ) : (
          Object.entries(groupedProducts).map(([category, products]) => (
            <View key={category}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.productGrid}>
                {products.map((product) => {
                  const discountedPrice = Math.round(
                    product.price * (1 - (product.discount || 0) / 100)
                  );
                  return (
                    <TouchableOpacity
                      key={product._id || product.id}
                      style={styles.productCard}
                      onPress={() => router.push(`/Search/${product._id}`)}
                    >
                      {product.discount > 0 && (
                        <Text style={styles.discountBadge}>
                          -{product.discount}%
                        </Text>
                      )}
                      <Image
                        source={{
                          uri: product.images?.[1] || product.images?.[0],
                        }}
                        style={styles.productImage}
                      />
                      <Text style={styles.productTitle}>{product.name}</Text>
                      <View style={styles.priceAndRatingRow}>
                        <View>
                          {product.discount > 0 && (
                            <Text style={styles.strikePrice}>
                              ₹{product.price}
                            </Text>
                          )}
                          <Text style={styles.productPrice}>
                            ₹{discountedPrice}
                          </Text>
                        </View>
                        <Text style={styles.averageRating}>
                          ⭐ {product.averageRating || 5}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: "column",
    gap: 15,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    marginBottom: 10,
  },
  networkPickerContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  networkLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },

  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: "#333",
  },

  brandTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  productCard: {
    width: "48%", // roughly half of the row
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    position: "relative",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchPlaceholder: {
    color: "#888",
    fontSize: 16,
    marginLeft: 8,
  },
  bannerContainer: {
    height: 200,
    marginBottom: 10,
  },
  bannerImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 15,
  },
  productSection: {
    paddingLeft: 10,
    paddingBottom: 20,
  },

  discountBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    color: "#fff",
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 12,
    borderRadius: 5,
    zIndex: 1,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  productTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
  },
  priceAndRatingRow: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  strikePrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
  },
  averageRating: {
    fontSize: 12,
    backgroundColor: "#e4e4e4",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
});
