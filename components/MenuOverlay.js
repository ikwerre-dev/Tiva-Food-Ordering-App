import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import {
  ShoppingBag,
  User,
  MapPin,
  CreditCard,
  Sun,
  Moon,
  Star,
  LogOut,
  Bell,
  Heart,
} from "lucide-react-native";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import AppLoading from '../components/Loader';
import { AuthContext, ThemeContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";

const { width } = Dimensions.get("window");

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: "70%",
      backgroundColor: theme === "light" ? "#FFFFFF" : "#000000",
      zIndex: 1000,
    },
    content: {
      flex: 1,
      padding: 20,
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    profileSection: {
      alignItems: "flex-start",
      marginTop: 40,
      marginBottom: 50,
    },
    profileImageContainer: {
      width: 80,
      height: 80,
      borderRadius: 60,
      backgroundColor: theme === "light" ? "#F0F0F0" : "#121212",
      padding: 1,
      marginBottom: 20,
    },
    profileImage: {
      width: "100%",
      height: "100%",
      borderRadius: 60,
    },
    profileName: {
      color: theme === "light" ? "#000000" : "#FFFFFF",
      fontSize: 25,
      fontWeight: "bold",
      marginBottom: 8,
      fontFamily: "Livvic_700Bold",
    },
    profileEmail: {
      color: "#666",
      fontSize: 16,
      fontFamily: "Livvic_400Regular",
    },
    menuItems: {
      flex: 1,
      gap: 25,
      paddingBottom:50
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    menuIconContainer: {
      width: 40,
      justifyContent: "center",
    },
    menuItemText: {
      fontSize: 18,
      marginLeft: 15,
      fontFamily: "Livvic_400Regular",
    },
    logoutButton: {
      marginBottom: 30,
      paddingTop:15
    },
    logoutContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#DC2626",
      padding: 16,
      borderRadius: 30,
      gap: 10,
      
    },
    logoutText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
      fontFamily: "Livvic_400Regular",
    },
  });

export default function MenuOverlay({ isOpen, onClose, translateX }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

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

  const handleNavigation = (screenName) => {
    onClose();
    navigation.navigate(screenName);
  };

  const MenuItem = ({ icon: Icon, title, onPress, color }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Icon color={color} size={24} />
      </View>
      <Text style={[styles.menuItemText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  const menuItems = [
    { icon: ShoppingBag, title: "My Orders", screen: "Orders" },
    { icon: User, title: "My Profile", screen: "Profile" },
    { icon: CreditCard, title: "Payment Methods", screen: "PaymentMethods" },
    { icon: Bell, title: "Notification", screen: "Notification" },
    { icon: Heart, title: "My Favorites", screen: "Favorites" },
    { icon: MapPin, title: "Delivery Address", screen: "DeliveryAddress" },
    {
      icon: theme === "light" ? Moon : Sun,
      title: `${theme === "light" ? "Dark" : "Light"} Mode`,
      onPress: toggleTheme,
    },
  ];

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=3" }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>Robinson Honour</Text>
          <Text style={styles.profileEmail}>investorhonour@gmail.com</Text>
        </View>

        <ScrollView>
          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                title={item.title}
                onPress={item.onPress || (() => handleNavigation(item.screen))}
                color={theme === "light" ? "#000000" : "#FFFFFF"}
              />
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutContent}>
            <LogOut color="#FFFFFF" size={24} />
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
