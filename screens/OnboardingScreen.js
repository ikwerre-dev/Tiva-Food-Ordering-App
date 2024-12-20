import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import AppLoading from "../components/Loader";
import * as Haptics from 'expo-haptics';
const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Get good food,\nfast.",
    subtitle: "Your favorite meals,\ndelivered quickly and easily.",
    image: require("../assets/splash/1.png"),
    buttonText: "Next",
  },
  {
    id: "2",
    title: "From Kitchen\nto Doorstep.",
    subtitle: "Get your meal in record time.\nHot, and ready to enjoy.",
    image: require("../assets/splash/2.png"),
    buttonText: "Next",
  },
  {
    id: "3",
    title: "From Kitchen\nto Doorstep.",
    subtitle: "Get your meal in record time.\nHot, and ready to enjoy.",
    image: require("../assets/splash/1.png"),
    buttonText: "Next",
  },
  {
    id: "4",
    title: "From Kitchen\nto Doorstep.",
    subtitle: "Get your meal in record time.\nHot, and ready to enjoy.",
    image: require("../assets/splash/2.png"),
    buttonText: "Next",
  },
  {
    id: "5",
    title: "From Kitchen\nto Doorstep.",
    subtitle: "Get your meal in record time.\nHot, and ready to enjoy.",
    image: require("../assets/splash/1.png"),
    buttonText: "Get Started",
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      setCurrentIndex(currentIndex + 1);
      
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Add haptic feedback
      navigation.push("SignUp");
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
        showHideTransition={true} hidden 
      />
      
      <View style={styles.slide}>
        <ImageBackground source={currentSlide.image} style={styles.image}>
          <View style={styles.overlay}>
            <Text style={styles.title}>{currentSlide.title}</Text>
            <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
            <View style={styles.bottomContainer}>
              <View style={styles.pagination}>
                {slides.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === currentIndex
                        ? styles.activeDot
                        : styles.inactiveDot,
                    ]}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.button} onPress={scrollTo}>
                <Text style={styles.buttonText}>{currentSlide.buttonText}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.skipbutton} onPress={() => navigation.push("SignUp")}>
                <Text style={styles.skipbuttonText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  slide: {
    width,
    height,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
    justifyContent: "flex-end",
    paddingBottom: 50,
  },
  title: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Livvic_700Bold",
  },
  subtitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 40,
    fontFamily: "Livvic_400Regular",
  },
  bottomContainer: {
    marginTop: 20,
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 20,
  },
  inactiveDot: {
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  button: {
    backgroundColor: "#DC2626",
    padding: 20,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Livvic_700Bold",
  },
  skipbutton: {
    alignItems: "center",
    marginTop:15
  },
  skipbuttonText: {
    color: "#ccc",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
