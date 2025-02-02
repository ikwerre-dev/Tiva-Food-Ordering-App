import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const DeliveryAddressInput = ({ onAddressSelected }) => {
  const [address, setAddress] = useState("");
  const GOOGLE_PLACES_API_KEY = "AIzaSyADUgvqdCAHwvxaJaZVJCM7D6ozWai3lQY"; // Replace with your actual API key

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <GooglePlacesAutocomplete
            placeholder={address ? address : "Enter delivery address"}
            fetchDetails={true}
            minLength={2}
            enablePoweredByContainer={false} // Hide the "Powered by Google" text
            query={{
              key: "AIzaSyADUgvqdCAHwvxaJaZVJCM7D6ozWai3lQY",
              language: "en",
            }}
            onPress={(data, details = null) => {
              if (details) {
                const { lat, lng } = details.geometry.location;
                setAddress(data.description);
                onAddressSelected({
                  address: data.description,
                  latitude: lat,
                  longitude: lng,
                });
              } else {
                console.warn("No data received from Google Places autocomplete.");
              }
            }}
            styles={{
              container: { flex: 1 },
              textInputContainer: {
                borderWidth: 0,
              },
              textInput: styles.input,
              listView: styles.listView, // Ensure the dropdown appears properly
              row: styles.row,
              description: styles.description,
            }}
            renderRow={(rowData) => (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mainText}>{rowData.structured_formatting.main_text}</Text>
                  <Text style={styles.secondaryText}>{rowData.structured_formatting.secondary_text}</Text>
                </View>
              </View>
            )}
            onFail={(error) => console.error("Google Places API Error:", error)}
            onNotFound={(query) => console.warn("No results found for:", query)}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
  },
  innerContainer: {
    width: "100%",
    position: "relative",
  },
  input: {
    height: 50,
    backgroundColor: "white",
    fontSize: 16,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  listView: {
    backgroundColor: "white",
    borderRadius: 8,
    position: "absolute",
    top: 60, // Positioning below the input field
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure it appears above other elements
  },
  row: {
    padding: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  mainText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  secondaryText: {
    fontSize: 12,
    color: "gray",
    marginTop: 3,
  },
  description: {
    fontSize: 15,
    paddingVertical: 5,
  },
});

export default DeliveryAddressInput;
