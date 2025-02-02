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
  Platform,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import jwt_decode from 'jwt-decode'
import Icon from "react-native-vector-icons/Feather"; // Import Feather icons from react-native-vector-icons

import { featuredRestaurants, foodCourt, categories } from "../data/foodData";
import MenuOverlay from "../components/MenuOverlay";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import AppLoading from "../components/Loader";
import { AuthContext, ThemeContext } from "../context/AuthContext";
import { useCall } from "../context/CallContext";

const { width } = Dimensions.get("window");
import darkMenu from "../assets/darkmenuIcon.png";
import MenuIcon from "../assets/menuIcon.png";
import { BASE_URL } from "../config";
import Toast from "react-native-toast-message";

const getStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? 25 : 5,

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
      padding: Platform.OS === "android" ? 5 : 20,
      fontSize: 17,
      fontFamily: "Livvic_400Regular",
    },
    filterButton: {
      backgroundColor: theme === "light" ? "#F5F5F5" : "#2A2A2A",
      padding: 20,
      flexDirection: 'row',
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
      paddingBottom: 10,
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
    gridContainer: {
      flex: 1,
      padding: 10,
    },
    columnWrapper: {
      justifyContent: "space-between", // Ensures even spacing between items in a row
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
    gridContainer1: {
      flex: 1,
      padding: 2,
    },
    columnWrapper1: {
      justifyContent: "space-between", // Ensures even spacing between items in a row
    },
    restaurantCard1: {
      width: "49%", // Allows two items to fit in one row with spacing
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: theme === "light" ? "#F5F5F5" : "#2A2A2A",
      marginBottom: 10,
      padding: 8,
      elevation: 2, // Adds a subtle shadow
    },
    restaurantImage1: {
      width: "100%",
      height: 120, // Adjusted for smaller layout
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    restaurantInfo1: {
      padding: 8,
    },
    restaurantNameRow1: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 5,
      color: theme === "light" ? "#000" : "#fff",
    },
    restaurantName1: {
      fontSize: 12, // Smaller text for the grid layout
      fontWeight: "bold",
      color: theme === "light" ? "#000" : "#fff",
    },
    verifiedBadge1: {
      backgroundColor: "#4CAF50",
      borderRadius: 5,
      padding: 2,
    },
    verifiedText1: {
      color: theme === "light" ? "#000" : "#fff",
      fontSize: 10,
    },
    pricetagText1: {
      fontSize: 10, // Smaller font size for price details
      color: theme === "light" ? "#000" : "#fff",
      marginBottom: 8,
    },
    redButtonContainer1: {
      backgroundColor: "red",
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 4,
    },
    redButtonText1: {
      color: theme === "light" ? "#000" : "#fff",
      fontSize: 12,
      fontWeight: "bold",
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
  const {token} = useContext(AuthContext)
  const {socket} = useCall()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setloading] = useState(true)
  const [shops, setShops] = useState([])
  const translateX = useRef(new Animated.Value(-width)).current;
  const mainContentTranslateX = useRef(new Animated.Value(0)).current;
  const [randomItems, setRandomItems] = useState([]);
  const [allItems, setallItems] = useState([])
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const {
    initiateCall,
    handleHangUp,
    simulateIncomingCall,
    acceptCall,
    callStatus,
  } = useCall();

  const getDeets2 = async () => {
    setloading(true)
    try {
      console.log("TOKEN: ", token);
      const decodedToken = await jwt_decode(token);
      console.log("DecodedToken: ", decodedToken);

      const response = await fetch(`${BASE_URL}/shops`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token if required
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.log("Error fetching shops: ", error);
        Toast.show({
          type: 'error',
          text1: 'Failed to fetch shops',
          text2: error?.message || 'An unexpected error occurred.',
        });
        return;
      }

      const resp2 = await response.json();
      console.log("Shops response: ", resp2);

      if (resp2.status === 200) {
        setShops(resp2.shops); // Save to state
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: resp2.message || 'Could not retrieve shops.',
        });
      }

      const responseItems = await fetch(`${BASE_URL}/items/random`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token if required
        },
      });

      if (!responseItems.ok) {
        const error = await responseItems.json();
        console.log("Error fetching random items: ", error);
        Toast.show({
          type: 'error',
          text1: 'Failed to fetch random items',
          text2: error?.message || 'An unexpected error occurred.',
        });
        return;
      }

      const respItems = await responseItems.json();
      console.log("Random Items response: ", respItems);

      if (respItems.status === 200) {
        const itemsWithTags = respItems.data.map(item => ({
          ...item,
          tags: ["Promo", "Package", "Fast Food"] // Add the tags to each item
        }));
        
        setRandomItems(itemsWithTags);        } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: respItems.message || 'Could not retrieve random items.',
        });
      }

      const response3 = await fetch(`${BASE_URL}/items/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response3.ok) {
        const errorData = await response3.json();
        console.log("Error fetching items:", errorData);
        Toast.show({
          type: "error",
          text1: "Failed to fetch items",
          text2: errorData?.message || "An unexpected error occurred.",
        });
        return;
      }

      const itemsData = await response3.json();
      console.log("Items response:", itemsData);

      if (itemsData && itemsData.data) {
        const itemsWithTags = itemsData.data.map(item => ({
          ...item,
          tags: ["Package", "Fast Food"] // Add the tags to each item
        }));
        setallItems(itemsWithTags); // Save to allItems state
        Toast.show({
          type: "success",
          text1: "Items fetched successfully",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No items were returned.",
        });
      }

    } catch (error) {
      console.error("Error in getDeets: ", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while fetching shops.',
      });
    } finally{
      setloading(false)
    }
  };

  useEffect(() => {
    const getDeets = async () => {
      try {
        console.log("TOKEN: ", token);
        const decodedToken = await jwt_decode(token);
        console.log("DecodedToken: ", decodedToken);

        const response = await fetch(`${BASE_URL}/shops`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token if required
          },
        });

        if (!response.ok) {
          const error = await response.json();
          console.log("Error fetching shops: ", error);
          Toast.show({
            type: 'error',
            text1: 'Failed to fetch shops',
            text2: error?.message || 'An unexpected error occurred.',
          });
          return;
        }

        const resp2 = await response.json();
        console.log("Shops response: ", resp2);

        if (resp2.status === 200) {
          setShops(resp2.shops); // Save to state
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: resp2.message || 'Could not retrieve shops.',
          });
        }

        const responseItems = await fetch(`${BASE_URL}/items/random`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token if required
          },
        });

        if (!responseItems.ok) {
          const error = await responseItems.json();
          console.log("Error fetching random items: ", error);
          Toast.show({
            type: 'error',
            text1: 'Failed to fetch random items',
            text2: error?.message || 'An unexpected error occurred.',
          });
          return;
        }

        const respItems = await responseItems.json();
        console.log("Random Items response: ", respItems);

        if (respItems.status === 200) {
          const itemsWithTags = respItems.data.map(item => ({
            ...item,
            tags: ["Promo", "Package", "Fast Food"] // Add the tags to each item
          }));
          
          setRandomItems(itemsWithTags);        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: respItems.message || 'Could not retrieve random items.',
          });
        }

        const response3 = await fetch(`${BASE_URL}/items/all`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response3.ok) {
          const errorData = await response3.json();
          console.log("Error fetching items:", errorData);
          Toast.show({
            type: "error",
            text1: "Failed to fetch items",
            text2: errorData?.message || "An unexpected error occurred.",
          });
          return;
        }
  
        const itemsData = await response3.json();
        console.log("Items response:", itemsData);
  
        if (itemsData && itemsData.data) {
          const itemsWithTags = itemsData.data.map(item => ({
            ...item,
            tags: ["Promo", "Package", "Fast Food"] // Add the tags to each item
          }));
          setallItems(itemsWithTags); // Save to allItems state
          Toast.show({
            type: "success",
            text1: "Items fetched successfully",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "No items were returned.",
          });
        }

      } catch (error) {
        console.error("Error in getDeets: ", error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'An error occurred while fetching shops.',
        });
      } finally{
        setloading(false)
      }
    };

    getDeets();
  }, []);

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
                source={theme === "light" ? darkMenu : MenuIcon}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
              {theme === "light" ? (
                <Icon
                  name="sun"
                  color={theme === "light" ? "#000" : "#fff"}
                  size={24}
                />
              ) : (
                <Icon
                  name="moon"
                  color={theme === "light" ? "#fff" : "#fff"}
                  size={24}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Notification")}
              style={styles.iconButton}
            >
              <Icon
                name="bell"
                color={theme === "light" ? "#000" : "#fff"}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={loading} onRefresh={getDeets2}/>}>
          <View style={styles.IntroText}>
            <Text style={styles.headerTitle}>
              What would you like{"\n"}to order
            </Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Icon name="search" color="#666" size={20} /><Text>{" "}</Text>
              
              <TextInput
                style={styles.searchInput}
                placeholder="Find food or restaurant..."
                placeholderTextColor="#666"
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter" color="#DC2626" size={20} /> 
              
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>
                View All <Icon name="chevron-right" color="#DC2626" size={16} />
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} refreshControl={<RefreshControl refreshing={loading} onRefresh={getDeets2}/>}>
          {loading ? (
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', alignSelf: 'center'}}>
              <ActivityIndicator size={20} color="red"/>
            </View>
) : (
        randomItems.map((restaurant) => (
          <TouchableWithoutFeedback
            key={restaurant.item_id}
            onPress={() => navigation.navigate("FoodDetails", restaurant)}
          >
            <View style={styles.restaurantCard}>
              <TouchableOpacity style={styles.favoriteButton}>
                <Icon name="heart" color="#fff" size={20} />
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
                  {"₦"}
                  {restaurant.price && restaurant.price}
                  {" • "}
                  {"Free Delivery"}
                  {" • "}
                  {"10-15 Mins"}
                </Text>
                <View style={styles.mypricetags}>
                  <View style={styles.mypricetag}>
                    <Text style={styles.mypricetagText}>
                      {"₦"}
                      {restaurant.price && restaurant.price}
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
        ))
      )}
          </ScrollView>

          <Text style={[styles.sectionTitle, {paddingVertical: 20}]}>Spicy Menu</Text>

          <View style={styles.foodCourtGrid}>
      {allItems && allItems.length > 0 && (
        <FlatList
          data={allItems.slice(0, 2)}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2} // Enables the two-column grid layout
          columnWrapperStyle={styles.columnWrapper1} // Styling for each row in the grid
          renderItem={({ item: restaurant }) => (
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("FoodDetails", restaurant)}
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
                    <Text style={styles.restaurantName}>
                      {restaurant.name.length > 15
                        ? `${restaurant.name.slice(0, 15)}...`
                        : restaurant.name}
                    </Text>
                    {restaurant.isVerified && (
                      <View style={styles.verifiedBadge1}>
                        <Text style={styles.verifiedText1}>✓</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.bigpricetag}>
                    <Text style={styles.bigpricetagText}>
                      {"₦"}
                      {restaurant.price && restaurant.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      )}
    </View>


        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
