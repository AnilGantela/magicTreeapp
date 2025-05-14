import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
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

  const flatListRef = useRef<FlatList>(null);

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
      <FlatList
        ref={flatListRef}
        data={product.images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: screenWidth, height: 300, resizeMode: "contain" }}
          />
        )}
      />

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
        <Text style={styles.name}>{product.name}</Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Category:</Text>{" "}
          {product.category}
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Subcategory:</Text>{" "}
          {product.subcategory}
        </Text>
        <Text style={styles.rating}>⭐ {product.averageRating || 5}/5</Text>
        <Text style={{ color: "#28a745" }}>{product.stock} units in stock</Text>

        <Text style={styles.price}>
          ₹{discountedPrice.toFixed(2)}{" "}
          {product.discount > 0 && (
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <Text style={styles.original}>₹{product.price}</Text>
              <Text style={styles.discount}>{product.discount}% OFF</Text>
            </View>
          )}
        </Text>

        <Text style={styles.description}>{product.description}</Text>

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
    paddingVertical: 10,
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
    fontSize: 20,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 16,
    marginVertical: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  original: {
    textDecorationLine: "line-through",
    color: "#888",
    fontSize: 16,
  },
  discount: {
    color: "#dc3545",
    fontSize: 16,
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    flexWrap: "wrap",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  reviews: {
    padding: 16,
  },
  reviewHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewItem: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#f4f4f4",
    borderRadius: 6,
  },
});
