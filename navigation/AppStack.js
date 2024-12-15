import React, { useContext } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Home, ShoppingBag, Heart, Compass, Wallet } from "lucide-react-native";
import { ThemeContext } from "../context/AuthContext";
import * as Haptics from "expo-haptics";

// Import screens
import HomeScreen from "../screens/DashboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CartScreen from "../screens/CartScreen";
import FoodDetailsScreen from "../screens/FoodDetailsScreen";
import ReviewsScreen from "../screens/ReviewsScreen";
import SideMenuScreen from "../screens/SideMenuScreen";
import OrdersScreen from "../screens/OrdersScreen";
import TrackOrderScreen from "../screens/TrackOrderScreen";
import FavoritesScreen from "../screens/FavoriteScreen";
import { useFoodContext } from "../context/FoodContext";
import Profile from "../screens/ProfileScreen";
import AddNewAddress from "../screens/DeliveryAddress";
import PaymentMethod from "../screens/PaymentMethod";
import NotificationScreen from "../screens/Notification";
import CallScreen from "../screens/CallScreen";
import WalletScreen from "../screens/WalletScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  const { theme } = useContext(ThemeContext);
  const { cart, removeFromCart } = useFoodContext();

  const isDarkTheme = theme === "dark";

  const styles = StyleSheet.create({
    tabBar: {
      backgroundColor: isDarkTheme ? "#1A1A1A" : "#FFFFFF",
      borderTopWidth: 0,
      height: Platform.OS === "android" ? 60 : 90, // Dynamic height for Android and iPhone
      paddingBottom: Platform.OS === "android" ? 10 : 20, // Adjust padding for consistency
      paddingHorizontal: 20,
    },
    tabBarBadge: {
      backgroundColor: "#DC2626",
      color: "#FFFFFF",
      fontSize: 12,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      paddingHorizontal: 6,
      textAlign: "center",
      lineHeight: 18,
      position: "absolute",
      top: -8,
      right: -12,
    },
    tabBarIcon: {
      marginTop: 26, // Increased from 5 to 10
    },
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          const iconSize = 28; // Increased from 28 to 32
          let icon;

          switch (route.name) {
            case "Home":
              icon = (
                <View style={styles.tabBarIcon}>
                  <Home
                    size={iconSize}
                    color={
                      focused ? "#DC2626" : isDarkTheme ? "#9CA3AF" : "#6B7280"
                    }
                  />
                </View>
              );
              break;
            case "Cart":
              icon = (
                <View style={styles.tabBarIcon}>
                  <ShoppingBag
                    size={iconSize}
                    color={
                      focused ? "#DC2626" : isDarkTheme ? "#9CA3AF" : "#6B7280"
                    }
                  />
                  {cart && cart.length > 0 && (
                    <View style={styles.tabBarBadge}>
                      <Text style={{ color: "#FFFFFF" }}>{cart.length}</Text>
                    </View>
                  )}
                </View>
              );
              break;
            case "Favorites":
              icon = (
                <View style={styles.tabBarIcon}>
                  <Heart
                    size={iconSize}
                    color={
                      focused ? "#DC2626" : isDarkTheme ? "#9CA3AF" : "#6B7280"
                    }
                    fill={focused ? "#DC2626" : "none"}
                  />
                </View>
              );
              break;
            case "Orders":
              icon = (
                <View style={styles.tabBarIcon}>
                  <Compass
                    size={iconSize}
                    color={
                      focused ? "#DC2626" : isDarkTheme ? "#9CA3AF" : "#6B7280"
                    }
                  />
                </View>
              );
              break;
            case "Wallet":
              icon = (
                <View style={styles.tabBarIcon}>
                  <Wallet
                    size={iconSize}
                    color={
                      focused ? "#DC2626" : isDarkTheme ? "#9CA3AF" : "#6B7280"
                    }
                  />
                </View>
              );
              break;
          }
          return icon;
        },
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: isDarkTheme ? "#1A1A1A" : "#FFFFFF",
        },
        headerTintColor: isDarkTheme ? "#FFFFFF" : "#000000",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      {/* <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      /> */}
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppStack() {
  const { theme } = useContext(ThemeContext);
  const isDarkTheme = theme === "dark";

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkTheme ? "#1A1A1A" : "#FFFFFF",
        },
        headerTintColor: isDarkTheme ? "#FFFFFF" : "#000000",
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FoodDetails"
        component={FoodDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TrackOrder"
        component={TrackOrderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeliveryAddress"
        component={AddNewAddress}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethod}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CallScreen"
        component={CallScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
