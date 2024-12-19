import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import Icon from 'react-native-vector-icons/Feather'; // For icons like Bell, Search, Filter, Menu, Star, etc.
import IconToggle from 'react-native-vector-icons/Ionicons'; // For icons like ToggleRightIcon, SwitchCameraIcon
import IconMoonSun from 'react-native-vector-icons/MaterialCommunityIcons'; // For Moon and Sun

import { featuredRestaurants, foodCourt, categories } from "../data/foodData";
import MenuOverlay from "../components/MenuOverlay";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import AppLoading from '../components/Loader';
import { ThemeContext } from "../context/AuthContext";
import { useCall } from "../context/CallContext";

const { width } = Dimensions.get("window");
import darkMenu from "../assets/darkmenuIcon.png"
import MenuIcon from "../assets/menuIcon.png"


const getStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme === "light" ? "#FFFFFF" : "#101112",
    },
    container: {
      flex: 1,
      backgroundColor: theme === "light" ? "#FFFFFF" : "#101112",
    },
    headerTitle: {
      fontSize: 25,
      fontWeight: "bold",
      color: theme === "light" ? "#000" : "#fff",
      fontFamily: "Livvic_700Bold",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      fontFamily: "Livvic_700Bold",
      color: theme === "light" ? "#000" : "#fff",
    },
    restaurantCard: {
      backgroundColor: theme === "light" ? "#fff" : "#2A2A2A",
      borderRadius: 12,
      width: 280,
      marginRight: 15,
      marginBottom: 20,
      shadowColor: theme === "light" ? "#ccc" : "#2A2A2A",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    restaurantName: {
      color: theme === "light" ? "#000" : "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    tag: {
      backgroundColor: theme === "light" ? "#E0E0E0" : "#1A1A1A",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 4,
    },
    tagText: {
      color: theme === "light" ? "#000" : "#fff",
      fontSize: 15,
      fontFamily: "Livvic_400Regular",
    },
    foodCourtCard: {
      backgroundColor: theme === "light" ? "#F5F5F5" : "#2A2A2A",
      borderRadius: 12,
      width: "47%",
    },
    foodCourtName: {
      color: theme === "light" ? "#000" : "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
    menuButton: {
      width: 50,
      height: 50,
      borderRadius: 10,
      backgroundColor: theme === "light" ? "#F5F5F5" : "#2A2A2A",
      justifyContent: "center",
      alignItems: "center",
    },
    notificationButton: {
      width: 50,
      height: 50,
      borderRadius: 10,
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconButton: {
      width: 50,
      height: 50,
      borderRadius: 10,
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
    },
    searchContainer: {
      flexDirection: "row",
      // paddingHorizontal: 20,
      gap: 10,
      marginBottom: 10,
    },
    searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme === "light" ? "#F5F5F5" : "#2A2A2A",
      borderColor: theme === "light" ? "#EFEFEF" : "#222",
      borderWidth: 1,

      borderRadius: 15,
      paddingHorizontal: 20,
    },
    searchInput: {
      flex: 1,
      color: "#fff",
      padding: 20,
      fontSize: 17,
      fontFamily: "Livvic_400Regular",
    },
    filterButton: {
      backgroundColor: theme === "light" ? "#F5F5F5" : "#2A2A2A",
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
      marginTop: 15,
    },
    viewAll: {
      color: "#DC2626",
      fontSize: 14,
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
      paddingBottom: 15,
    },
    restaurantNameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 4,
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
      paddingBottom: 5,
    },
    pricetags: {
      flexDirection: "row",
      marginBottom: 10,
      marginTop: 6,
      gap: 8,
    },
    pricetag: {
      backgroundColor: "#DC2626",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    pricetagText: {
      color: theme === "light" ? "#000" : "#fff",
      fontSize: 12,
      paddingVertical: 5,
    },
    mypricetags: {
      flexDirection: "row",
      marginBottom: 10,
      marginTop: 6,
      // gap: 8,
    },
    mypricetag: {
      // paddingHorizontal: 8,
      // paddingVertical: 4,
      borderRadius: 4,
    },
    mypricetagText: {
      color: "#DC2626",
      fontFamily: "Livvic_700Bold",
      fontSize: 25,
    },
    bigpricetags: {
      flexDirection: "row",
      marginBottom: 0,
      width: "100%",
      marginTop: 6,
      gap: 8,
    },
    bigpricetag: {
      backgroundColor: "#DC2626",
      paddingHorizontal: 8,
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      paddingVertical: 8,
      borderRadius: 9,
    },
    bigpricetagText: {
      color: "#fff",
      fontSize: 15,
      fontFamily: "Livvic_700Bold",
    },
    foodCourtGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 15,
      marginBottom: 10,
    },
    foodCourtImage: {
      width: "100%",
      height: 120,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "#000",
    },
    IntroText: {
      // paddingHorizontal: 20,
      paddingBottom: 20,
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
  });

