import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Bell } from "lucide-react-native";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import AppLoading from "expo-app-loading";
import { ThemeContext } from "../context/AuthContext";
import { ScrollView } from "react-native";

const { width } = Dimensions.get("window");

const ordersData = [
  {
    id: "264100",
    items: 2,
    estimatedTime: 15,
    status: "ongoing",
    restaurantName: "Chicken Republic",
    restaurantLogo: "https://indulgetix.com/tiva/1.png",
  },
  {
    id: "264101",
    items: 3,
    estimatedTime: 20,
    status: "ongoing",
    restaurantName: "Pizza Hut",
    restaurantLogo: "https://indulgetix.com/tiva/2.png",
  },
  {
    id: "264102",
    items: 1,
    estimatedTime: 10,
    status: "delivered",
    restaurantName: "Burger King",
    restaurantLogo: "https://indulgetix.com/tiva/3.png",
  },
  {
    id: "264101",
    items: 3,
    estimatedTime: 20,
    status: "ongoing",
    restaurantName: "Pizza Hut",
    restaurantLogo: "https://indulgetix.com/tiva/2.png",
  },
  {
    id: "264102",
    items: 1,
    estimatedTime: 10,
    status: "delivered",
    restaurantName: "Burger King",
    restaurantLogo: "https://indulgetix.com/tiva/3.png",
  },
];
const OrderCard = ({
  orderNumber,
  items,
  estimatedTime,
  status,
  onCancel,
  onTrack,
  theme,
}) => {
  const styles = getStyles(theme);
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.restaurantInfo}>
          <Image
            source={{ uri: "https://indulgetix.com/tiva/1.png" }}
            style={styles.restaurantLogo}
          />
          <View style={styles.orderDetails}>
            <Text style={styles.itemCount}>{items} Items</Text>
            <View style={styles.restaurantName}>
              <Text style={styles.restaurantText}>Chicken Republic</Text>
              <View style={styles.verifiedBadge} />
            </View>
          </View>
        </View>
        <Text style={styles.orderNumber}>#{orderNumber}</Text>
      </View>

      <View style={styles.estimatedTimeContainer}>
        <View>
          <Text style={styles.estimatedLabel}>Estimated Arrival</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeNumber}>{estimatedTime}</Text>
            <Text style={styles.timeUnit}>min</Text>
          </View>
        </View>
        <Text style={styles.statusText}>
          {status === "delivered" ? "Delivered" : "Food on the way"}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.trackButton} onPress={onTrack}>
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const OrdersScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "upcoming" && styles.activeTabText,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "history" && styles.activeTab]}
            onPress={() => setActiveTab("history")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "history" && styles.activeTabText,
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {ordersData.map((order,index) => (
            <OrderCard
              key={index}
              orderNumber={order.id}
              items={order.items}
              estimatedTime={order.estimatedTime}
              status={order.status}
              restaurantName={order.restaurantName}
              restaurantLogo={order.restaurantLogo}
              onCancel={() => console.log(`Cancel order ${order.id}`)}
              onTrack={() =>
                {
                  console.log(`Tracking ${order.id}`)
                navigation.navigate("TrackOrder", { orderId: order.id });
                }
              }
              theme={theme}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme === "light" ? "#FFFFFF" : "#101112",
    },
    container: {
      paddingTop: 20,
      flex: 1,
      backgroundColor: theme === "light" ? "#FFFFFF" : "#101112",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
    },
    headerTitle: {
      fontSize: 25,
      fontWeight: "bold",
      color: theme === "light" ? "#000" : "#fff",
      fontFamily: "Livvic_700Bold",
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    tab: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginRight: 10,
    },
    activeTab: {
      backgroundColor: "#DC2626",
    },
    tabText: {
      color: theme === "light" ? "#666" : "#999",
      fontSize: 16,
      fontFamily: "Livvic_400Regular",
    },
    activeTabText: {
      color: "#fff",
      fontFamily: "Livvic_700Bold",
    },
    content: {
      flex: 1,
      paddingHorizontal: 15,
      gap: 20,
    },
    orderCard: {
      backgroundColor: theme === "light" ? "#fff" : "#2A2A2A",
      borderRadius: 12,
      padding: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom:15
    },
    orderHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 15,
    },
    restaurantInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    restaurantLogo: {
      width: 40,
      height: 40,
      borderRadius: 8,
    },
    orderDetails: {
      marginLeft: 10,
    },
    itemCount: {
      fontSize: 14,
      color: theme === "light" ? "#666" : "#999",
      fontFamily: "Livvic_400Regular",
    },
    restaurantName: {
      flexDirection: "row",
      alignItems: "center",
    },
    restaurantText: {
      fontSize: 16,
      fontWeight: "600",
      marginRight: 5,
      color: theme === "light" ? "#000" : "#fff",
      fontFamily: "Livvic_700Bold",
    },
    verifiedBadge: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#22C55E",
    },
    orderNumber: {
      fontSize: 14,
      color: "#DC2626",
      fontFamily: "Livvic_400Regular",
    },
    estimatedTimeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    estimatedLabel: {
      fontSize: 14,
      color: theme === "light" ? "#666" : "#999",
      marginBottom: 5,
      fontFamily: "Livvic_400Regular",
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    timeNumber: {
      fontSize: 24,
      fontWeight: "bold",
      marginRight: 5,
      color: theme === "light" ? "#000" : "#fff",
      fontFamily: "Livvic_700Bold",
    },
    timeUnit: {
      fontSize: 16,
      color: theme === "light" ? "#666" : "#999",
      fontFamily: "Livvic_400Regular",
    },
    statusText: {
      fontSize: 16,
      color: theme === "light" ? "#666" : "#999",
      fontFamily: "Livvic_400Regular",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: "#DC2626",
      alignItems: "center",
    },
    cancelButtonText: {
      color: "#DC2626",
      fontSize: 16,
      fontWeight: "600",
      fontFamily: "Livvic_700Bold",
    },
    trackButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 25,
      backgroundColor: "#DC2626",
      alignItems: "center",
    },
    trackButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      fontFamily: "Livvic_700Bold",
    },
  });

export default OrdersScreen;
