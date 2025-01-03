import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Image,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Base_url} from '../ApiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles/Styles';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  // Handle Login with email and password
  const handleSubmit = async (values, {resetForm}) => {
    try {
      setLoading(true);
      const res = await axios({
        method: 'post',
        url: Base_url.login,
        data: {
          email: values.email,
          password: values.password,
        },
      });
      resetForm();

      await AsyncStorage.setItem('email', values.email);
     

      if (res.data.success === true) {
        const token = res.data.data.token;
        const user_id= res.data.user_id;
        console.log("userId",user_id);
        await AsyncStorage.setItem('user-id', String(user_id));
        const screen = res.data.screen;
        if (token) {
          await AsyncStorage.setItem('token', token);
        }

        // If "Remember Me" is checked, store the credentials or token
        if (isChecked) {
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('email', values.email);
          await AsyncStorage.setItem('password', values.password);
        }
        Alert.alert(res.data.message);

        // Navigate based on the screen value from API response
        if (screen === 'login') {
          navigation.navigate('Home');
        } else if (screen === 'otp') {
          navigation.navigate('OtpScreen');
        } else {
          Alert.alert('Error', 'Invalid screen value.');
        }
      } else {
        Alert.alert('Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        // Token exists, navigate to Home
        navigation.navigate('Home');
      }
    };
    checkToken();
  }, [navigation]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '811814618197-6q4jdsds0cjpi6gs5nj8ofl3oavo1jdr.apps.googleusercontent.com',
    });
  }, []);

  // login with googleSignin
  const signIn = async () => {
    await AsyncStorage.setItem('loginMethod', 'google');
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
  
      if (userInfo) {
        const email = userInfo.data.user.email;
        const provider_name = 'google';
        const provider_id = userInfo.data.user.id;
        const user_id = userInfo.data.user.id;
  
        await AsyncStorage.setItem('user-id', String(user_id));
        await sociallogin(email, provider_name, provider_id);
  
        const name = userInfo.data.user.name;
        const profile_pic = userInfo.data.user.photo;
  
        // Only store non-null, non-undefined values in AsyncStorage
        if (profile_pic) {
          await AsyncStorage.setItem('profile_pic', profile_pic);
        } else {
          await AsyncStorage.removeItem('profile_pic');
        }
  
        if (name) {
          await AsyncStorage.setItem('name', name);
        } else {
          await AsyncStorage.removeItem('name');
        }
  
        console.log('User Info:', userInfo);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
  
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert(
          'Sign-In Cancelled',
          'You have cancelled the sign-in process',
        );
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-In In Progress', 'Sign-In is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          'Play Services Error',
          'Google Play services are not available or outdated',
        );
      } else {
        // Other errors
        Alert.alert(
          'Error',
          error.message || 'Something went wrong during sign-in',
        );
      }
    }
  };
  

  const sociallogin = async (email, provider_name, provider_id) => {
    try {
      const res = await axios({
        method: 'POST',
        url: Base_url.sociallogin,
        data: {
          provider_name: provider_name,
          email: email,
          provider_id: provider_id,
        },
      });

      if (res.data.success === true) {
        const token = res.data.data.token;
        console.log('token', token);
        if (token) {
          await AsyncStorage.setItem('token', token);
        }
        Alert.alert('Login Successfully');
        console.log('Social Login Response:', res.data);
      } else {
        Alert.alert('Error', 'Something went wrong with social login.');
      }
    } catch (error) {
      console.error('Social login error:', error);

      if (error.response) {
        console.log('Error response from server:', error.response.data);
        // Alert.alert(
        //   'Error',
        //   `Server error: ${error.response.data.message || 'Unknown error'}`,
        // );
      } else if (error.request) {
        console.log('Error request:', error.request);
        Alert.alert(
          'Error',
          'No response from the server. Please check your network.',
        );
      } else {
        console.log('General error:', error.message);
        Alert.alert('Error', `An error occurred: ${error.message}`);
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{padding: 0, margin: 0}}>
      <ImageBackground
        source={require('../assets/background.png')}
        resizeMode="cover"
        style={{flex: 1, width: '100%', height:'100%'}}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            resetForm,
          }) => (
            <View style={styles.container}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={require('../assets/logo.png')}
                  style={{width: 250, height: 100, resizeMode: 'cover'}}
                />
              </View>
              <View style={{alignItems: 'center', marginTop: 20}}>
                <Text style={styles.h1}>Login</Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <View style={[styles.textfield_wrapper, {marginTop: 30}]}>
                  <Text style={[styles.text, {paddingLeft: 8, fontSize: 15}]}>
                    Email
                  </Text>
                  <TextInput
                    placeholder="Email"
                    style={styles.textfield}
                    placeholderTextColor="#000"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errortext}>{errors.email}</Text>
                  )}
                </View>
                <View style={styles.textfield_wrapper}>
                  <Text style={[styles.text, {paddingLeft: 8, fontSize: 15}]}>
                    Password
                  </Text>
                  <View
                    style={[
                      styles.textfield,
                      {flexDirection: 'row', alignItems: 'center'},
                    ]}>
                    <TextInput
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#000"
                      style={[
                        styles.textfield,
                        {flex: 1, borderWidth: 0, paddingLeft: 0, marginTop: 0},
                      ]}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={{marginRight: 10}}>
                      <Icon
                        name={showPassword ? 'visibility' : 'visibility-off'}
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errortext}>{errors.password}</Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <CheckBox
                      value={isChecked}
                      onValueChange={toggleCheckbox}
                      style={{marginRight: 8}}
                      tintColors={{true: 'green', false: '#ffff'}}
                    />
                    <Text style={[styles.text, {marginTop: 0}]}>
                      Remember Me
                    </Text>
                  </View>
                </View>

                <View style={{alignItems: 'center', marginTop: 60}}>
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={handleSubmit}
                    disabled={loading}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.btntext}>Login</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={{marginTop: 10}}>
                  <Text style={[styles.h3, {textAlign: 'center'}]}>or</Text>
                  <TouchableOpacity style={styles.btnview2} onPress={signIn}>
                    <Image
                      source={require('../assets/google.png')}
                      style={{height: 40, width: 40, resizeMode: 'contain'}}
                    />
                    <Text
                      style={{
                        color: '#000000',
                        alignSelf: 'center',
                        fontWeight: 'regular',
                        fontSize: 18,
                        marginRight: 40,
                      }}>
                      Continue with Google
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </ImageBackground>
    </ScrollView>
  );
};

export default Login;
