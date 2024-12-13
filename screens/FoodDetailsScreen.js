import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ChevronLeft, Star, Plus, Minus } from 'lucide-react-native';

export default function FoodDetailsScreen({ navigation }) {
  const [quantity, setQuantity] = useState(2);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: 'https://placeholder.com/400x300' }}
          style={styles.image}
        />

        <View style={styles.content}>
          <Text style={styles.title}>Chicken Republic Refuel</Text>

          <View style={styles.ratingContainer}>
            <Star fill="#FFD700" color="#FFD700" size={16} />
            <Text style={styles.rating}>4.8</Text>
            <Text style={styles.reviews}>(2.5k)</Text>
          </View>

          <Text style={styles.price}>₦2550</Text>

          <View style={styles.quantityContainer}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Plus size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Choice of Add On</Text>
          <View style={styles.addOnContainer}>
            <TouchableOpacity style={styles.addOnItem}>
              <Text style={styles.addOnName}>Extra Chicken</Text>
              <Text style={styles.addOnPrice}>+₦1200</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addOnItem}>
              <Text style={styles.addOnName}>Salad</Text>
              <Text style={styles.addOnPrice}>+₦500</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101112',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    color: '#fff',
    marginLeft: 5,
    marginRight: 5,
  },
  reviews: {
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  quantityContainer: {
    marginBottom: 20,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#2A2A2A',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    color: '#fff',
    fontSize: 18,
    marginHorizontal: 20,
  },
  addOnContainer: {
    gap: 10,
  },
  addOnItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 8,
  },
  addOnName: {
    color: '#fff',
  },
  addOnPrice: {
    color: '#DC2626',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  addToCartButton: {
    backgroundColor: '#DC2626',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: '#DC2626',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
