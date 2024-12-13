import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import {
  ShoppingBag,
  User,
  MapPin,
  CreditCard,
  Sun,
  Star,
  LogOut,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const MenuItem = ({ icon: Icon, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconContainer}>
      <Icon color="#fff" size={24} />
    </View>
    <Text style={styles.menuItemText}>{title}</Text>
  </TouchableOpacity>
);

export default function MenuOverlay({ isOpen, onClose, translateX }) {
  const menuItems = [
    { icon: ShoppingBag, title: 'My Orders' },
    { icon: User, title: 'My Profile' },
    { icon: MapPin, title: 'Delivery Address' },
    { icon: CreditCard, title: 'Payment Methods' },
    { icon: Sun, title: 'Light Mode' },
    { icon: Star, title: 'Your Ratings' },
  ];

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateX }],
        }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://placeholder.com/150x150' }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>Jon Snow</Text>
          <Text style={styles.profileEmail}>Jonsnow@gmail.com</Text>
        </View>

        <View style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              title={item.title}
              onPress={() => {}}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <View style={styles.logoutContent}>
            <LogOut color="#fff" size={24} />
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: '#000',
    zIndex: 1000,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFB800',
    padding: 5,
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  profileName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profileEmail: {
    color: '#666',
    fontSize: 16,
  },
  menuItems: {
    flex: 1,
    gap: 25,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    justifyContent: 'center',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 15,
  },
  logoutButton: {
    marginBottom: 30,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 30,
    gap: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
