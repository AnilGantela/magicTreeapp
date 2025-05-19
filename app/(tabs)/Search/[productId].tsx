import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

const ProductPage = () => {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://magictreebackend.onrender.com/products/${productId}`
        );
        setProduct(res.data.product);
        setMainImage(res.data.product.images[0]);
        setReviews(res.data.reviews);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const checkProductInCart = async () => {
      try {
        const token = await SecureStore.getItemAsync("magicTreeToken");
        if (!token || !product) return;

        const res = await axios.get(
          "https://magictreebackend.onrender.com/cart/items",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const isProductInCart = res.data.items.some(
          (item: any) => item.productId === product._id
        );
        setIsInCart(isProductInCart);
      } catch (err) {
        if (err.response?.status === 404) {
          return;
        }
        console.error("Error checking cart items:", err);
      }
    };

    if (product) {
      checkProductInCart();
    }
  }, [product]);

  const handleAddToCart = async () => {
    try {
      const token = await SecureStore.getItemAsync("magicTreeToken");
      if (!token) {
        Alert.alert(
          "Login required",
          "Please log in to add products to your cart."
        );
        router.push({
          pathname: "/login",
          params: { from: `/search/${productId}` },
        });
        return;
      }

      const res = await axios.post(
        "https://magictreebackend.onrender.com/cart/add",
        {
          product: {
            productId: product._id,
            name: product.name,
            price: product.price,
            discount: product.discount,
            image: product.images[0],
            quantity: 1,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        Alert.alert("Success", "Product added to cart.");
        setIsInCart(true);
      } else {
        Alert.alert("Failed", "Could not add product to cart.");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      Alert.alert("Error", "Failed to add product to cart.");
    }
  };

  const handleBuyNow = () => {
    router.push(`/cart/checkout/${product._id}`);
  };

  const renderStars = (rating: number = 5) => {
    if (product.averageRating === 0) {
      return;
    }
    const fullStars = Math.floor(product.averageRating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <Text style={styles.rating}>
        {"★".repeat(fullStars)}
        {hasHalfStar ? "½" : ""}
        {"☆".repeat(emptyStars)}
      </Text>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  return (
    <ScrollView style={styles.container}>
      {/* Main Image */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
          paddingRight: 10,
        }}
      >
        <Image
          source={{ uri: mainImage }}
          style={{ width: screenWidth, height: 300, resizeMode: "contain" }}
        />
      </View>

      {/* Thumbnails */}
      <View style={styles.thumbnailRow}>
        {product.images.map((img: string, index: number) => (
          <TouchableOpacity key={index} onPress={() => setMainImage(img)}>
            <Image
              source={{ uri: img }}
              style={[
                styles.thumbnail,
                { borderColor: mainImage === img ? "#007bff" : "#ccc" },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.details}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: 15,
            marginBottom: 10,
          }}
        >
          <Text style={styles.name}>{product.name}</Text>
          {renderStars(product.averageRating)}
        </View>

        <View style={styles.categoryRow}>
          <TouchableOpacity
            style={[styles.categoryButton, { backgroundColor: "#dc3545" }]}
          >
            <Text style={styles.categoryText}>{product.category}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, { backgroundColor: "#007bff" }]}
          >
            <Text style={styles.categoryText}>{product.subcategory}</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            display: "flex",
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.price}>
            ₹{discountedPrice.toFixed(2)}{" "}
            {product.discount < 0 && (
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <Text style={styles.original}>₹{product.price}</Text>
                <Text style={styles.discount}>{product.discount}% OFF</Text>
              </View>
            )}
          </Text>
          <Text style={{ color: "#28a745" }}>
            {product.stock} units in stock
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, isInCart && { backgroundColor: "#aaa" }]}
            onPress={handleAddToCart}
            disabled={isInCart}
          >
            <Text style={styles.buttonText}>
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#28a745" }]}
            onPress={handleBuyNow}
          >
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{product.description}</Text>
      </View>

      <View style={styles.reviews}>
        <Text style={styles.reviewHeader}>Customer Reviews</Text>
        {reviews.length > 0 ? (
          reviews.map((review: any) => (
            <View key={review._id} style={styles.reviewItem}>
              <Text style={{ fontWeight: "bold" }}>{review.user.name}</Text>
              <Text>⭐ {review.rating}/5</Text>
              <Text>{review.comment}</Text>
            </View>
          ))
        ) : (
          <Text>No reviews yet. Be the first to review!</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ProductPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 15,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderWidth: 2,
    borderRadius: 8,
  },
  details: {
    padding: 16,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 20,
    marginVertical: 4,
    color: "#FFD700", // gold
  },
  categoryRow: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryText: {
    fontWeight: "bold",
    color: "#fff",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
  },
  original: {
    fontSize: 16,
    color: "#888",
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
    marginLeft: 6,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 15,
    marginVertical: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  description: {
    fontSize: 17,
    marginTop: 8,
    lineHeight: 22,
    color: "#555",
  },
  reviews: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  reviewHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  reviewItem: {
    marginBottom: 15,
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
  },
});
