import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { ThemeContext } from '../context/AuthContext';
import { useFonts, Livvic_400Regular, Livvic_700Bold } from '@expo-google-fonts/livvic';
import AppLoading from '../components/Loader';


const { width } = Dimensions.get('window');
import profileBanner from '../assets/profilebanner.png';
const Profile = ({ navigation }) => {
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Image
        source={profileBanner}
        style={styles.bannerImage}
      />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <ChevronLeft color={'#fff'} size={24} />
      </TouchableOpacity>
      
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileContent}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera color="#fff" size={20} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>Robinson Honour</Text>
          <Text style={styles.editProfile}>Edit Profile</Text>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full name</Text>
              <TextInput 
                style={styles.input}
                value="Robinson Honour"
                placeholderTextColor={theme === 'light' ? '#666' : '#888'}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput 
                style={styles.input}
                value="robinsonhonour@gmail.com"
                placeholderTextColor={theme === 'light' ? '#666' : '#888'}
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input}
                value="+2349163169949"
                placeholderTextColor={theme === 'light' ? '#666' : '#888'}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#101112',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30, // Add some bottom padding for scrolling
  },
  bannerImage: {
    width: width,
    height: 200,
    position: 'absolute',
    top: 0,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    width: 45,
    height: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 120,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    borderRadius: 25,
    padding: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Livvic_700Bold',
    textAlign: 'center',
    color: theme === 'light' ? '#000' : '#fff',
    marginBottom: 5,
  },
  editProfile: {
    fontSize: 16,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#888',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme === 'light' ? '#ddd' : '#333',
    borderRadius: 8,
    padding: 18,
    fontSize: 16,
    paddingVertical: 18,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#000' : '#fff',
    backgroundColor: theme === 'light' ? '#fff' : '#1A1B1E',
  },
});

export default Profile;

