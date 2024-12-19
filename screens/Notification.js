import React, { useContext, useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // For icons like Bell, Search, Filter, Menu, Star, etc.
import { ThemeContext } from '../context/AuthContext';
import { useFonts, Livvic_400Regular, Livvic_700Bold } from '@expo-google-fonts/livvic';
import AppLoading from '../components/Loader';

const { height } = Dimensions.get('window');

const notifications = [
  {
    id: '1',
    title: 'Important Update: Welcome to Doordash',
    timestamp: '29 Apr 2024 • 04:38PM',
    message: 'Dear Jon,\n\nWe want to welcome you for using and downloading our app\nThank you for your understanding.\n\nBest regards,\nDoordash'
  },
  {
    id: '2',
    title: 'Your Order has been Delivered',
    timestamp: '29 Apr 2023 • 04:38PM',
    message: 'Your order has been successfully delivered. Enjoy your meal!'
  }
];

const NotificationModal = ({ visible, notification, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!notification) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={[styles.modalOverlay, { display: visible ? 'flex' : 'none' }]}>
        <TouchableWithoutFeedback>
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notification details</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="x"  color={theme === 'light' ? '#000' : '#fff'} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.messageText}>{notification.message}</Text>
              <Text style={styles.modalTimestamp}>{notification.timestamp}</Text>
            </ScrollView>

            <TouchableOpacity style={styles.okayButton} onPress={onClose}>
              <Text style={styles.okayButtonText}>Okay!</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const NotificationScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  let [fontsLoaded] = useFonts({
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const styles = getStyles(theme);

  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left"  color={theme === 'light' ? '#000' : '#fff'} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification</Text>
        </View>

        <ScrollView style={styles.notificationList}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={styles.notificationItem}
              onPress={() => handleNotificationPress(notification)}
            >
              <View style={styles.notificationIcon}>
               <Icon name="bell"  color={theme === 'light' ? '#000' : '#fff'} size={24} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title.length > 30 ? notification.title.slice(0,30) + '...' : notification.title}</Text>
                <Text style={styles.timestamp}>{notification.timestamp}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <NotificationModal
          visible={modalVisible}
          notification={selectedNotification}
          onClose={handleCloseModal}
        />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#101112',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'light' ? '#E0E0E0' : '#2C2C2C',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
    marginLeft: 20,
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'light' ? '#E0E0E0' : '#2C2C2C',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme === 'light' ? '#F5F5F5' : '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#000' : '#fff',
    marginBottom: 0,
  },
  timestamp: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#999',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#101112',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 12,
    minHeight: height * 0.5,
    maxHeight: height * 0.9,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme === 'light' ? '#E0E0E0' : '#2C2C2C',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
  },
  modalScrollView: {
    marginBottom: 20,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#000' : '#fff',
    lineHeight: 24,
    marginBottom: 20,
  },
  modalTimestamp: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#999',
    marginBottom: 20,
  },
  okayButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 'auto',
  },
  okayButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Livvic_700Bold',
  },
});

export default NotificationScreen;

