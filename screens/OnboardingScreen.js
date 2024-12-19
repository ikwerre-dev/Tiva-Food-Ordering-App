import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  FlatList,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Get good food,\nfast.',
    subtitle: 'Your favorite meals,\ndelivered quickly and easily.',
    image: require('../assets/splash/1.png'),
    buttonText: 'Next',
  },
  {
    id: '2',
    title: 'From Kitchen\nto Doorstep.',
    subtitle: 'Get your meal in record time.\nHot, and ready to enjoy.',
    image: require('../assets/splash/2.png'),
    buttonText: 'Get Started',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate to the next screen
      // console.log('Get Started');
      navigation.push('SignUp')
    }
  };

  const renderSlide = ({ item }) => {
    return (
      <View style={styles.slide}>
        <ImageBackground source={item.image} style={styles.image}>
          <View style={styles.overlay}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <View style={styles.bottomContainer}>
              <View style={styles.pagination}>
                {slides.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === currentIndex ? styles.activeDot : styles.inactiveDot,
                    ]}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.button} onPress={scrollTo}>
                <Text style={styles.buttonText}>{item.buttonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar showHideTransition={true} hidden barStyle="light-content" />
      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width,
    height,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  title: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 40,
  },
  bottomContainer: {
    marginTop: 20,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 20,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  button: {
    backgroundColor: '#DC2626',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;