import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by product name..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <View style={{ paddingTop: 50, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10, fontSize: 16, color: "#555" }}>
            Loading products...
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {filteredProducts.length === 0 ? (
            <Text style={styles.noResults}>No products found.</Text>
          ) : (
            <View style={styles.productGrid}>
              {filteredProducts.map((product) => {
                const discountedPrice = Math.round(
                  product.price * (1 - (product.discount || 0) / 100)
                );
                return (
                  <TouchableOpacity
                    key={product._id}
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
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  searchInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  noResults: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    position: "relative",
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
