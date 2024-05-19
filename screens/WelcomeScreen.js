import {useContext, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {AuthContext} from '../store/auth-context';
import LottieView from 'lottie-react-native';
import {useFetch} from '../util/hooks';
import {
  Center,
  Text,
  Box,
  HStack,
  Image,
  Stack,
  Heading,
  AspectRatio,
  View,
  Pressable,
} from 'native-base';
import {getPostDateHours} from '../helper';

const {width, height} = Dimensions.get('window');

function WelcomeScreen() {
  let url =
    'https://newsapi.org/v2/top-headlines?' +
    'sources=bbc-news&' +
    'apiKey=fd3f6bcd0b314637ad721ff604c61914';
  const {userEmail} = useContext(AuthContext);
  let req = new Request(url);
  const {data, error, loading} = useFetch(req);

  // const userNameClean = cleanEmail(userEmail);

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

  const renderItem = ({item, index}) => {
    return (
      <Pressable maxW="96" style={styles.card} key={index}>
        {({isHovered, isFocused, isPressed}) => {
          return (
            <Box
              alignItems="center"
              bg={
                isPressed
                  ? 'coolGray.200'
                  : isHovered
                  ? 'coolGray.200'
                  : 'coolGray.100'
              }>
              <AspectRatio w="100%" ratio={16 / 8}>
                <Image
                  style={styles.image}
                  source={{
                    uri: item.urlToImage,
                  }}
                  alt="image"
                />
              </AspectRatio>
              <Stack space={2}>
                <Heading size="md" ml="-1">
                  {item.title}
                </Heading>
                <Text
                  fontSize="xs"
                  _light={{
                    color: 'violet.500',
                  }}
                  _dark={{
                    color: 'violet.400',
                  }}
                  fontWeight="500"
                  ml="-0.5"
                  mt="-1">
                  {item.description}
                </Text>
              </Stack>
              <Text fontWeight="400" numberOfLines={1}>
                {item.content}
              </Text>
              <Text style={styles.author}>Author: {item.author}</Text>
              <HStack
                alignItems="center"
                space={4}
                justifyContent="space-between">
                <HStack alignItems="center">
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}
                    fontWeight="400">
                    {getPostDateHours(item.publishedAt)}
                  </Text>
                </HStack>
              </HStack>
            </Box>
          );
        }}
      </Pressable>
    );
  };

  const handleItemClick = item => {
    // Handle item click
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.url}
        refreshControl={loading}
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
  description: {
    color: 'black',
  },
  content: {
    color: 'black',
  },
  author: {
    color: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FD4C79',
    opacity: 0.5,
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
    borderRadius: 4,
    padding: 16,
    margin: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 8,
  },
});
