import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { useFoodContext } from "../context/FoodContext";
import { ThemeContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native";
import { useFonts } from "expo-font";
import * as Location from 'expo-location'
import AppLoading from '../components/Loader';
import jwt_decode from 'jwt-decode'

import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import cartImage from "../assets/cart.png";
import { BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeliveryAddressInput from "../components/DeliveryAddressSet";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Toast from "react-native-toast-message";

export default function CartScreen() {
  const { cart, removeFromCart,clearCart } = useFoodContext();
  const { theme } = useContext(ThemeContext);
  const [modalVisible2, setModalVisible2] = useState(false);
  const navigation = useNavigation()
  const [sending, setSending] = useState(false)
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
  const [modalVisible, setModalVisible] = useState(false);
  const [noteForRider, setNoteForRider] = useState("");
  const [address, setAddress] = useState({
    latitude: null,
    longitude: null,
    address: ""
  })

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
  const taxAndFees = subtotal * 0.05; // 5% tax
  const totalitems = cart.length;
  const deliveryBase = 1000;
  const delivery =
    totalitems == 0 ? 0 : totalitems > 2 ? parseFloat(((deliveryBase * 6.5)/totalitems).toPrecision(2)) : deliveryBase;
  const total = subtotal + taxAndFees + delivery;
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCheckout = () => {
    setModalVisible(true);
  };

  const handleAddressSelection = (location) => {
    console.log("Selected Address:", location.address);
    console.log("Latitude:", location.latitude);
    console.log("Longitude:", location.longitude);
    
    // Update the state with the selected address and its lat/lng
    setAddress({
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address
    });
  };
  
  
  
  const handleConfirmCheckout = async () => {
    setSending(true)
    try {
      let balance = 0;
    if (paymentMethod === "wallet"){
      const token = await AsyncStorage.getItem("token")
      const decodedToken = jwt_decode(token)
      const {userid} = decodedToken

      try {
        const balanceResponse = await fetch(`${BASE_URL}/fetch_balance`, {
          method: "POST",
          body: JSON.stringify({ user_id: userid }),
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (!balanceResponse.ok) {
          console.log("Failed to fetch balance");
        } else {
          const balanceData = await balanceResponse.json();
          if (balanceData.status === 200) {
            console.log("User balance: ", balanceData.balance);
            balance = balanceData.balance
          } else {
            console.log("Failed to retrieve balance: ", balanceData.message);
          }
        }
      } catch (error) {
        console.error("Error: ", error)
      }
      if (balance <= 0 || balance < total){
        Toast.show({
          text1: "Insufficient balance",
          text2: "Please top up your wallet balance or pay with another medium",
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
          type: 'error'
        })
        return
      } else {
        console.log("balance can carry");
        try {
          const response = await fetch(`${BASE_URL}/order/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              cart: cart,
              userId: userid,
              latitude: address.latitude,
              longitude: address.longitude
            })
          });
      
          // Check if the request was successful
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Order failed: ", errorData.message);
            Alert.alert(`Order failed: ${errorData.message}`); // Show error message to the user
            return;
          }
      
          // Parse the response
          const responseData = await response.json();
          console.log("Order placed successfully: ", responseData);
      
          // Optionally, you can navigate the user to an order confirmation page or clear the cart
          Alert.alert("Order placed successfully!");
          const main_amount = parseFloat(balance) - parseFloat(total)
          try {
            const setBalResponse = await fetch(`${BASE_URL}/set_balance`, {
              method: "POST",
              body: JSON.stringify({
                user_id: userid,
                amount: main_amount,
                debit_amount: parseFloat(total)
              }), 
              headers: {
                "Content-Type": "application/json"
              }
            });
          
            if (!setBalResponse.ok) {
              console.log("SET: ", setBalResponse)
              console.log("SS: ", await setBalResponse.json())
              throw new Error(`Failed to set balance: ${setBalResponse.statusText}`);
            }
          
            const responseData = await setBalResponse.json();
            console.log("Balance updated successfully:", responseData);
            await clearCart()

          
            // Handle response data (if needed)
            return responseData;
          } catch (error) {
            console.error("Error updating balance:", error);
          
            // Handle error (e.g., show an alert or return an error response)
            return { success: false, message: error.message };
          }
          
          return
        } catch (error) {
          console.error("Error occurred when checking out: ", error);
          alert("An error occurred while placing the order. Please try again.");
        }
        return;
      }
      
    }
    else if (paymentMethod === "card"){
      console.log("Card payment")
      Toast.show({
        text1: "Card payment not finished",
        text2: "Payment API required from team",
        position: 'top',
        autoHide: true,
        visibilityTime: 3000
      })
      return
    }
    
    navigation.navigate("TrackOrder",2345);
    } catch (error) {
      console.log("Error: ", error)
    } finally{
      setModalVisible(false)
      setSending(false)
    }
  };
  const [noteForRestaurant, setNoteForRestaurant] = useState("");

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={[styles.modalContent, dynamicStyles.itemBackground]}>
              <Text style={[styles.modalTitle, dynamicStyles.text]}>
                Note to Restaurant
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  dynamicStyles.text,
                  dynamicStyles.paymentBorder,
                ]}
                placeholder="Add a note to the restaurant..."
                placeholderTextColor={isDarkTheme ? "#666" : "#999"}
                value={noteForRestaurant}
                onChangeText={setNoteForRestaurant}
                multiline
                numberOfLines={4}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleConfirmCheckout}
                disabled={sending}
              >
                {sending ? (
                  <ActivityIndicator color='white' size={21}/>
                ) : (
                  <Text style={styles.modalButtonText}>Okay!</Text>
                )
                }
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  const handleExplore = () => {
    navigation.navigate("Home"); // Replace "Explore" with your desired route name
  };
  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, dynamicStyles.text]}>Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {totalitems > 0 ? (
          <>
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
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, dynamicStyles.text]}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemPrice}>₦{item.price}</Text>
                  </View>
                  <View style={styles.itemQuantity}>
                    <TouchableOpacity onPress={() => removeFromCart(item.item_id)}>
                      <Icon name="x" color="#DC2626" size={20} />
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
              <View style={[styles.section2, dynamicStyles.borderBottom, {
                marginBottom: 20
              }]}>
                <Text style={[styles.sectionTitle, dynamicStyles.text, {
                  paddingTop: 10
                }]}>
                  Delivery Details
                </Text>
                <TouchableOpacity style={{
                  width: '60%',
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: 'red',
                }} onPress={() => setModalVisible2(true)}>
                  <Text style={{color: 'white', fontSize: 15, fontFamily: "Livvic_700Bold", textAlign: 'center'}}>Set Delivery Address</Text>
                </TouchableOpacity>
              </View>
              {address !== null && (
                <Text style={{
                  textAlign: 'center',
                  fontFamily: "Livvic_700Bold",
                  paddingBottom: 15,
                  fontSize: 16
                }}>{address?.address}</Text>
              )}
            </View>

            <View style={styles.paymentMethod}>
              <Text
                style={[
                  styles.sectionTitle,
                  dynamicStyles.sectionTitle,
                  { paddingBottom: 10 },
                ]}
              >
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
                <View
                  style={[
                    styles.circle,
                    paymentMethod === "card" ? styles.selectedOption : null,
                    paymentMethod === "card" ? {backgroundColor: '#DC2626'} : null,
                  ]}
                ></View>
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
                <View
                  style={[
                    styles.circle,
                    paymentMethod === "wallet" ? styles.selectedOption : null,
                    paymentMethod === "wallet" ? {backgroundColor: '#DC2626'} : null,
                    
                  ]}
                ></View>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyCartContainer}>
            <Image
              source={cartImage}
              style={styles.emptyCartImage}
            />
            <Text style={[styles.emptyCartText, dynamicStyles.text]}>
              Your Cart is Empty
            </Text>
          </View>
        )}
      </ScrollView>

      {totalitems > 0 && (
        <View style={styles.footer}>
         <TouchableOpacity
          style={[
            dynamicStyles.checkoutButton,
            address.address === null || address.latitude === null || address.longitude === null ? { backgroundColor: 'grey' } : null
          ]}
          onPress={handleCheckout}
          disabled={address.address === null || address.latitude === null || address.longitude === null}
        >
          <Text style={[styles.checkoutButtonText]}>CHECKOUT</Text>
        </TouchableOpacity>

        </View>
      )}
      {renderModal()}

      <Modal
  visible={modalVisible2}
  animationType="slide"
  onRequestClose={() => setModalVisible2(false)}
  transparent={true}
>
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
    }}
  >
    <View
      style={{
        width: "90%",
        height: "80%", // 80% of the screen height
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
      }}
    >
      <GooglePlacesAutocomplete
              placeholder="Enter delivery address"
              minLength={2}
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (details) {
                  const { lat, lng } = details.geometry.location;
                  setAddress(data.description);
                  console.log("Details: ", data);
                  setAddress({
                    address: data.description,
                    latitude: lat,
                    longitude: lng,
                  });
                } else {
                  console.warn("No data received from Google Places autocomplete.");
                }
              }}
              query={{
                key: 'AIzaSyADUgvqdCAHwvxaJaZVJCM7D6ozWai3lQY',
                language: "en",
                location: '4.05,7.0392',
                radius: 5000
              }}
              nearbyPlacesAPI="GooglePlacesSearch"
              debounce={0} // debounce the requests
              styles={{
                  container: {
                    borderWidth: 0,
                    marginTop: 20,
                    zIndex: 2
                  },
                  listView: {
                    backgroundColor: '#c3c3c3',
                    zIndex: 1000, // Ensure it's on top of other elements
                    paddingVertical: 5,
                  },
                  textInput: {
                    paddingHorizontal: 10, // Horizontal padding for input text
                    fontSize: 16, // Font size for the text
                    backgroundColor: 'white', // Background color for input
                    marginTop: 0, // Space from the input above
                    borderBottomWidth: 0, // Remove bottom border
                    fontFamily: "Livvic_700Bold",
                    borderWidth: 0, // Optional: Add border if needed
                    borderColor: '#000', // Optional: Define border color
                    borderRadius: 10, // Optional: Add border radius for rounded edges
                  },
                  description: {
                    paddingVertical: 5,
                    fontFamily: 'Livvic_700Bold',
                    fontSize: 15,
                  },
                  row: {
                    elevation: 2, // For Android shadow
                    shadowColor: '#000', // Shadow color
                    shadowOffset: {
                      width: 0, // Horizontal shadow offset
                      height: 2, // Vertical shadow offset
                    },
                    shadowOpacity: 0.2, // Shadow opacity
                    shadowRadius: 3.5, // Shadow blur radius
                    paddingVertical: 10, // Optional: Padding for the row
                    flexDirection: 'row', // Align items in a row
                    justifyContent: 'space-between', // Space between text and icon
                    alignItems: 'center', // Center vertically
                    zIndex: 1000
                  },
                }}
                renderRow={(rowData) => {
                  {console.log("RowData: ", rowData)}
                  return (
                    <View style={{
                      elevation: 2, // For Android shadow
                    shadowColor: '#000', // Shadow color
                    shadowOffset: {
                      width: 0, // Horizontal shadow offset
                      height: 2, // Vertical shadow offset
                    },
                    shadowOpacity: 0.2, // Shadow opacity
                    shadowRadius: 3.5, // Shadow blur radius
                    paddingVertical: 10, // Optional: Padding for the row
                    flexDirection: 'row', // Align items in a row
                    justifyContent: 'space-between', // Space between text and icon
                    alignItems: 'center', // Center vertically
                    zIndex: 2
                    }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: "Livvic_700Bold", fontSize: 15, color: 'red',}}>{rowData.structured_formatting.main_text}</Text>
                        <Text style={{ fontSize: 12, color: 'gray', marginTop: 3, fontFamily: "Livvic_700Bold" }}>{rowData.structured_formatting.secondary_text}</Text>
                        <Text style={{ fontSize: 12, color: 'darkgray', marginTop: 8, fontFamily: "Livvic_400Regular" }}>
                          {rowData.types.includes('restaurant') ? 'Restaurant' : rowData.types.join(', ')}
                        </Text>
                      </View>
                    </View>
                  );
                }}
                onFail={(error) => {
                  console.error("Google Places Autocomplete Error:", error)
                  Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Failed to load address suggestions. Please try again.",
                  })
                }}
                autoFocus={false}
                listViewDisplayed="auto" // true/false/auto
                onNotFound={() => {
                  console.warn("No results found for the search query")
                  Toast.show({
                    type: "info",
                    text1: "No Results",
                    text2: "No addresses found for your search. Please try a different query.",
                  })
                }}
              onTimeout={() => console.log("Request timed out")}
            />
      <TouchableOpacity
        style={{
          marginTop: 15,
          backgroundColor: "#D50000",
          paddingVertical: 12,
          borderRadius: 25,
          alignItems: "center",
        }}
        onPress={() => setModalVisible2(false)}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", textTransform: "uppercase" }}>
          Close
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101112",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 1,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: "100%",
  },
  emptyCartImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    marginTop: 20,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
    marginBottom: 15,
  },
  exploreButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    alignItems: 'center',
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
  
  paymentOption: {
    
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: "#DC2626",
    borderWidth: 1,
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
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
 
  paymentOptionText: {},
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    padding: 30,
    paddingBottom: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerWithKeyboard: {
    marginBottom: Platform.OS === "ios" ? 20 : 0, // Adjust this value as needed
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Livvic_700Bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    height: 200,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  modalButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Livvic_700Bold",
  },
  modalOverlay2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: '80%',
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent2: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
  },
  row: {
    elevation: 2, // For Android shadow
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0, // Horizontal shadow offset
      height: 2, // Vertical shadow offset
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 3.5, // Shadow blur radius
    paddingVertical: 10, // Optional: Padding for the row
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-between', // Space between text and icon
    alignItems: 'center', // Center vertically
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#D50000", // Paramount Red
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
});
