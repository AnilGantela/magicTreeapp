import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default Home = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const carouselRef = useRef(null);

  const bannerImages = [
    { id: 1, src: require("@/assets/images/banner1.jpg") },
    { id: 2, src: require("@/assets/images/banner2.webp") },
    { id: 3, src: require("@/assets/images/banner3.jpg") },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
      }
    };

    fetchProducts();
  }, []);

  const renderBannerItem = ({ item }) => (
    <Image source={item.src} style={styles.bannerImage} resizeMode="cover" />
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bannerContainer}></View>

      {Object.entries(groupedProducts).map(([category, products]) => (
        <View key={category}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.productSection}
          >
            {products.map((product) => {
              const discountedPrice = Math.round(
                product.price * (1 - (product.discount || 0) / 100)
              );

              return (
                <View
                  key={product._id || product.id}
                  style={styles.productCard}
                >
                  {product.discount > 0 && (
                    <Text style={styles.discountBadge}>
                      -{product.discount}%
                    </Text>
                  )}
                  <Image
                    source={{ uri: product.images?.[1] || product.images?.[0] }}
                    style={styles.productImage}
                  />
                  <Text style={styles.productTitle}>{product.name}</Text>
                  <View style={styles.priceAndRatingRow}>
                    <View>
                      {product.discount > 0 && (
                        <Text style={styles.strikePrice}>₹{product.price}</Text>
                      )}
                      <Text style={styles.productPrice}>
                        ₹{discountedPrice}
                      </Text>
                    </View>
                    <Text style={styles.averageRating}>
                      ⭐ {product.averageRating || 5}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  productCard: {
    width: 150,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginRight: 10,
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
