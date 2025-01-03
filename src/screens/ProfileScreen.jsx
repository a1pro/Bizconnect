import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { Base_url } from '../ApiUrl';
import { useDispatch, useSelector } from 'react-redux';
import { getUserdata } from '../redux/UserDataSlice';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('User Name');  // Set initial fallback name
  const [profilePic, setProfilePic] = useState('');
  const user = useSelector(state => state.user);  // Get user data from Redux
  const dispatch = useDispatch();

  console.log('userData', user.user);
  console.log("userdata", user.user);

  // Fetch user data on mount
  useEffect(() => {
    dispatch(getUserdata());
  }, [dispatch]);

  // Fetch name and profile pic, and set fallback for name if not present
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedProfilePic = await AsyncStorage.getItem('profile_pic');

        // Use stored values if available
        if (storedName) {
          setName(storedName);
        }

        if (storedProfilePic) {
          setProfilePic(storedProfilePic);
        } else if (user && (user.user.profile_pic || user.user.business_name || user.user.full_name)) {
          setProfilePic(user.user.profile_pic);

          // Set name based on priority: business_name > full_name > default
          const userName = user.user.business_name?.trim() || user.user.full_name?.trim() || 'User Name';
          setName(userName);
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    fetchUserData();
  }, [dispatch, user]);

  // Logout functionality
  const logouthandle = async () => {
    try {
      Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const loginMethod = await AsyncStorage.getItem('loginMethod');
              if (loginMethod === 'google') {
                await GoogleSignin.signOut();
                console.log('User signed out from Google');
              }
              await AsyncStorage.clear();
              navigation.navigate('Login');
            } catch (error) {
              console.log('Logout error', error);
              Alert.alert(
                'Logout Error',
                'Something went wrong while logging out.',
              );
            }
          },
        },
      ]);
    } catch (error) {
      console.log('Logout error', error);
      Alert.alert('Logout Error', 'Something went wrong while logging out.');
    }
  };

  // Handle profile image change (Camera or Gallery)
  const handleEditProfileImage = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () =>
            launchCamera({}, response => {
              if (response.assets && response.assets.length > 0) {
                setProfileImage(response.assets[0]);
                uploadProfileImage(response.assets[0]);
              }
            }),
        },
        {
          text: 'Gallery',
          onPress: () =>
            launchImageLibrary({}, response => {
              if (response.assets && response.assets.length > 0) {
                setProfileImage(response.assets[0]);
                uploadProfileImage(response.assets[0]);
              }
            }),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  // Upload Profile Image to Server
  const uploadProfileImage = async image => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'User is not authenticated.');
        return;
      }

      const formData = new FormData();
      formData.append('photo', {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      });

      const response = await axios({
        method: 'post',
        url: Base_url.profilepic,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const imageUrl = response.data.data;
        const fullImageUrl = imageUrl
          ? imageUrl.startsWith('http')
            ? imageUrl
            : `https://bizconnect.a1professionals.net/storage/uploads/profile_pic/${imageUrl}`
          : null;

        setProfileImage({ uri: fullImageUrl });
        dispatch(getUserdata());
        Alert.alert('Success', 'Profile image updated successfully');
      } else {
        Alert.alert('Error', 'Failed to upload your photo.');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      Alert.alert('Error', 'An error occurred while uploading the photo.');
    }
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/profile-image.png')}
        resizeMode="cover"
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          height: 400,
        }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios-new" size={25} color="#ffff" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.h3}>Profile</Text>
            <View style={{ position: 'relative' }}>
              <Image
                source={
                  profilePic
                    ? { uri: profilePic }
                    : require('../assets/user2.png') // Default image if no profile pic
                }
                style={{
                  width: 120,
                  height: 120,
                  marginTop: 30,
                  marginBottom: 10,
                  borderRadius: 20,
                }}
              />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={handleEditProfileImage}>
                <Icon name="camera" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            {/* Display user's name or fallback to 'User Name' */}
            <Text style={styles.h3}>{name || 'User Name'}</Text>
          </View>
        </View>
      </ImageBackground>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={{ marginTop: 40 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 10,
                paddingBottom: 10,
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('Setting')}>
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <Image source={require('../assets/settings.png')} />
                <Text style={[styles.h3, { color: '#000000', marginLeft: 10 }]}>
                  Settings
                </Text>
              </View>
              <View>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={30}
                  color="#000000"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 10,
                paddingBottom: 10,
                alignItems: 'center',
                marginTop: 20,
              }}
              onPress={() => navigation.navigate('Tickets')}>
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <Image source={require('../assets/support.png')} />
                <Text style={[styles.h3, { color: '#000000', marginLeft: 10 }]}>
                  Support
                </Text>
              </View>
              <View>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={30}
                  color="#000000"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                paddingTop: 10,
                paddingBottom: 20,
                alignItems: 'center',
                marginTop: 20,
              }}
              onPress={logouthandle}>
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <Image source={require('../assets/logout.png')} />
                <Text style={[styles.h3, { color: '#000000', marginLeft: 10 }]}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ProfileScreen;
