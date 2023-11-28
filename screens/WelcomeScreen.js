import {useContext, useEffect} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {AuthContext} from '../store/auth-context';
import LottieView from 'lottie-react-native';
import {useFetch} from '../util/hooks';
import {cleanEmail} from '../util/auth';
const {width, height} = Dimensions.get('window');

function WelcomeScreen() {
  const {userEmail} = useContext(AuthContext);
  var url =
    'https://newsapi.org/v2/top-headlines?' +
    'sources=bbc-news&' +
    'apiKey=fd3f6bcd0b314637ad721ff604c61914';
  var req = new Request(url);

  const {data, error, loading} = useFetch(req);

  const userNameClean = cleanEmail(userEmail);

  useEffect(() => {
    Alert.alert(`Hi ${userNameClean}`, ' authenticated successfully');
  }, []);

  if (loading) {
    return (
      <View style={styles.centeredView}>
        <LottieView
          style={styles.lottie}
          source={require('./Animations/loadingAnim.json')}
          autoPlay
          loop
        />
      </View>
    );
  }
  // Function to render each item in the FlatListconst renderItem = ({ item }) => {
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => handleItemClick(item)} key={item.id}>
        <View style={styles.card} key={index}>
          <Image style={styles.image} source={{uri: item.urlToImage}} />
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text>{item.description}</Text>
          <Text numberOfLines={1}>{item.content}</Text>
          <Text>Author: {item.author}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Function to handle item click
  const handleItemClick = item => {
    // Handle click action here based on the clicked item
    // For example: navigate to a detailed view, etc.
  };
  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id} // Assuming 'id' is a unique identifier for each item
        refreshControl={loading}
        // renderScrollComponent={data}
      />
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  lottie: {
    width: width * 0.9,
    height: width,
    justifyContent: 'center',
  },
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

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // for Android shadow
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    width: '100%', // Adjust the width as needed
    height: 200, // Adjust the height as needed
    resizeMode: 'cover', // or 'contain' for different image fitting
    borderRadius: 8, // if you want to apply border radius to the image
    marginBottom: 8, // Margin bottom for the image
  },
});
