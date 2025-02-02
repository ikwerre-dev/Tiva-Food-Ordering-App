import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../context/AuthContext';
import jwt_decode from 'jwt-decode'
import { useFonts } from 'expo-font';
import { Livvic_400Regular, Livvic_700Bold } from '@expo-google-fonts/livvic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import AddBalanceModal from './AddMoneyModal';

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
        N {parseFloat(amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
      </Text>
    </View>
  );
};

const WalletScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [balance, setBalance] = useState("...")
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setloading] = useState(true)
  const [transactions, setTransactions] = useState([])

  const fetchData2 = async () => {
    setloading(true)
    try {
      setBalance("...")
      setTransactions([])
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.warn("No token found in storage");
        return;
      }

      const decodedToken = jwt_decode(token);
      if (!decodedToken || !decodedToken.userid) {
        console.warn("Invalid token structure");
        return;
      }

      const { userid } = decodedToken;

      // Fetch User Balance
      const balanceResponse = await fetch(`${BASE_URL}/fetch_balance`, {
        method: "POST",
        body: JSON.stringify({ user_id: userid }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!balanceResponse.ok) {
        console.log("Failed to fetch balance");
      } else {
        const balanceData = await balanceResponse.json();
        if (balanceData.status === 200) {
          console.log("User balance: ", balanceData.balance);
          setBalance(balanceData.balance);
        } else {
          console.log("Failed to retrieve balance: ", balanceData.message);
        }
      }

      // Fetch All Transactions
      const transactionsResponse = await fetch(`${BASE_URL}/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!transactionsResponse.ok) {
        console.log("Failed to fetch transactions");
      } else {
        const transactionsData = await transactionsResponse.json();
        if (transactionsData.status === 200) {
          console.log("Transactions: ", transactionsData.transactions);
          setTransactions(transactionsData.transactions);
        } else {
          console.log("Failed to retrieve transactions: ", transactionsData.message);
        }
      }

    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally{
      setloading(false)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setloading(true)
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("No token found in storage");
          return;
        }
  
        const decodedToken = jwt_decode(token);
        if (!decodedToken || !decodedToken.userid) {
          console.warn("Invalid token structure");
          return;
        }
  
        const { userid } = decodedToken;
  
        // Fetch User Balance
        const balanceResponse = await fetch(`${BASE_URL}/fetch_balance`, {
          method: "POST",
          body: JSON.stringify({ user_id: userid }),
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (!balanceResponse.ok) {
          console.log("Failed to fetch balance");
        } else {
          const balanceData = await balanceResponse.json();
          if (balanceData.status === 200) {
            console.log("User balance: ", balanceData.balance);
            setBalance(balanceData.balance);
          } else {
            console.log("Failed to retrieve balance: ", balanceData.message);
          }
        }
  
        // Fetch All Transactions
        const transactionsResponse = await fetch(`${BASE_URL}/transactions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (!transactionsResponse.ok) {
          console.log("Failed to fetch transactions");
        } else {
          const transactionsData = await transactionsResponse.json();
          if (transactionsData.status === 200) {
            console.log("Transactions: ", transactionsData.transactions);
            setTransactions(transactionsData.transactions);
          } else {
            console.log("Failed to retrieve transactions: ", transactionsData.message);
          }
        }
  
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally{
        setloading(false)
      }
    };
  
    fetchData();
  }, []);

  const onSuccessAdd = async (add_amount) => {
    try {
      const main = parseFloat(balance) + parseFloat(add_amount)
      setBalance(main)
    } catch (error) {
      console.log("Error: ", error)
    }
  }
  
  
  
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
      marginBottom: 20,
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
      <AddBalanceModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={(amount) => {
          console.log("Successfully added to balance")
          onSuccessAdd(amount)
        }}
        />
      <ScrollView style={styles.container} refreshControl={<RefreshControl onRefresh={() => {

        fetchData2()
      }} refreshing={loading}/>}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wallet</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={[styles.debitText, {
            backgroundColor: theme === 'light' ? 'white' : '#000066',
            paddingVertical: 5,
            width: 30,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
            borderWidth: 1,
            borderColor: 'lightblue'
          }]}
          onPress={() => setModalVisible(true)}
          >
            <Icon name='plus' size={20} color={theme === 'light' ? '#000066' : 'white'}/>
          </TouchableOpacity>
          <Text style={styles.bankName}>TIVA-BANK</Text>
          <Text style={styles.cardNumber}>5355 0348 5945 5045</Text>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.balanceText}>Total Balance</Text>
              <Text style={styles.balanceAmount}>N {parseFloat(balance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
            </View>
            <View>
              <Text style={styles.validThru}>VALID THRU</Text>
              <Text style={styles.balanceText}>NAN</Text>
            </View>
          </View>
        </View>

        <Text style={styles.transactionsTitle}>Transactions</Text>

        {transactions.length > 0 && !loading ? (
          transactions.map((transaction, index) => (
            <Transaction 
              key={index} 
              title={transaction.reason} 
              date={`${transaction.date} ${transaction.time}`} 
              amount={`${transaction.type === 'credit' ? '+' : '-'}${transaction.amount}`} 
            />
          ))
        ) : transactions.length === 0 && !loading ? (
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{
              fontFamily: "Livvic_700Bold",
              fontSize: 16,
              textAlign: 'center',
              color: '#666',
            }}>
              No transactions found.
            </Text>
          </View>
        ) : (
          <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{
              fontFamily: "Livvic_700Bold",
              fontSize: 16,
              textAlign: 'center',
              color: theme === 'light' ? 'black':'white'
            }}>Loading transactions...</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;