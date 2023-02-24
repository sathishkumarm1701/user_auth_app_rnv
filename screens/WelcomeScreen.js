import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../store/auth-context';

function WelcomeScreen() {
  const URI = ('https://authentication-3091a-default-rtdb.firebaseio.com/message.json?auth=' + token )
  const authCtx = useContext(AuthContext)
  const token = authCtx.token
 const [fetchedMessage,setFetchedMessage]  = useState()
  useEffect(() => {
    axios.get(URI) 
    .then((response) => {
      setFetchedMessage(response.data);
    }) 

     
  }, [token])  

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text> 
      <Text>You authenticated successfully!</Text>
      <Text>{fetchedMessage}</Text>
    </View> 
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});