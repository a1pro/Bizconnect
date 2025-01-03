import { PermissionsAndroid, Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    const cameraPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    const microphonePermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );

    if (cameraPermission !== PermissionsAndroid.RESULTS.GRANTED || microphonePermission !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permissions not granted for Camera or Microphone');
      return false;
    }
    return true;
  } else if (Platform.OS === 'ios') {
    const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
    const microphonePermission = await request(PERMISSIONS.IOS.MICROPHONE);

    if (cameraPermission !== RESULTS.GRANTED || microphonePermission !== RESULTS.GRANTED) {
      console.log('Permissions not granted for Camera or Microphone');
      return false;
    }
    return true;
  }
};

export default requestPermissions;
