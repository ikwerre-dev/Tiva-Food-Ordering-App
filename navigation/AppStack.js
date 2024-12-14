import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, User, ShoppingBag, Menu } from 'lucide-react-native';

// Import screens
import HomeScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';
import FoodDetailsScreen from '../screens/FoodDetailsScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import SideMenuScreen from '../screens/SideMenuScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          switch (route.name) {
            case 'Home':
              icon = <Home size={size} color={color} />;
              break;
            case 'Profile':
              icon = <User size={size} color={color} />;
              break;
            case 'Cart':
              icon = <ShoppingBag size={size} color={color} />;
              break;
            case 'Menu':
              icon = <Menu size={size} color={color} />;
              break;
          }
          return icon;
        },
        tabBarActiveTintColor: '#DC2626',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopWidth: 0,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: '#1A1A1A',
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Menu" 
        component={SideMenuScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1A1A1A',
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="FoodDetails" 
        component={FoodDetailsScreen}
        options={{headerShown: false, title: '' }}
      />
      <Stack.Screen 
        name="Reviews" 
        component={ReviewsScreen}
        options={{headerShown: false, title: 'Reviews' }}
      />
    </Stack.Navigator>
  );
}