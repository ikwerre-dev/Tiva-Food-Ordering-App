import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../context/AuthContext';
import { useFonts, Livvic_400Regular, Livvic_700Bold } from '@expo-google-fonts/livvic';
import AppLoading from '../components/Loader';

const PaymentMethod = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cards, setCards] = useState([
    { id: '1', number: '1234', type: 'Visa', expiry: '06/2024' },
    { id: '2', number: '5678', type: 'Mastercard', expiry: '08/2025' },
  ]);
  
  let [fontsLoaded] = useFonts({
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const styles = getStyles(theme);

  const handleAddCard = () => {
    setShowForm(true);
    setEditingCard(null);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
  };

  const handleEditCard = (card) => {
    setShowForm(true);
    setEditingCard(card);
    setCardNumber(card.number);
    setExpiryDate(card.expiry);
    setCvv('');
  };

  const handleDeleteCard = (cardId) => {
    Alert.alert(
      "Delete Card",
      "Are you sure you want to delete this card?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => {
          setCards(cards.filter(card => card.id !== cardId));
        }}
      ]
    );
  };

  const handleSave = () => {
    if (editingCard) {
      setCards(cards.map(card => 
        card.id === editingCard.id 
          ? { ...card, number: cardNumber, expiry: expiryDate }
          : card
      ));
    } else {
      const newCard = {
        id: Date.now().toString(),
        number: cardNumber,
        type: 'New Card',
        expiry: expiryDate,
      };
      setCards([...cards, newCard]);
    }
    setShowForm(false);
    setEditingCard(null);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" color={theme === 'light' ? '#000' : '#fff'} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment method</Text>
        </View>
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.sectionTitle}>Card details</Text>
          <Text style={styles.sectionSubtitle}>Select default payment method below.</Text>
          
          {cards.map((card) => (
            <View key={card.id} style={styles.cardContainer}>
              <View style={styles.cardInfo}>
                <Icon name="credit-card" color={theme === 'light' ? '#000' : '#fff'} size={24} />
                <View style={styles.cardDetails}>
                  <Text style={styles.cardNumber}>{card.type} ending in {card.number}</Text>
                  <Text style={styles.cardExpiry}>Expiry {card.expiry}</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => handleEditCard(card)}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteCard(card.id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          {!showForm && (
            <TouchableOpacity style={styles.addCardButton} onPress={handleAddCard}>
              <Icon name="plus" color={theme === 'light' ? '#f44336' : '#ff7961'} size={24} />
              <Text style={styles.addCardButtonText}>Add new card</Text>
            </TouchableOpacity>
          )}
          
          {showForm && (
            <View style={styles.formContainer}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>{editingCard ? 'Edit Card' : 'Add New Card'}</Text>
                <TouchableOpacity onPress={() => setShowForm(false)}>
                  <Icon name="x" color={theme === 'light' ? '#000' : '#fff'} size={24} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={theme === 'light' ? '#999' : '#666'}
                  keyboardType="numeric"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                />
              </View>
              
              <View style={styles.rowContainer}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor={theme === 'light' ? '#999' : '#666'}
                    keyboardType="numeric"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                  />
                </View>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor={theme === 'light' ? '#999' : '#666'}
                    keyboardType="numeric"
                    secureTextEntry
                    value={cvv}
                    onChangeText={setCvv}
                  />
                </View>
              </View>
            </View>
          )}
        </ScrollView>
        
        {showForm && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#999',
    marginBottom: 20,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: theme === 'light' ? '#E0E0E0' : '#2C2C2C',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardDetails: {
    marginLeft: 15,
  },
  cardNumber: {
    fontSize: 16,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
  },
  cardExpiry: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#999',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    color: '#f44336',
    fontFamily: 'Livvic_400Regular',
    marginRight: 15,
  },
  deleteButton: {
    color: theme === 'light' ? '#666' : '#999',
    fontFamily: 'Livvic_400Regular',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme === 'light' ? '#f44336' : '#ff7961',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  addCardButtonText: {
    color: theme === 'light' ? '#f44336' : '#ff7961',
    fontSize: 16,
    fontFamily: 'Livvic_700Bold',
    marginLeft: 10,
  },
  formContainer: {
    marginTop: 20,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#999',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: theme === 'light' ? '#E0E0E0' : '#2C2C2C',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#000' : '#fff',
    backgroundColor: theme === 'light' ? '#fff' : '#1A1B1E',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Livvic_700Bold',
  },
});

export default PaymentMethod;

