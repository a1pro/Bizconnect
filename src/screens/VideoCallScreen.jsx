import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';

const VideoCallScreen = ({ route, navigation }) => {
  const [identity, setIdentity] = useState(null);
  const [otherIdentity, setOtherIdentity] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isInRoom, setIsInRoom] = useState(false);

  // Function to generate a unique call ID
  const generateCallID = (identity, otherIdentity) => {
    const ids = [identity, otherIdentity];
    ids.sort();
    return ids.join('-');
  };

  const callID = identity && otherIdentity ? generateCallID(identity, otherIdentity) : null;

  useEffect(() => {
    if (route.params) {
      const { identity, otherIdentity, userName } = route.params;
      if (identity && otherIdentity && userName) {
        setIdentity(identity);
        console.log("userID", identity);
        setOtherIdentity(otherIdentity);
        setUserName(userName);
      } else {
        console.error('Route params are missing values.');
      }
    } else {
      console.error('Route params are undefined.');
    }
  }, [route.params]);

  const handleOnCallEnd = (callID, reason, duration) => {
    console.log('Call ended:', reason);
    navigation.navigate('Chat');
  };

  const handleOnError = (error) => {
    console.error('Zego error:', error);
  };

  const handleRoomJoinStatus = (status) => {
    if (status) {
      setIsInRoom(true);
      console.log('User successfully joined the room.');
    } else {
      setIsInRoom(false);
      console.log('User has not joined the room yet.');
    }
  };

  // Handle loading state until parameters are available
  if (!identity || !otherIdentity || !userName) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      {callID && (
        <ZegoUIKitPrebuiltCall
          appID={116186411}
          appSign="a5a27f3365e76214f4f253147732b1489d423f420f70a4ffcf1e5bd90e1dcdcf"
          userID={identity}
          userName={userName}
          callID={callID}
          config={{
            ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
            onCallEnd: handleOnCallEnd,
            onError: handleOnError,
            onJoinRoom: () => handleRoomJoinStatus(true),
            onLeaveRoom: () => handleRoomJoinStatus(false),
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});

export default VideoCallScreen;
