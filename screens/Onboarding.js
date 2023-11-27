import React from 'react';
import LottieView from 'lottie-react-native';
import {StyleSheet, View, Dimensions} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
export default function OnboardingScreen() {
  const navigation = useNavigation();

  const handleSkip = () => {
    navigation.navigate('Login');
  };
  return (
    <View style={styles.container}>
      <Onboarding
        onSkip={handleSkip}
        onDone={handleSkip}
        bottomBarColor="#bde0fe"
        containerStyles={{paddingHorizontal: 15}}
        pages={[
          {
            backgroundColor: '#a2d2ff',
            image: (
              <View style={styles.lottie}>
                <LottieView
                  style={styles.lottie}
                  source={require('./Animations/Animation1.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: 'Boost Productivity',
            subtitle: 'Done with React Native Onboarding Swiper',
          },
          {
            backgroundColor: '#a8dadc',
            image: (
              <View style={styles.lottie}>
                <LottieView
                  style={styles.lottie}
                  source={require('./Animations/Animation2.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: 'Secure Environment',
            subtitle: 'Done with React Native Onboarding Swiper',
          },
          {
            backgroundColor: '#00798c',
            image: (
              <View style={styles.lottie}>
                <LottieView
                  style={styles.lottie}
                  source={require('./Animations/Animation.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: 'Secured your data',
            subtitle: 'Done with React Native Onboarding Swiper',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  lottie: {
    width: width * 0.9,
    height: width,
    justifyContent: 'center',
  },
});
