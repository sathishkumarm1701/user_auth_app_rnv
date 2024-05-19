import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
const {width, height} = Dimensions.get('window');
function LoadingOverlay({message}) {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.message}>{message}</Text>
      {/* <ActivityIndicator size="large" /> */}
      <LottieView
        style={styles.lottie}
        source={require('../../screens/Animations/loadingAnim.json')}
        autoPlay
        loop
      />
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    color:'black',
  },
  lottie: {
    width: width * 0.9,
    height: width,
    justifyContent: 'center',
  },
});
