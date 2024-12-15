import React, { useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import {
  Volume2,
  Pause,
  Menu,
  Video,
  UserPlus,
  Mic,
  PhoneOff,
} from 'lucide-react-native';
import { ThemeContext } from '../context/AuthContext';
import { useCall } from '../context/CallContext';
import { useFonts } from 'expo-font';
import { Livvic_400Regular, Livvic_700Bold } from '@expo-google-fonts/livvic';

const Call = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { callStatus, callDuration, initiateCall, handleHangUp } = useCall();

  let [fontsLoaded] = useFonts({
    Livvic_400Regular,
    Livvic_700Bold,
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true // Prevent the default back action
    );

    initiateCall();

    return () => {
      backHandler.remove();
    };
  }, [initiateCall]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!fontsLoaded) {
    return null;
  }

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#101112',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 40,
    },
    headerTitle: {
      fontSize: 25,
      color: theme === 'light' ? '#000' : '#fff',
      fontFamily: 'Livvic_700Bold',
      marginBottom: 40,
    },
    avatarContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      overflow: 'hidden',
      marginBottom: 20,
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    riderName: {
      fontSize: 32,
      fontFamily: 'Livvic_700Bold',
      color: theme === 'light' ? '#000' : '#fff',
      marginBottom: 60,
    },
    controlsContainer: {
      width: '100%',
      paddingHorizontal: 40,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    controlButton: {
      width: 80,
      height: 80,
      borderRadius: 30,
      backgroundColor: theme === 'light' ? '#f0f0f0' : '#2a2a2a',
      justifyContent: 'center',
      alignItems: 'center',
    },
    hangupButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#FF3B30',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
  });

  const iconColor = theme === 'light' ? '#000' : '#fff';
  const iconSize = 30;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>
          {callStatus === 'active' ? formatTime(callDuration) : callStatus}
        </Text>
        
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=24' }}
            style={styles.avatar}
          />
        </View>
        
        <Text style={styles.riderName}>RIDER</Text>
        
        {callStatus === 'active' && (
          <View style={styles.controlsContainer}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.controlButton}>
                <Volume2 color={iconColor} size={iconSize} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Pause color={iconColor} size={iconSize} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton}>
                <Mic color={iconColor} size={iconSize} />
              </TouchableOpacity>
            </View>
             
          </View>
        )}
        
        <TouchableOpacity onPress={() => {
          handleHangUp();
          navigation.replace("MainTabs", { screen: "Orders" });
        }} style={styles.hangupButton}>
          <PhoneOff color="#fff" size={32} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Call;