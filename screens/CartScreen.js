import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ChevronLeft, X } from 'lucide-react-native';

export default function CartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.cartItem}>
          <Image
            source={{ uri: 'https://placeholder.com/100x100' }}
            style={styles.itemImage}
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>Chicken Republic refuel</Text>
            <Text style={styles.itemPrice}>₦4200</Text>
          </View>
          <View style={styles.itemQuantity}>
            <Text style={styles.quantityText}>02</Text>
            <TouchableOpacity>
              <X color="#DC2626" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₦4200</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax and Fees</Text>
            <Text style={styles.summaryValue}>₦50</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>₦750</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₦5000</Text>
          </View>
        </View>

        <View style={styles.deliveryDetails}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <Text style={styles.address}>7,Sosebon street, GRA, Ikeja</Text>
        </View>

        <View style={styles.paymentMethod}>
          <Text style={styles.sectionTitle}>Payment method</Text>
          <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentOptionText}>Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentOptionText}>Debit Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  itemPrice: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemQuantity: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 5,
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
  },
  summaryContainer: {
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryLabel: {
    color: '#666',
  },
  summaryValue: {
    color: '#fff',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    paddingTop: 15,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryDetails: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  address: {
    color: '#666',
  },
  paymentMethod: {
    marginBottom: 30,
  },
  paymentOption: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentOptionText: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  checkoutButton: {
    backgroundColor: '#DC2626',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
