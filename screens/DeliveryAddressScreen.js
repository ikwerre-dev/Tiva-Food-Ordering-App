import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GOOGLE_PLACES_API_KEY = "AIzaSyADUgvqdCAHwvxaJaZVJCM7D6ozWai3lQY"; // ✅ Replace with your real key

const DeliveryAddressScreen = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigation = useNavigation();

  // Function to handle address selection from autocomplete
  const onAddressSelected = (data, details) => {
    if (!details || !details.geometry) {
      Alert.alert("Error", "Invalid address selection. Please try again.");
      return;
    }

    const { lat, lng } = details.geometry.location;

    const address = {
      address: data.description,
      latitude: lat,
      longitude: lng,
    };

    setSelectedAddress(address);
    console.log("Address Selected:", address);
  };

  // Function to submit the selected address
  const handleSubmit = () => {
    if (!selectedAddress) {
      Alert.alert("Error", "Please select an address before submitting.");
      return;
    }

    console.log("Submitting Address:", selectedAddress);

    // Navigate back with the selected address
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Delivery Address</Text>

      {/* Address Autocomplete Input */}
      <GooglePlacesAutocomplete
        placeholder="Enter delivery address"
        minLength={3}
        numberOfLines={10}
        fetchDetails={true}
        onPress={onAddressSelected}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: "en",
        }}
        styles={{
            container: {
              borderWidth: 0,
              marginTop: 20
            },
            listView: {
              backgroundColor: 'white',
              zIndex: 2, // Ensure it's on top of other elements
              paddingVertical: 5,
            },
            textInput: {
              paddingHorizontal: 10, // Horizontal padding for input text
              fontSize: 16, // Font size for the text
              backgroundColor: 'white', // Background color for input
              marginTop: 0, // Space from the input above
              borderBottomWidth: 0, // Remove bottom border
              fontFamily: "LivvicRegular",
              borderWidth: 0, // Optional: Add border if needed
              borderColor: '#000', // Optional: Define border color
              borderRadius: 10, // Optional: Add border radius for rounded edges
            },
            description: {
              paddingVertical: 5,
              fontFamily: 'LivvicBold',
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
            },
          }}
          renderRow={(rowData) => {
            return (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Livvic_700Bold", fontSize: 15, color: 'red',}}>{rowData.structured_formatting.main_text}</Text>
                  <Text style={{ fontSize: 12, color: 'gray', marginTop: 3, fontFamily: "Livvic_700Bold" }}>{rowData.structured_formatting.secondary_text}</Text>
                  {/* Add more details as needed */}
                  <Text style={{ fontSize: 12, color: 'darkgray', marginTop: 8, fontFamily: "Livvic_400Regular" }}>
                    {rowData.types.includes('restaurant') ? 'Restaurant' : rowData.types.join(', ')}
                  </Text>
                </View>
              </View>
            );
          }}
        onFail={(error) => console.log("Error: ", error)}
        onNotFound={() => console.log("No results found")}
        onTimeout={() => console.log("Request timed out")}
      />
      <Text style={{
        textAlign: 'center',
        color: 'red',
        fontFamily: "Livvic_700Bold",
        fontSize: 18
      }}>{selectedAddress.address}</Text>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Set Address</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff", // White background
    },
    input: {
      height: 50,
      backgroundColor: "#fff",
      fontSize: 16,
      borderRadius: 10,
      paddingHorizontal: 15,
      borderWidth: 2,
      borderColor: "#D50000", // Paramount Red border
      color: "#000", // Black text
    },
    listView: {
      backgroundColor: "#fff",
      borderRadius: 8,
      position: "absolute",
      top: 60,
      left: 0,
      right: 0,
      zIndex: 1000,
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#D50000", // Paramount Red
      textAlign: "center",
      marginBottom: 20,
      textTransform: "uppercase",
      marginTop: 20
    },
    submitButton: {
      marginTop: 20,
      backgroundColor: "#D50000", // Paramount Red
      paddingVertical: 15,
      borderRadius: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, // Android shadow effect
    },
    submitText: {
      color: "#fff", // White text
      fontSize: 16,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
  });
  

export default DeliveryAddressScreen;
