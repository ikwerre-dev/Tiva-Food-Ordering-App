import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { ChevronLeft, X } from "lucide-react-native";
import { useFoodContext } from "../context/FoodContext";
import { ThemeContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart } = useFoodContext();
  const { theme } = useContext(ThemeContext);

  const isDarkTheme = theme === "dark";

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: isDarkTheme ? "#101112" : "#fff",
    },
    text: {
      color: isDarkTheme ? "#fff" : "#000",
    },
    sectionTitle: {
      color: isDarkTheme ? "#fff" : "#333",
    },
    paymentBorder: {
      borderColor: isDarkTheme ? "#333" : "#bbb",
      borderWidth: 0.51,
    },
    itemBackground: {
      backgroundColor: isDarkTheme ? "#2A2A2A" : "#f9f9f9",
    },
    borderBottom: {
      borderBlockColor: isDarkTheme ? "#2A2A2A" : "#f9f9f9",
      borderBottomWidth: 1,
      paddingBottom: 4,
    },
    checkoutButton: {
      backgroundColor: "#DC2626",
      padding: 15,
      borderRadius: 25,
      alignItems: "center",
    },
  });
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Livvic_400Regular,
    Livvic_700Bold,
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Calculate the subtotal, tax, and total dynamically
  const subtotal = cart.reduce((sum, item) => {
    const addOnsTotal = item.selectedAddOns
      ? item.selectedAddOns.reduce(
          (addOnSum, addOn) => addOnSum + addOn.price,
          0,
        )
      : 0;
    return sum + item.price * item.quantity + addOnsTotal;
  }, 0);
  const taxAndFees = subtotal * 0.01; // 5% tax
  const totalitems = cart.length;
  const deliveryBase = 750;
  const delivery = totalitems == 0 ? 0 : totalitems > 5 ? deliveryBase * 2 : deliveryBase; const total = subtotal + taxAndFees + delivery;
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={isDarkTheme ? "#fff" : "#000"} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, dynamicStyles.text]}>Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {cart.map((item, index) => (
          <View
            key={index}
            style={[
              { marginBottom: 20 },
              { borderRadius: 12 },
              dynamicStyles.itemBackground,
            ]}
          >
            <View style={[styles.cartItem, dynamicStyles.itemBackground]}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, dynamicStyles.text]}>
                  {item.name}
                </Text>
                <Text style={styles.itemPrice}>₦{item.price}</Text>
              </View>
              <View style={styles.itemQuantity}>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <X color="#DC2626" size={20} />
                </TouchableOpacity>
                <Text style={[styles.quantityText, dynamicStyles.text]}>
                  {item.quantity}
                </Text>
              </View>
            </View>
            <View>
              {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                <View style={styles.addOnsContainer}>
                  <Text style={[styles.addOnsTitle, dynamicStyles.text]}>
                    Add-ons:
                  </Text>
                  {item.selectedAddOns.map((addOn, addOnIndex) => (
                    <Text
                      key={addOnIndex}
                      style={[styles.addOnItem, dynamicStyles.text]}
                    >
                      {addOn.name} (+₦{addOn.price})
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}

        <View>
          <View style={[styles.section, dynamicStyles.borderBottom]}>
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>
              Subtotal
            </Text>
            <Text style={[styles.sectionValue, dynamicStyles.text]}>
              ₦{subtotal}
            </Text>
          </View>
          <View style={[styles.section, dynamicStyles.borderBottom]}>
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>
              Tax and Fees
            </Text>
            <Text style={[styles.sectionValue, dynamicStyles.text]}>
              ₦{taxAndFees}
            </Text>
          </View>
          <View style={[styles.section, dynamicStyles.borderBottom]}>
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>
              Delivery
            </Text>
            <Text style={[styles.sectionValue, dynamicStyles.text]}>
              ₦{delivery}
            </Text>
          </View>
          <View style={[styles.section, dynamicStyles.borderBottom]}>
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>
              Total ({totalitems} items)
            </Text>
            <Text style={[styles.sectionValue, dynamicStyles.text]}>
              ₦{total}
            </Text>
          </View>
          <View style={[styles.section, dynamicStyles.borderBottom]}>
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>
              Delivery Details
            </Text>
            <View style={styles.deliveryDetails}>
              <Text style={[styles.deliveryAddress, dynamicStyles.text]}>
                7, Sasebon street, GRA, Ikeja
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentMethod}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, {paddingBottom:10}]}>
            Payment Method
          </Text>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              dynamicStyles.paymentBorder,
              paymentMethod === "card" ? styles.selectedOption : null,
            ]}
            onPress={() => handlePaymentMethodChange("card")}
          >
            <Text style={[styles.paymentOptionText, dynamicStyles.text]}>
              Card
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              dynamicStyles.paymentBorder,
              paymentMethod === "wallet" ? styles.selectedOption : null,
            ]}
            onPress={() => handlePaymentMethodChange("wallet")}
          >
            <Text style={[styles.paymentOptionText, dynamicStyles.text]}>
              Wallet
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={dynamicStyles.checkoutButton}>
          <Text style={[styles.checkoutButtonText]}>CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101112",
  },

  section: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deliveryDetails: {
    marginTop: 10,
  },
  deliveryAddress: {
    fontSize: 16,
  },
  noteForRider: {
    fontSize: 16,
    color: "#666",
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  paymentOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  selectedOption: {
    borderColor: "#DC2626",
    borderWidth: 0.5,
    color: "#fff",
  },
  paymentOptionText: {
    fontSize: 16,
  },
  addOnsContainer: {
    marginTop: 0,
    flexDirection: "column",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingBottom: 15,
    marginBottom: 0,
    gap: 5,
  },
  addOnsTitle: {
    fontSize: 14,
    fontFamily: "Livvic_700Bold",
    fontWeight: "bold",
    marginBottom: 2,
  },
  addOnItem: {
    fontSize: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    // paddingTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Livvic_700Bold",
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  itemName: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Livvic_400Regular",
    marginBottom: 5,
  },
  itemPrice: {
    color: "#DC2626",
    fontSize: 16,
    fontFamily: "Livvic_700Bold",
    fontWeight: "bold",
  },
  itemQuantity: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 5,
  },
  quantityText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Livvic_400Regular",
  },
  summaryContainer: {
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  summaryLabel: {
    color: "#666",
  },
  summaryValue: {
    color: "#fff",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingTop: 15,
  },
  totalLabel: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Livvic_400Regular",
    fontWeight: "bold",
  },
  totalValue: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Livvic_400Regular",
    fontWeight: "bold",
  },
  deliveryDetails: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Livvic_400Regular",
    fontWeight: "bold",
    marginBottom: 10,
  },
  address: {
    color: "#666",
  },
  paymentMethod: {
    marginBottom: 30,
  },
  paymentOption: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentOptionText: {
    
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  checkoutButton: {
    backgroundColor: "#DC2626",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    color: "white",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Livvic_700Bold",
    fontWeight: "bold",
  },
});
