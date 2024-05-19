import React, {useState, useEffect, useMemo} from 'react';
import {Text, View, Image, StyleSheet, Dimensions} from 'react-native';
import {retrieveUserData} from '../util/auth';
import {Box, Center, HStack} from 'native-base';
import ProfilePage from './ProfilePage';
import { AlertPopUp } from '../helper';

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
  }, []);

  useEffect(() => {}, [userDetailsGetHandler]);

  return (
    <HStack
      backgroundColor={'white'}
      borderColor={'white'}
      borderWidth={4}
      padding={3}
      justifyContent="center">
      {userDetails && (
        <Center rounded="md" shadow={3}>
          <ProfilePage
            img={userDetails.photo}
            name={userDetails.name}
            email={userDetails.email}
          />
        </Center>
      )}
      <AlertPopUp/>
    </HStack>
  );
}
