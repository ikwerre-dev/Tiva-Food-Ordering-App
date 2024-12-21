import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useCall } from "../context/CallContext";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import * as Haptics from "expo-haptics";

const CallNotification = () => {
  const { currentCall, declineCall, acceptCall } = useCall();
  const navigation = useNavigation();
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!loaded || !currentCall) {
    return null;
  }

  const handleAccept = () => {
    acceptCall();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate("CallScreen", { callData: currentCall });
  };

  const handleDecline = () => {
    declineCall();
    console.log('honour')
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <View>
          <Text style={styles.text}>Incoming call</Text>
          <Text style={styles.subtext}>{currentCall.fullname || 'Unknown'}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={handleDecline}
          >
            <Icon name="times" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={handleAccept}
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
  subtext: {
    color: "white",
    fontSize: 13,
    fontFamily: "Livvic_400Regular",
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
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
  declineButton: {
    backgroundColor: "red",
  },
  acceptButton: {
    backgroundColor: "green",
  },
});

export default CallNotification;

