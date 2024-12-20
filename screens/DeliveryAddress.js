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
            <Icon name="chevron-left"  color={theme === 'light' ? '#000' : '#fff'} size={24} />
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
    paddingBottom: 100, // Extra padding to account for the fixed save button
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
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme === 'light' ? '#E0E0E0' : '#2C2C2C',
    borderRadius: 8,
    padding: 15,
  },
  selectButtonText: {
    fontSize: 16,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#000' : '#fff',
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

export default AddNewAddress;

