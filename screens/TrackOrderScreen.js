import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Linking,
  ActivityIndicator
} from "react-native";
import { Bell, Check, ChevronLeft, PhoneCall } from "lucide-react-native";
import { useFonts } from "expo-font";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import AppLoading from "expo-app-loading";
import { ThemeContext } from "../context/AuthContext";
import { ScrollView } from "react-native";

const getStyles = (theme) => ({
  background: {
    flex: 1,
    backgroundColor: "#101112",
  },
  safeArea: {
    flex: 1,
  },
  Borderedcard: {
    padding: 25,
    borderColor: theme === "light" ? "#EFEFEF" : "#222",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Livvic_700Bold",
  },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor:
      theme === "light"
        ? "rgba(255, 255, 255, 1.95)"
        : "rgba(16, 17, 18, 1.95)",
    height: "100%",
  },
  cardTitle: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Livvic_700Bold",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    fontFamily: "Livvic_400Regular",
  },
  text: {
    color: theme === "light" ? "#000" : "#fff",
  },
  subtext: {
    color: theme === "light" ? "#666" : "#999",
  },
  stepsContainer: {
    marginBottom: 0,
  },
  stepContainer: {
    marginBottom: 35,
  },
  stepContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepIconCompleted: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },
  stepIconCurrent: {
    borderColor: "#DC2626",
  },
  currentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#DC2626",
  },
  inactiveDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#666",
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Livvic_700Bold",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Livvic_400Regular",
  },
  stepLine: {
    position: "absolute",
    left: 11,
    top: 24,
    width: 2,
    height: 40,
    backgroundColor: "#666",
  },
  stepLineCompleted: {
    backgroundColor: "#DC2626",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
    marginTop: 0,
  },
  statusLabel: {
    fontSize: 16,
    color: "#666",
    marginRight: 8,
    fontFamily: "Livvic_400Regular",
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "Livvic_700Bold",
  },
  okayButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  okayButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Livvic_700Bold",
  },
  callcontainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#B25E09",
    borderRadius: 30,
    width: 150,
  },
  buttonText: {
    color: "#B25E09",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "500",
  },
});

const StatusStep = ({
  title,
  description,
  isCompleted,
  isCurrent,
  isLast,
  theme,
}) => {
  const styles = getStyles(theme);
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepContent}>
        <View
          style={[
            styles.stepIcon,
            isCompleted && styles.stepIconCompleted,
            isCurrent && styles.stepIconCurrent,
          ]}
        >
          {isCompleted && <Check size={16} color="#fff" />}
          {isCurrent && <View style={styles.currentDot} />}
          {!isCompleted && !isCurrent && <View style={styles.inactiveDot} />}
        </View>
        <View style={styles.stepText}>
          <Text
            style={[
              styles.stepTitle,
              { color: theme === "light" ? "#000" : "#fff" },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.stepDescription,
              { color: theme === "light" ? "#666" : "#999" },
            ]}
          >
            {description}
          </Text>
        </View>
      </View>
      {!isLast && (
        <View
          style={[styles.stepLine, isCompleted && styles.stepLineCompleted]}
        />
      )}
    </View>
  );
};

const TrackOrderScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [orderStatus, setOrderStatus] = React.useState(3); // 0: none, 1: confirmed, 2: pickup, 3: in progress, 4: delivered
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePhoneCall = async () => {
    setIsLoading(true);
    try {
      await Linking.openURL('tel:+2349163169949');
    } catch (error) {
      console.error('Failed to make the call:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const riderId = 100;
  
  let [fontsLoaded] = useFonts({
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const steps = [
    {
      title: "Order confirmed",
      description: "Restaurant has confirmed your delivery",
    },
    {
      title: "Order pickup",
      description: "Rider has picked up your delivery",
    },
    {
      title: "Inprogress",
      description: "Delivery in process",
    },
    {
      title: "Delivered",
      description: "Customer have received there delivery",
    },
  ];

  const getStatusText = () => {
    switch (orderStatus) {
      case 1:
        return "Confirmed";
      case 2:
        return "Pickup";
      case 3:
        return "Inprogess";
      case 4:
        return "Completed";
      default:
        return "Pending";
    }
  };

  const getStatusColor = () => {
    if (orderStatus === 4) return "#22C55E";
    if (orderStatus === 3) return "#FFA500";
    if (orderStatus > 0) return "#DC2626";
    return "#666";
  };

  return (
    <ImageBackground
      source={require("../assets/tracker.png")}
      style={[
        styles.background,
        // { opacity: theme === 'light' ? 0.1 : 0.05 }
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.backButton}>
              <ChevronLeft color="#fff" size={24} />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Order</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notification")}
            style={styles.iconButton}
          >
            <Bell color="#fff" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.card}>
          <View style={styles.Borderedcard}>
            <Text style={[styles.cardTitle, styles.text]}>
              Track Your Order
            </Text>
            <Text style={[styles.cardSubtitle, styles.subtext]}>
              Stay Updated on the Status of Your order
            </Text>

            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <StatusStep
                  key={index}
                  title={step.title}
                  description={step.description}
                  isCompleted={orderStatus > index + 1}
                  isCurrent={orderStatus === index + 1}
                  isLast={index === steps.length - 1}
                  theme={theme}
                />
              ))}
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status:</Text>
              <View
                style={[
                  styles.statusChip,
                  {
                    backgroundColor: orderStatus === 4 ? "#22C55E" : "#FFA500",
                  },
                ]}
              >
                <Text style={[styles.statusText, { color: "#101112" }]}>
                  {getStatusText()}
                </Text>
              </View>
            </View>
          </View>
     
          <View style={styles.callcontainer}>
            <TouchableOpacity onPress={() => navigation.push("CallScreen", { riderId: riderId })} style={styles.button}>
              <PhoneCall size={20} color="#A45C27" />
              <Text style={styles.buttonText}>In app Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
                 style={styles.button}
                 onPress={handlePhoneCall}
                 disabled={isLoading}
               >
                 {isLoading ? (
                   <ActivityIndicator size="small" color="#A45C27" />
                 ) : (
                   <>
                     <PhoneCall size={20} color="#A45C27" />
                     <Text style={styles.buttonText}>Phone Call</Text>
                   </>
                 )}
               </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.okayButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.okayButtonText}>Okay</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default TrackOrderScreen;
