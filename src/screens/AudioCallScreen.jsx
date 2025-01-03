import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PermissionsAndroid, Platform } from 'react-native';
import { TwilioVideo } from 'react-native-twilio-video-webrtc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Base_url } from '../ApiUrl';

const AudioCallScreen = ({ route, navigation }) => {
  const [roomName, setRoomName] = useState(null);
  const [token, setToken] = useState(null);
  const videoRef = useRef(null);

  const { identity, otherIdentity } = route.params;
  const room = `${identity}-${otherIdentity}`;

  // Fetch Twilio token from your API
  const getTwilioToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found in AsyncStorage');
        return null;
      }

      const res = await axios.post(`${Base_url.twiliotoken}`, {
        identity: identity,
        room_name: room,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success === true) {
        console.log('Twilio token retrieved successfully');
        return res.data.token;
      } else {
        console.log('Error: Twilio token generation failed');
        return null;
      }
    } catch (error) {
      console.log('Error fetching Twilio token:', error);
      return null;
    }
  };

  // Request microphone permissions (camera permission is not necessary for audio call)
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission granted');
        } else {
          console.log('Microphone permission denied');
        }
      } catch (err) {
        console.log(error);
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      await requestPermissions();
      const fetchedToken = await getTwilioToken();
      if (fetchedToken) {
        setToken(fetchedToken);
        setRoomName(room);
      }
    };
    fetchToken();
  }, [identity, otherIdentity]);

  const handleEndCall = () => {
    if (videoRef.current) {
      videoRef.current.disconnect();
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Call</Text>
      {token && roomName ? (
        <>
          <TwilioVideo
            ref={videoRef}
            token={token}
            roomName={roomName}
            audioOnly={true}
            onRoomDidConnect={() => console.log('Connected to room')}
            onRoomDidFailToConnect={(error) => console.log('Failed to connect to room:', error)}
            onRoomDidDisconnect={(error) => console.log('Room disconnected:', error)}
            onParticipantAddedAudioTrack={(participant, track) => {
              console.log('New audio track added:', track);
            }}
            onParticipantRemovedAudioTrack={(participant, track) => {
              console.log('Audio track removed:', track);
            }}
            onParticipantConnected={(participant) => {
              console.log('Participant connected:', participant.identity);
            }}
            onParticipantDisconnected={(participant) => {
              console.log('Participant disconnected:', participant.identity);
            }}
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}

      <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
        <Ionicons name="call" size={30} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  endCallButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default AudioCallScreen;