export default function HomeScreen({ navigation }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-width)).current;
  const mainContentTranslateX = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const {
    initiateCall,
    handleHangUp,
    simulateIncomingCall,
    acceptCall,
    callStatus,
  } = useCall();
 
  
  const toggleMenu = () => {
    const toValue = isMenuOpen ? -width : 0;
    const contentToValue = isMenuOpen ? 0 : width * 0.7;
    const opacityToValue = isMenuOpen ? 0 : 0.5;

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: opacityToValue,
        duration: 250,
        useNativeDriver: true,
      }),
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
    ]).start(() => {
      setIsMenuOpen(!isMenuOpen);
    });
  };
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const styles = getStyles(theme);

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
                source={
                  theme === "light"
                    ? darkMenu
                    : MenuIcon
                }
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
              {theme === "light" ? (
                <Icon name="sun" color={theme === "light" ? "#000" : "#fff"} size={24} />
              ) : (
                <Icon name="moon" color={theme === "light" ? "#fff" : "#000"} size={24} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Notification")}
              style={styles.iconButton}
            >
              <Icon name="bell" color={theme === "light" ? "#000" : "#fff"} size={24}  />

            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.IntroText}>
            <Text style={styles.headerTitle}>
              What would you like{"\n"}to order
            </Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Icon name="search" color="#666" size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Find or food or restaurant..."
                placeholderTextColor="#666"
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter"  color="#DC2626" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>
                View All <Icon name="chevron-right" size={16} color="#DC2626" />
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredRestaurants.map((restaurant) => (
              <TouchableWithoutFeedback
                key={restaurant.id}
                onPress={() => navigation.navigate("FoodDetails", restaurant)}
              >
                <View style={styles.restaurantCard}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>{restaurant.rating}</Text>
                    <Icon name="star"  fill="#FFD700" color="#FFD700" size={12} />
                  </View>
                  <TouchableOpacity style={styles.favoriteButton}>
                   <Icon name="heart"color="#fff" size={20} />
                  </TouchableOpacity>
                  <Image
                    source={{ uri: restaurant.image }}
                    style={styles.restaurantImage}
                  />
                  <View style={styles.restaurantInfo}>
                    <View style={styles.restaurantNameRow}>
                      <Text style={styles.restaurantName}>
                        {restaurant.name}
                      </Text>
                      {restaurant.isVerified && (
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.pricetagText}>
                      {" "}
                      {"₦"}
                      {restaurant.price && restaurant.price.toFixed(2)}
                      {" • "}
                      {restaurant.delivery.isFree
                        ? "Free delivery"
                        : "Paid delivery"}
                      {" • "}
                      {restaurant.delivery.time}
                    </Text>
                    <View style={styles.mypricetags}>
                      <View style={styles.mypricetag}>
                        <Text style={styles.mypricetagText}>
                          {" "}
                          {"₦"}
                          {restaurant.price && restaurant.price.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.tags}>
                      {restaurant.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>

          {categories &&
            categories.length > 0 &&
            categories.map((category, index) => (
              <View key={index}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{category.name}</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewAll}>
                      View All <Icon name="chevron-right"  size={16} color="#DC2626" />
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.foodCourtGrid}>
                  {category.items &&
                    category.items.slice(0, 4).map((restaurant) => (
                      <TouchableWithoutFeedback
                        key={restaurant.id}
                        onPress={() =>
                          navigation.navigate("FoodDetails", restaurant)
                        }
                      >
                        <View style={styles.foodCourtCard}>
                          <TouchableOpacity style={styles.favoriteButton}>
                            <Icon name="heart" color="#fff" size={20} />
                          </TouchableOpacity>
                          <Image
                            source={{ uri: restaurant.image }}
                            style={styles.foodCourtImage}
                          />
                          <View style={styles.restaurantInfo}>
                            <View style={styles.restaurantNameRow}>
                              <Text style={styles.foodCourtName}>
                                {restaurant.name.length > 20
                                  ? restaurant.name.slice(0, 20) + "..."
                                  : restaurant.name}
                              </Text>
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
                            <View style={styles.bigpricetags}>
                              <View style={styles.bigpricetag}>
                                <Text style={styles.bigpricetagText}>
                                  {"₦"}
                                  {restaurant.price &&
                                    restaurant.price.toFixed(2)}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                </View>
              </View>
            ))}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
