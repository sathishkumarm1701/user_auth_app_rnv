import * as React from 'react';
import {StyleSheet} from 'react-native';
import {
  Box,
  HStack,
  VStack,
  Text,
  Pressable,
  Image,
  Divider,
} from 'native-base';
import useDateArray from '../util/customHooks/hooks';

const ProfilePage = ({img, name, email}) => {
  const date = useDateArray(1);

  return (
    <Box
      bg="primary.600"
      py="4"
      px="3"
      borderRadius="5"
      rounded="md"
      width={375}
      maxWidth="100%">
      <HStack justifyContent="space-between">
        <Box justifyContent="space-between">
          <VStack space="2">
            <Text fontSize="sm" color="white">
              {date[0].dateString}
            </Text>
            <Text color="white" fontSize="xl">
              {name}
            </Text>
          </VStack>
          <Divider
            my="2"
            _light={{
              bg: 'muted.100',
            }}
            _dark={{
              bg: 'muted.50',
            }}
          />
          <Pressable rounded="xs" bg="primary.500" py="1" width={'180'} px="1">
            <Text
              textTransform="uppercase"
              fontSize="sm"
              fontWeight="bold"
              color="white">
              {email}
            </Text>
          </Pressable>
        </Box>
        <Image
          source={{
            uri: img,
          }}
          alt="Aang flying and surrounded by clouds"
          height="100"
          rounded="full"
          width="100"
        />
      </HStack>
    </Box>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({});
