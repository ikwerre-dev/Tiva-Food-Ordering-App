import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from "react-native";
import { useCall } from "../context/CallContext";
import { useNavigation } from "@react-navigation/native";
import { Accelerometer } from "expo-sensors";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import * as Haptics from 'expo-haptics';

const CallNotification = () => {
  const [shakeDetected, setShakeDetected] = useState(false);
  const {
    initiateCall,
    handleHangUp,
    simulateIncomingCall,
    acceptCall,
    callStatus,
  } = useCall();
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Livvic_400Regular,
    Livvic_700Bold,
  });

  useEffect(() => {
    const subscription = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;
      const threshold = 5;
      if (
        (Math.abs(x) > threshold ||
          Math.abs(y) > threshold ||
          Math.abs(z) > threshold) &&
        !shakeDetected
      ) {
        setShakeDetected(true);
      }
    });
    return () => {
      subscription.remove();
    };
  }, [shakeDetected]);

  useEffect(() => {
    if (shakeDetected) {
      simulateIncomingCall();
      const checkAcceptanceTimeout = setTimeout(() => {
        if (callStatus !== "accepted") {
          handleHangUp();
        }
      }, 5000);
      setShakeDetected(false);
      return () => clearTimeout(checkAcceptanceTimeout);
    }
  }, [shakeDetected, callStatus, simulateIncomingCall, handleHangUp]);

  useEffect(() => {
    if (callStatus === "incoming") {
      // Start vibration for incoming call
      const vibrationPattern = [0, 1000, 1000];
      Vibration.vibrate(vibrationPattern, true);
    } else {
      // Stop vibration when call status changes
      Vibration.cancel();
    }

    return () => {
      // Cleanup: stop vibration when component unmounts
      Vibration.cancel();
    };
  }, [callStatus]);

  const pickCall = () => {
    acceptCall();
    Vibration.cancel(); // Stop vibration when call is picked up
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Add haptic feedback
    navigation.navigate("CallScreen");
  };

  if (callStatus !== "incoming" || !fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <Text style={styles.text}>Incoming call</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={() => {
              handleHangUp();
              Vibration.cancel(); // Stop vibration when call is rejected
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); // Add haptic feedback
            }}
          >
            <Icon name="times" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "green" }]}
            onPress={pickCall}
          >
            <Icon name="phone" size={20} color="white" />
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
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 30,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontFamily: "Livvic_700Bold",
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
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

