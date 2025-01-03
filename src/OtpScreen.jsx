import axios from 'axios';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import {Base_url} from './ApiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import styles from './screens/styles/Styles';

const OtpScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigation = useNavigation();

  // Function to handle OTP input and focus the next input field
  const handleOtpChange = (text, index) => {
    let otpCopy = [...otp];
    otpCopy[index] = text;
    setOtp(otpCopy);

    // Automatically move to the next input field if the current one is filled
    if (text && index < otp.length - 1) {
      // Focus on the next input field
      this[`otpInput${index + 1}`].focus();
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');

    // Check if OTP is 6 digits
    if (otpString.length !== 6) {
      Alert.alert('Error', 'OTP must be 6 digits long.');
      return;
    }

    try {
      const email = await AsyncStorage.getItem('email');

      if (!email) {
        Alert.alert('Error', 'Email is missing.');
        return;
      }

      console.log('Email retrieved from AsyncStorage:', email);

      const response = await axios.post(Base_url.otplogin, {
        email: email,
        otp: otpString,
      });

      if (response.data.success === true) {
        Alert.alert('Success', 'OTP verified successfully!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Invalid OTP.');
      }
    } catch (error) {
      console.error(
        'Error verifying OTP:',
        error.response ? error.response.data : error.message,
      );
      Alert.alert('Error', 'Failed to verify OTP. Please try again later.');
    }
  };

  return (
    <ImageBackground
      source={require('./assets/background.png')}
      resizeMode="cover"
      style={{flex: 1, width: '100%', height: '100%'}}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('./assets/logo.png')}
          style={{width: 250, height: 100, resizeMode: 'cover'}}
        />
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text style={styles.header}>Enter OTP</Text>

        <View style={styles.otpWrapper}>
          <Text style={styles.subHeader}>
            Enter OTP for email verification :
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={input => {
                  this[`otpInput${index}`] = input;
                }}
                style={styles.otpBox}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={text => handleOtpChange(text, index)}
                autoFocus={index === 0}
              />
            ))}
          </View>
          <TouchableOpacity style={[styles.btn,{margin:'auto',marginTop:20}]} onPress={handleVerifyOtp}>
            <Text style={styles.btntext}>Verify OTP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default OtpScreen;
