import React from 'react';
import {TouchableOpacity, View, Image, Text, StyleSheet} from 'react-native';

const GoogleLoginButton = ({onGoogleButtonPress}) => {
  return (
    <TouchableOpacity onPress={onGoogleButtonPress}>
      <View style={styles.buttonContainer}>
        <Image
          source={require('../screens/placeholders/google.png')}
          style={styles.googleImage}
          resizeMode="contain"
        />
        <Text style={styles.buttonText}>Login with Google</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#93A8AC',
    padding: 10,
    borderRadius: 5,
  },
  googleImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
  },
});

export default GoogleLoginButton;
