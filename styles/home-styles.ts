import { COLORS } from "@/constants/Theme";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const isWeb = width > 768;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
    color: "#5f5fd4",
    width: width,
  },
  topContainer: {
    height: 65,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "99%",
    backgroundColor: COLORS.WHITE,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 60,
    resizeMode: "cover",
  },
  bottomContainer: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  searchText: {
    marginLeft: 8,
    color: COLORS.ACCENT1,
    fontSize: 16,
  },
  adContainer: {
    height: 250,
    marginBottom: 10,
  },
  productSection: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.WHITE,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: COLORS.SECONDARY,
  },
  dealCard: {
    width: 170,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    margin: 8,
    elevation: 2,
    position: "relative",
  },

  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 170,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },

  dealImage: {
    width: "100%",
    height: "100%",
    marginTop: 30,
    resizeMode: "contain",
  },

  discountBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "red",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },

  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  dealInfoContainer: {
    padding: 8,
    paddingBottom: 30, // make space for price at bottom
    position: "relative",
    minHeight: 80,
  },

  dealTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },

  priceContainer: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  dealPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },

  priceTag: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },

  locationIcon: {
    padding: 6,
    backgroundColor: COLORS.WHITE,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  dealDiscount: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 2,
    fontWeight: "600",
  },
});
