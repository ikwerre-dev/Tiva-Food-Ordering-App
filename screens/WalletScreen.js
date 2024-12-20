import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../context/AuthContext';
import { useFonts } from 'expo-font';
import { Livvic_400Regular, Livvic_700Bold } from '@expo-google-fonts/livvic';

const Transaction = ({ title, date, amount }) => {
  const { theme } = useContext(ThemeContext);
  const isPositive = amount.startsWith('+');
  
  const styles = StyleSheet.create({
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      // paddingBottom:50,
      borderBottomColor: theme === 'light' ? '#eee' : '#333',
    },
    transactionTitle: {
      fontSize: 16,
      fontFamily: 'Livvic_400Regular',
      marginBottom: 5,
      color: theme === 'light' ? '#000' : '#fff',
    },
    transactionDate: {
      fontSize: 14,
      fontFamily: 'Livvic_400Regular',
      color: theme === 'light' ? '#666' : '#999',
    },
    transactionAmount: {
      fontSize: 16,
      fontFamily: 'Livvic_700Bold',
    },
  });

  return (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionTitle}>{title}</Text>
        <Text style={styles.transactionDate}>{date}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: isPositive ? '#4CAF50' : '#FF5252' }
      ]}>
        {amount}
      </Text>
    </View>
  );
};

const WalletScreen = () => {
  const { theme } = useContext(ThemeContext);
  
  let [fontsLoaded] = useFonts({
    Livvic_400Regular,
    Livvic_700Bold,
  });

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
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Livvic_700Bold',
      color: theme === 'light' ? '#000' : '#fff',
    },
    card: {
      backgroundColor: '#000066',
      borderRadius: 20,
      padding: 24,
      marginBottom: 30,
    },
    debitText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: 'Livvic_400Regular',
      marginBottom: 10,
    },
    bankName: {
      color: '#fff',
      fontSize: 20,
      fontFamily: 'Livvic_700Bold',
      position: 'absolute',
      right: 24,
      top: 24,
    },
    cardNumber: {
      color: '#fff',
      fontSize: 22,
      fontFamily: 'Livvic_400Regular',
      letterSpacing: 2,
      marginVertical: 20,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
    },
    balanceText: {
      color: '#fff',
      fontFamily: 'Livvic_400Regular',
    },
    balanceAmount: {
      color: '#fff',
      fontSize: 18,
      fontFamily: 'Livvic_700Bold',
    },
    validThru: {
      color: '#fff',
      fontFamily: 'Livvic_400Regular',
    },
    transactionsTitle: {
      fontSize: 20,
      fontFamily: 'Livvic_700Bold',
      marginBottom: 10,
      color: theme === 'light' ? '#000' : '#fff',
    },
    monthText: {
      fontSize: 16,
      fontFamily: 'Livvic_400Regular',
      color: theme === 'light' ? '#666' : '#999',
      marginBottom: 20,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wallet</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.debitText}>Debit.</Text>
          <Text style={styles.bankName}>TIVA-BANK</Text>
          <Text style={styles.cardNumber}>5355 0348 5945 5045</Text>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.balanceText}>Total Balance</Text>
              <Text style={styles.balanceAmount}>N 14,000</Text>
            </View>
            <View>
              <Text style={styles.validThru}>VALID THRU</Text>
              <Text style={styles.balanceText}>12/24</Text>
            </View>
          </View>
        </View>

        <Text style={styles.transactionsTitle}>Transactions</Text>
        <Text style={styles.monthText}>June 2024</Text>

        <Transaction
          title="Tip to Rider"
          date="Friday 7th June, 2024"
          amount="-N400"
        />
        <Transaction
          title="Order Purchase 1 portion of Catfish"
          date="Friday 7th June, 2024"
          amount="-N6800"
        />
        <Transaction
          title="Wallet Top-Up"
          date="Friday 7th June, 2024"
          amount="+N14000"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;