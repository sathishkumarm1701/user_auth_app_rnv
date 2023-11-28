import React, {useState, useEffect, useMemo} from 'react';
import {Text, View, Image, StyleSheet, Dimensions} from 'react-native';
import {retrieveUserData} from '../util/auth';

const windowWidth = Dimensions.get('window').width;

export default function UserPage() {
  const [userDetails, setUserDetails] = useState(null);

  const userDetailsGetHandler = useMemo(async () => {
    try {
      const userData = await retrieveUserData();
      setUserDetails(userData);
    } catch (error) {
      console.error('Error retrieving user details:', error);
    }
  }, [userDetails]);

  useEffect(() => {}, [userDetailsGetHandler]);

  return (
    <View style={styles.container}>
      {userDetails && (
        <>
          <View style={styles.userDetailsContainer}>
            <Image
              source={{uri: userDetails.photo}}
              style={styles.profileImage}
            />
            <Text style={styles.nameText}>{userDetails.name}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.detailText}>Email: {userDetails.email}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 2,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  fetchDetailsText: {
    fontSize: 16,
    color: 'blue',
  },
  userDetailsContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: windowWidth / 1,
    aspectRatio: 1,
  },
  nameText: {
    position: 'absolute',
    bottom: 10,
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
    marginLeft: 10,
  },
  detailText: {
    fontSize: 20,
    marginBottom: 5,
  },
});
