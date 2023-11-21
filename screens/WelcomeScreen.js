import {useContext, useEffect, useState} from 'react';
import {
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import {AuthContext} from '../store/auth-context';

function WelcomeScreen() {
  const {userEmail} = useContext(AuthContext);

  function cleanEmail(email) {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1 && email.endsWith('@gmail.com')) {
      return email.substring(0, atIndex); // Extracts only the username part before '@'
    }
    return email; // If '@' is not found or the email doesn't end with '@gmail.com', return the original email
  }
  const userNameClean = cleanEmail(userEmail);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(true);
  }, []);

  return (
    <ImageBackground
      source={require('../screens/placeholders/goldfish.jpg')}
      style={{flex: 1}}>
      <View style={styles.overlay} />
      <View style={styles.rootContainer}>
        <YoutubePlayer
          height={300}
          play={true}
          webViewStyle={{borderRadius: 30}}
          forceAndroidAutoplay={true}
          videoId={'P1IZJt9t39Y'}
          allowWebViewZoom={true}
        />
        <Text style={styles.title}>Hi🖐️{userNameClean}!</Text>
        <Text style={styles.txt}>You authenticated successfully!!</Text>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.title}>
                  Welcome {''}
                  {userNameClean}!
                </Text>
                <Text style={styles.txt}>You authenticated successfully!!</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </ImageBackground>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FD4C79', // Your desired fade color
    opacity: 0.5, // Adjust the opacity as needed
  },
  rootContainer: {
    position: 'relative',
    flex: 1,
    padding: 32,
  },
  txt: {
    fontSize: 16,
    color: '#3BA580',
  },
  title: {
    marginVertical: 2,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3BA580',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#610440',
  },
  buttonClose: {
    backgroundColor: '#610440',
    marginTop: 20,
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
