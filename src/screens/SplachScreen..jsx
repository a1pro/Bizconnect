import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import styles from './styles/Styles';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
      // navigation.navigate('Buildings')
    },3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      resizeMode="cover"
      style={{ width: '100%', height: '100%', flex: 1,paddingHorizontal:0 }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../assets/logo.png')}/>
          {/* <Text style={{ fontSize: 40, color: '#FFFFFF', fontWeight: '600' }}>
            Bizconnect
          </Text> */}
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.btntext}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;
