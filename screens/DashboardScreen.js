import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import {
  Bell,
  Search,
  Filter,
  Menu,
  Star,
  ChevronRight,
  Heart,
  ToggleRightIcon,
  SwitchCameraIcon,
  ListFilter,
} from "lucide-react-native";
import { featuredRestaurants, foodCourt } from "../data/foodData";
import MenuOverlay from "../components/MenuOverlay";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import AppLoading from "expo-app-loading";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-width)).current;
  const mainContentTranslateX = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isMenuOpen ? -width : 0;
    const contentToValue = isMenuOpen ? 0 : width * 0.8;
    const opacityToValue = isMenuOpen ? 0 : 0.5;

    Animated.parallel([
      Animated.timing(translateX, {
        toValue,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(mainContentTranslateX, {
        toValue: contentToValue,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: opacityToValue,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMenuOpen(!isMenuOpen);
    });
  };

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        translateX={translateX}
      />

      {isMenuOpen && (
        <TouchableOpacity
          style={[StyleSheet.absoluteFill, { zIndex: 999 }]}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Animated.View
            style={[styles.overlay, { opacity: overlayOpacity }]}
          />
        </TouchableOpacity>
      )}

      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: mainContentTranslateX }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <Image
                source={require("../assets/menuIcon.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell color="#fff" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.IntroText}>
          <Text style={styles.headerTitle}>
            What would you like{"\n"}to order
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color="#666" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Find or food or restaurant..."
              placeholderTextColor="#666"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <ListFilter color="#DC2626" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>
                View All <ChevronRight size={16} color="#DC2626" />
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredRestaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.restaurantCard}
                onPress={() => navigation.navigate("FoodDetails")}
              >
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>{restaurant.rating}</Text>
                  <Star fill="#FFD700" color="#FFD700" size={12} />
                </View>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Heart color="#fff" size={20} />
                </TouchableOpacity>
                <Image
                  source={{ uri: restaurant.image }}
                  style={styles.restaurantImage}
                />
                <View style={styles.restaurantInfo}>
                  <View style={styles.restaurantNameRow}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    {restaurant.isVerified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.deliveryInfo}>
                    <Text style={styles.deliveryText}>
                      {restaurant.delivery.isFree
                        ? "Free delivery"
                        : "Paid delivery"}
                    </Text>
                    <Text style={styles.deliveryDot}>•</Text>
                    <Text style={styles.deliveryText}>
                      {restaurant.delivery.time}
                    </Text>
                  </View>
                  <View style={styles.tags}>
                    {restaurant.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>FoodCourt</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>
                View All <ChevronRight size={16} color="#DC2626" />
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.foodCourtGrid}>
            {foodCourt.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.foodCourtCard}
                onPress={() => navigation.navigate("FoodDetails")}
              >
                <TouchableOpacity style={styles.favoriteButton}>
                  <Heart color="#fff" size={20} />
                </TouchableOpacity>
                <Image
                  source={{ uri: item.image }}
                  style={styles.foodCourtImage}
                />
                <Text style={styles.foodCourtName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#101112",
  },
  IntroText: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#101112",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingTop: 0,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Poppins_700Bold",
  },
  notificationButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 25,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 15,
    paddingHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    padding: 20,
    fontSize:17
  },
  filterButton: {
    backgroundColor: "#2A2A2A",
    
    padding: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  viewAll: {
    color: "#DC2626",
    fontSize: 14,
  },
  restaurantCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    width: 280,
    marginRight: 15,
    marginBottom: 20,
  },
  ratingContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 20,
    padding: 8,
  },
  restaurantImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  restaurantName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  verifiedBadge: {
    backgroundColor: "#DC2626",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  deliveryText: {
    color: "#666",
    fontSize: 12,
  },
  deliveryDot: {
    color: "#666",
    marginHorizontal: 4,
  },
  tags: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
  },
  foodCourtGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  foodCourtCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    width: "47%",
  },
  foodCourtImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  foodCourtName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    padding: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
});
