import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  PanResponder,
  Dimensions,
} from "react-native";

import Icon from 'react-native-vector-icons/Feather'; // Import Feather icons from react-native-vector-icons

import { useFoodContext } from "../context/FoodContext";
import { ThemeContext } from "../context/AuthContext";
import * as Haptics from 'expo-haptics';

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 100 : 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function FoodDetailsScreen({ navigation, route }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const { addToCart } = useFoodContext();
  const { theme } = useContext(ThemeContext);
  const restaurant = route.params;
  const [item, setItem] = useState(null);
  const [textHidden, settextHidden] = useState(false);
  const { width } = Dimensions.get("window");

  const scrollY = useRef(new Animated.Value(0)).current;
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const dragOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setItem(restaurant);
  }, []);

  const handleAddToCart = () => {
    quantity > 0 && 
    addToCart({ ...item, quantity, selectedAddOns });
    navigation.navigate("MainTabs", {
      screen: "Cart",
    });
  };

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) => {
      const isSelected = prev.some((selected) => selected.name === addOn.name);
      if (isSelected) {
        return prev.filter((selected) => selected.name !== addOn.name);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx > 0) {
        swipeAnim.setValue(gestureState.dx);
      }
      
      if(gestureState.dx % 2 === 0){
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);    
      }    
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 150) {
        Animated.timing(swipeAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          handleAddToCart();
          setQuantity(0)
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Animated.timing(swipeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
          Animated.timing(dragOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }).start();
        });
      } else {
        Animated.spring(swipeAnim, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const styles = getStyles(theme,width);

  if (!item) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          style={[
            styles.headerBackground,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslate }],
            },
          ]} 
          source={{ uri: item.image }}
        />
      </Animated.View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" color={theme === 'light' ? '#000' : '#fff'} size={24} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{item.name}</Text>

          <View style={styles.ratingContainer}>
            <Icon name="star"   fill="#FFD700" color="#FFD700" size={16} />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>
              {" • "}
              {item.delivery && item.delivery.isFree
                ? "Free delivery"
                : "Paid delivery"}
              {" • "}
              {item.delivery && item.delivery.time}
            </Text>
          </View>
          <Text style={styles.description}>{item.description}</Text>

          <Text style={styles.price}>₦{item.price}</Text>

          <View style={styles.quantityContainer}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => { 
                  setQuantity(quantity - 1);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                }}
              >
                <Icon name="minus"   size={20} color={theme === "light" ? "#000" : "#fff"} />
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  setQuantity(quantity + 1);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                }}
              >
                <Icon name="plus"   size={20} color={theme === "light" ? "#000" : "#fff"} />
              </TouchableOpacity>
            </View>
          </View>
          {item.addOns && (
            <>
              <Text style={styles.sectionTitle}>Choice of Add On</Text>
              <View style={styles.addOnContainer}>
                {item.addOns.map((addOn, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.addOnItem,
                      selectedAddOns.some(
                        (selected) => selected.name === addOn.name,
                      ) && styles.selectedAddOn,
                    ]}
                    onPress={() => toggleAddOn(addOn)}
                  >
                    <Text style={styles.addOnName}>{addOn.name}</Text>
                    <Text style={styles.addOnPrice}>+₦{addOn.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View
          style={[
            styles.swipeButton,
            {
              transform: [
                {
                  translateX: swipeAnim.interpolate({
                    inputRange: [0, 200],
                    outputRange: [0, width*0.42],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Icon name="shopping-bag"  size={24} color="#DC2626" />
        </Animated.View>
        <View style={styles.swipeTrack}>
          {!textHidden &&
            <Text style={styles.swipeText}>Swipe to add to cart</Text>
          }
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme,width) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "light" ? "#FFFFFF" : "#101112",
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: "#DC2626",
      overflow: "hidden",
      zIndex: 1,
    },
    headerBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      width: null,
      height: HEADER_MAX_HEIGHT,
      resizeMode: "cover",
    },
    scrollViewContent: {
      paddingTop: HEADER_MAX_HEIGHT,
    },
    backButton: {
      position: "absolute",
      top: Platform.OS === "ios" ? 50 : 30,
      left: 15,
      zIndex: 2,
      padding: 5,
      borderRadius: 20,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme === "light" ? "#000" : "#fff",
      marginBottom: 10,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    selectedAddOn: {
      borderWidth: 2,
      borderColor: "#DC2626",
    },
    rating: {
      color: theme === "light" ? "#000" : "#fff",
      marginLeft: 5,
      marginRight: 5,
    },
    reviews: {
      color: "#666",
    },
    price: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#DC2626",
      marginVertical: 15,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme === "light" ? "#000" : "#fff",
      marginBottom: 15,
    },
    description: {
      color: theme === "light" ? "#000" : "#fff",
      marginVertical:15
    },
    quantityContainer: {
      marginBottom: 20,
    },
    quantityControls: {
      flexDirection: "row",
      alignItems: "center",
    },
    quantityButton: {
      backgroundColor: theme === "light" ? "#F0F0F0" : "#2A2A2A",
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    quantity: {
      color: theme === "light" ? "#000" : "#fff",
      fontSize: 18,
      marginHorizontal: 20,
    },
    addOnContainer: {
      gap: 10,
    },
    addOnItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme === "light" ? "#F0F0F0" : "#2A2A2A",
      padding: 15,
      borderRadius: 8,
    },
    addOnName: {
      color: theme === "light" ? "#000" : "#fff",
    },
    addOnPrice: {
      color: "#DC2626",
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      paddingBottom: 50,
      paddingHorizontal: width * 0.2,
      borderTopColor: theme === "light" ? "#E0E0E0" : "#2A2A2A",
    }, 
    swipeButton: {
      position: "absolute",
      left: width * 0.22,
      bottom: 60,
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
    swipeTrack: {
      height: 70,
      backgroundColor: "#DC2626",
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: 15,
    },
    swipeText: {
      color: "#fff",
      fontSize: width < 400 ? 13 : 15,
      fontWeight: "bold",
      paddingRight: 15,
    },
  });
