import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {AppColors} from '../../constants/styles';
import {useState} from 'react';
import IconButton from '../ui/IconButton';

function Input({label, keyboardType, secure, onUpdateValue, value, isInvalid}) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure && !isPasswordVisible}
        onChangeText={onUpdateValue}
        value={value}
      />
      {secure && (
        <TouchableOpacity style={styles.toggleButton}>
          <IconButton
            onPress={togglePasswordVisibility}
            icon={isPasswordVisible ? 'eye-off' : 'eye'}
            size={24}
            color={AppColors.primary500}
          />
        </TouchableOpacity>
      )} 
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: 'white',
    marginBottom: 4,
  },
  labelInvalid: {
    color: AppColors.error500,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: AppColors.primary100,
    borderRadius: 4,
    fontSize: 16,
    // paddingRight: 50, // Add padding to accommodate the toggle button
  },
  inputInvalid: {
    backgroundColor: AppColors.error100,
  },
  toggleButtonText: {
    color: AppColors.primary500,
    fontSize: 16,
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: '35%',
  },
});
