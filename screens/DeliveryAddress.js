import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';  // Import Feather icons from react-native-vector-icons
import { ThemeContext } from '../context/AuthContext';
import { useFonts, Livvic_400Regular, Livvic_700Bold } from '@expo-google-fonts/livvic';
import AppLoading from '../components/Loader';

const AddNewAddress = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  
  let [fontsLoaded] = useFonts({
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const styles = getStyles(theme);

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
          <Text style={styles.headerTitle}>Add new address</Text>
        </View>
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>State</Text>
            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Select State</Text>
              <Icon name="chevron-right" color={theme === 'light' ? '#000' : '#fff'} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Select City</Text>
              <Icon name="chevron-right" color={theme === 'light' ? '#000' : '#fff'} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Street (Include house number)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter street address"
              placeholderTextColor={theme === 'light' ? '#999' : '#666'}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apartment, suite, etc. (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter apartment or suite number"
              placeholderTextColor={theme === 'light' ? '#999' : '#666'}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Zip Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter zip code"
              placeholderTextColor={theme === 'light' ? '#999' : '#666'}
              keyboardType="numeric"
            />
          </View>
        </ScrollView>
        
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
    marginLeft: 10,
  },
  inputContainer: {
    width: '90%',
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Livvic_700Bold',
    fontSize: 16,
    color: theme === 'light' ? '#000' : '#fff',
    marginBottom: 10,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: theme === 'light' ? '#ddd' : '#444',
    borderRadius: 5,
    backgroundColor: theme === 'light' ? '#fff' : '#333',
  },
  selectButtonText: {
    fontFamily: 'Livvic_400Regular',
    fontSize: 14,
    color: theme === 'light' ? '#000' : '#fff',
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: theme === 'light' ? '#ddd' : '#444',
    borderRadius: 5,
    backgroundColor: theme === 'light' ? '#fff' : '#333',
    color: theme === 'light' ? '#000' : '#fff',
  },
  saveButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontFamily: 'Livvic_700Bold',
    fontSize: 16,
    color: '#fff',
  },
});

export default AddNewAddress;
