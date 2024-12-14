import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useCall } from "../context/CallContext";
import { useNavigation } from "@react-navigation/native";
import { Accelerometer } from "expo-sensors";
import { PhoneCall, X } from "lucide-react-native";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import * as Haptics from 'expo-haptics'; // Import Haptics for vibration

const CallNotification = () => {
  const [shakeDetected, setShakeDetected] = useState(false);
  const {
    initiateCall,
    handleHangUp,
    simulateIncomingCall,
    acceptCall,
    callStatus,
  } = useCall();

  useEffect(() => {
    // Listen for accelerometer data to detect shake
    const subscription = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;
      const threshold = 5; // You can adjust this value for sensitivity
      // Check if the shake is strong enough
      if (
        (Math.abs(x) > threshold ||
          Math.abs(y) > threshold ||
          Math.abs(z) > threshold) &&
        !shakeDetected
      ) {
        setShakeDetected(true); // Set shakeDetected to true only once
      }
    });
    return () => {
      subscription.remove(); // Cleanup the listener
    };
  }, [shakeDetected]);

  useEffect(() => {
    if (shakeDetected) {
      simulateIncomingCall(); // Simulate the incoming call after the first shake
      const checkAcceptanceTimeout = setTimeout(() => {
        if (callStatus !== "accepted") {
          handleHangUp();
        }
      }, 5000);
      setShakeDetected(false);
      return () => clearTimeout(checkAcceptanceTimeout);
    }
  }, [shakeDetected, callStatus, simulateIncomingCall, handleHangUp]);

  const navigation = useNavigation();

  const pickCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    acceptCall();
    navigation.navigate("CallScreen");
  };

  if (callStatus !== "incoming") return null;

  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <Text style={styles.text}>Incoming call</Text>
        <View style={{flexDirection: 'row',gap: 10}}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={handleHangUp}
          >
            <X color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "green" }]}
            onPress={pickCall}
          >
            <PhoneCall color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    marginHorizontal: 30,
  },
  subcontainer: {
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    padding: 12,
    paddingHorizontal:12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 30,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontFamily: "Livvic_700Bold",
    paddingLeft:10
    
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 100,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CallNotification;
