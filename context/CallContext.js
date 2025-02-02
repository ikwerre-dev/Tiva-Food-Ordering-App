import React, { useState, useEffect, createContext, useContext } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
import Toast from 'react-native-toast-message';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socketNew, setSocketNew] = useState(null);
  const [email2, setemail2] = useState('');
  const [callDetails, setCallDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);

  const getDeets = async () => {
    console.log('Getting details');
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      setemail2(storedEmail);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getDeets();
  }, []);

  useEffect(() => {
    if (email2 !== '') {
      const newSocket = io('wss://foodapp-backend-fefy.onrender.com', {
        query: { email2 },
        reconnection: true,
        reconnectionAttempts: 20,
        reconnectionDelay: 3000,
        pingTimeout: 2147483647,
        pingInterval: 25000,
      });
      setSocketNew(newSocket);
      newSocket.connect();

      newSocket.on('connect', () => {
        console.log('Connected to server from app with socket context');
        newSocket.emit('register_user', { email: email2 });
      });

      newSocket.on('incomingCall', (data) => {
        console.log('Incoming call', data);

        const startVibration = () => {
          const vibrationInterval = setInterval(() => {
            Vibration.vibrate(500); // Vibrate for 500ms
          }, 1000); // Interval of 1 second

          setTimeout(() => {
            clearInterval(vibrationInterval); // Stop vibration after 10 seconds
          }, 10000); // 10 seconds
        };

        startVibration();
        setCallDetails(data);
        setIsModalVisible(true);
      });

      newSocket.on('error', (data) => {
        Toast.show({
          text1: 'Error connecting to server',
          text2: 'Please check your network connection',
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
        });
        console.log('An error occurred:', data);
      });

      newSocket.on('connect_timeout', (timeout) => {
        console.error('Connection Timeout:', timeout);
      });

      newSocket.on('connect_error', (error) => {
        console.log('Connection error - User in socket context:', error);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [email2]);

  const handleRejectCall = () => {
    setIsModalVisible(false);
    setCallDetails(null);
  };

  const handleAcceptCall = () => {
    setIsModalVisible(false);
    setIsWebViewVisible(true);
  };

  const handleCloseWebView = () => {
    setIsWebViewVisible(false);
    setCallDetails(null);
  };

  return (
    <SocketContext.Provider value={{ socket: socketNew, setemail2 }}>
      {children}

      {callDetails && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.container}>
            <View style={styles.subcontainer}>
              <View>
                <Text style={styles.text}>Incoming call</Text>
                <Text style={styles.subtext}>{callDetails.callId || 'Unknown'}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.declineButton]}
                  onPress={handleRejectCall}
                >
                  <Icon name="times" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={handleAcceptCall}
                >
                  <Icon name="phone" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {isWebViewVisible && (
        <Modal
          visible={isWebViewVisible}
          animationType="slide"
          onRequestClose={handleCloseWebView}
        >
          <WebView
            source={{ uri: callDetails?.callUrl || 'https://example.com' }}
            style={{ flex: 1 }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseWebView}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Modal>
      )}
    </SocketContext.Provider>
  );
};

export const useCall = () => useContext(SocketContext);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 50,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
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
