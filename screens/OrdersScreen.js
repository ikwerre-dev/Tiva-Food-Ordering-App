import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  RefreshControl,
  Alert,
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import jwt_decode from 'jwt-decode'
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import AppLoading from '../components/Loader';
import { ThemeContext } from "../context/AuthContext";
import { ScrollView } from "react-native";
import { BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

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
  cancelingOrders,
  cancelOrder,
  theme,
  restaurantLogo,
  price,
  restaurantName,
}) => {
  const styles = getStyles(theme);
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.restaurantInfo}>
          <Image
            source={{ uri: restaurantLogo }}
            style={styles.restaurantLogo}
          />
          <View style={styles.orderDetails}>
            <Text style={styles.itemCount}>{items} Item(s)</Text>
            <View style={styles.restaurantName}>
              <Text style={styles.restaurantText}>{restaurantName}</Text>
              <View style={styles.verifiedBadge} />
            </View>
          </View>
        </View>
        <Text style={styles.orderNumber}>#{orderNumber}</Text>
      </View>

      <View style={styles.estimatedTimeContainer}>
        <View>
          <Text style={styles.estimatedLabel}>Price</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeNumber}>N </Text>
            <Text style={styles.timeNumber}>{price}</Text>
          </View>
        </View>
        <Text style={styles.statusText}>
          {status === "ongoing" || status === "waiting" 
            ? "Food on the way" 
            : status === "canceled" 
            ? "Canceled" 
            : "Delivered"}
        </Text>

      </View>

      {status === "ongoing" || status === "waiting" && (
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => cancelOrder(orderNumber)} disabled={cancelingOrders[orderNumber]}>
          <Text style={styles.cancelButtonText}>{cancelingOrders[orderNumber] ? "Cancelling..." : "Cancel"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.trackButton} onPress={onTrack}>
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>
      </View>
      )}
    </View>
  );
};

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { theme } = useContext(ThemeContext);
  const [orders, setOrders] = useState([])
  const [cancelingOrders, setcancelingOrders] = useState({})
  const [loading, setloading] = useState(true)
  const styles = getStyles(theme);
  const navigation = useNavigation()

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Livvic_400Regular,
    Livvic_700Bold,
  });

  const fetchOrderedItems = async () => {
    setloading(true)
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn("No token found in storage");
        return;
      }

      const decodedToken = jwt_decode(token);
      if (!decodedToken || !decodedToken.userid) {
        console.warn("Invalid token structure");
        return;
      }

      const { userid } = decodedToken;

      // Fetch ordered items from backend using user_id from token
      const response = await fetch(`${BASE_URL}/ordered_items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userid }),  // Send user_id in the request body
      });

      if (!response.ok) {
        console.log("Failed to fetch ordered items");
        return;
      }

      const data = await response.json();

      if (data.status === 200) {
        setOrders(data.data);  // Assuming backend sends an array of ordered items
      } else {
        console.log("Failed to retrieve ordered items:", data.message);
      }
    } catch (error) {
      console.error("Error fetching ordered items:", error);
    } finally {
      setloading(false);  // Hide loading indicator after the request completes
    }
  };

  useEffect(() => {
    fetchOrderedItems();
  }, []);

  const cancelOrder = async (orderId) => {
    setcancelingOrders((prev) => ({ ...prev, [orderId]: true }));
    try {
      console.log("ORder: ", orderId)
      const token = await AsyncStorage.getItem("token")
      const decodedToken = await jwt_decode(token)
      const {userid} = decodedToken
      const response = await fetch(`${BASE_URL}/cancel_order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userid,
          order_id: orderId,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Remove the canceled order from the orders array
        console.log("Data: ", data)
        setOrders((prevOrders) =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: "canceled" } : order
          )
        );
        
        Alert.alert('Order canceled successfully');
      } else {
        Alert.alert(`Error: ${data.error}`);
      }
    } catch (error) {
      Alert.alert('Failed to cancel order. Please try again.');
      console.error('Cancel order error:', error);
    } finally {
      // Reset canceling state for this order
      setcancelingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  };
  

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

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchOrderedItems} // Trigger the fetch function when user pulls to refresh
            />
          }
        >
          {orders.length > 0 && !loading ? (
            // Filter orders based on activeTab
            orders
              .filter((order) => 
                activeTab === 'history' 
                  ? order.status === 'delivered' || order.status === 'canceled' // Show only delivered orders for history
                  : order.status === 'waiting' || order.status === 'ongoing' // Show waiting or ongoing orders for upcoming
              )
              .map((order, index) => (
                <OrderCard
                  key={index}
                  re={order.name}
                  address={order.item_description.address}
                  orderNumber={order.id}
                  items={order.quantity}
                  restaurantName={order.item_name}
                  estimatedTime={'30'}
                  restaurantLogo={order.item_description.image}
                  price={order.price}
                  cancelOrder={cancelOrder}
                  status={order.status}
                  cancelingOrders={cancelingOrders}
                  onTrack={async () => {
                    console.log("Tracking order: ", order)
                    const main = async () => {
                      try {
                        const response = await fetch(`${BASE_URL}/get_driver_phone`, {
                          method: "POST",
                          body: JSON.stringify({
                            order_id: order.order_id
                          }),
                          headers: {
                            "Content-Type": "application/json"
                          }
                        })
                        if (!response.ok) {
                          throw new Error(`Error fetching driver phone: ${response.statusText}`);
                        }
                    
                        const data = await response.json();
                    
                        // Handle the response data (assuming the phone number is in data.phone_number)
                        if (data.phone_number) {
                          console.log("Driver Phone Number: ", data.phone_number);
                          // Do something with the phone number, like display it in the UI
                        } else {
                          console.log("Driver phone number not found.");
                        }
                      } catch (error) {
                        console.error("Error: ", error)
                      }
                    }

                    await main()
                    // navigation.navigate("TrackOrder", {orderId: order.id})
                  }}
                />
              ))
          ) : (
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {loading ? (
                <Text style={{ fontFamily: 'Livvic_700Bold', fontSize: 16, textAlign: 'center' }}>
                  Loading orders...
                </Text>
              ) : (
                <Text style={{ fontFamily: 'Livvic_700Bold', fontSize: 16, textAlign: 'center' }}>
                  No orders found.
                </Text>
              )}
            </View>
          )}


          {/* {ordersData.map((order,index) => (
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
          ))} */}
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
      marginBottom:10,
      marginTop:10,
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
      borderRadius: 20,
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
