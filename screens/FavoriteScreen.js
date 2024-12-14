import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { ChevronLeft, Bell, Heart, Star } from "lucide-react-native";
import { useFoodContext } from "../context/FoodContext";
import { ThemeContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFoodContext();
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("Food Items");
  const isDarkTheme = theme === "dark";

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const favoriteItems = [
    {
      id: 1,
      name: "Chicken Republic Refuel",
      image: "http://172.20.10.2/tiva/1.png",
      rating: 4.5,
      price: 8000,
      isVerified: true,
      delivery: {
        isFree: true,
        time: "10-15 mins"
      },
      tags: ["Promo", "Package", "Fast Food"]
    },
    {
      id: 2,
      name: "Urban Bites",
      image: "http://172.20.10.2/tiva/2.png",
      rating: 4.5,
      price: 8000,
      isVerified: false,
      delivery: {
        isFree: true,
        time: "15-20 mins"
      },
      addOns: [
        { name: 'Extra Chicken', price: 1200 },
        { name: 'Salad', price: 500 },
      ],
      tags: ["Yam"]
    }
  ];

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkTheme ? "#101112" : "#fff",
    },
    text: {
      color: isDarkTheme ? "#fff" : "#000",
      fontFamily: "Poppins_400Regular",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: "Poppins_700Bold",
      color: isDarkTheme ? "#fff" : "#000",
    },
    tabs: {
      flexDirection: "row",
      padding: 8,
      marginTop:20,
      marginHorizontal: 16,
      backgroundColor: isDarkTheme ? "#1A1B1E" : "#F5F5F5",
      borderRadius: 50,
      marginBottom: 16,
    },
    tab: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: 50,
    },
    activeTab: {
      backgroundColor: "#DC2626",
    },
    tabText: {
      fontFamily: "Livvic_400Regular",
      color: isDarkTheme ? "#fff" : "#000",
    },
    activeTabText: {
      color: "#fff",
      fontFamily: "Livvic_700Bold",
    },
    card: {
      backgroundColor: isDarkTheme ? "#1A1B1E" : "#fff",
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 16,
      overflow: "hidden",
    },
    cardImage: {
      width: "100%",
      height: 200,
      resizeMode: "cover",
    },
    cardContent: {
      padding: 16,
    },
    rating: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    ratingText: {
      marginLeft: 4,
      color: "#FFB800",
      fontFamily: "Poppins_700Bold",
    },
    itemTitle: {
      fontSize: 18,
      marginBottom: 4,
      fontFamily: "Poppins_700Bold",
      color: isDarkTheme ? "#fff" : "#000",
    },
    itemDescription: {
      color: isDarkTheme ? "#9CA3AF" : "#6B7280",
      fontFamily: "Poppins_400Regular",
    },
    heartButton: {
      position: "absolute",
      right: 12,
      top: 12,
      backgroundColor: "#fff",
      borderRadius: 50,
      padding: 8,
    },
    priceText: {
      fontFamily: "Poppins_700Bold",
      fontSize: 16,
      color: isDarkTheme ? "#fff" : "#000",
      marginTop: 8,
    },
    tagContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
    },
    tag: {
      backgroundColor: isDarkTheme ? "#2A2B2E" : "#F3F4F6",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      fontFamily: "Poppins_400Regular",
      fontSize: 12,
      color: isDarkTheme ? "#9CA3AF" : "#6B7280",
    },
    deliveryInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    deliveryText: {
      fontFamily: "Poppins_400Regular",
      fontSize: 14,
      color: isDarkTheme ? "#9CA3AF" : "#6B7280",
      marginLeft: 4,
    },
  });

  const renderFavoriteItem = ({ item }) => (
    <View style={dynamicStyles.card}>
      <Image
        source={{ uri: item.image }}
        style={dynamicStyles.cardImage}
      />
      <TouchableOpacity style={dynamicStyles.heartButton}>
        <Heart fill="#DC2626" color="#DC2626" size={20} />
      </TouchableOpacity>
      <View style={dynamicStyles.cardContent}>
        <View style={dynamicStyles.rating}>
          <Star fill="#FFB800" color="#FFB800" size={16} />
          <Text style={dynamicStyles.ratingText}>{item.rating}</Text>
          <Text style={[dynamicStyles.text, { marginLeft: 4 }]}>
            (25+ ratings)
          </Text>
        </View>
        <Text style={dynamicStyles.itemTitle}>{item.name}</Text>
        <Text style={dynamicStyles.priceText}>₦{item.price.toLocaleString()}</Text>
        <View style={dynamicStyles.tagContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={dynamicStyles.tag}>
              <Text style={dynamicStyles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={dynamicStyles.deliveryInfo}>
          <Text style={dynamicStyles.deliveryText}>
            {item.delivery.isFree ? "Free Delivery" : "Paid Delivery"} • {item.delivery.time}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      

      <View style={dynamicStyles.tabs}>
        {["Food Items", "Resturents"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              dynamicStyles.tab,
              activeTab === tab && dynamicStyles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                dynamicStyles.tabText,
                activeTab === tab && dynamicStyles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={favoriteItems}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </SafeAreaView>
  );
}