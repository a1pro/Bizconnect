import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import styles from './styles/Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUser} from '../redux/GetUserSlice';

const ChatInbox = () => {
  const navigation = useNavigation();
  const userData = useSelector(state => state.getuser.getuser);
  const dispatch = useDispatch();

  // State to handle search query and filtered users
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // For refresh control

  // Function to handle search input change
  const handleSearchChange = query => {
    setSearchQuery(query);
    fetchSearchResults(query);
  };

  // Fetch search results from API based on query
  const fetchSearchResults = async query => {
    if (query.trim() === '') {
      setFilteredUsers(userData);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      // Send the search query in the body as POST request
      const response = await axios.post(
        'https://bizconnect.a1professionals.net/api/v1/get/search/users',
        {search: query},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setFilteredUsers(response.data.data || []);
      } else {
        setError('No matching users found');
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Error fetching search results');
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh function to reload data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getUser());
    setIsRefreshing(false);
  };

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(userData);
  }, [userData]);

  // Render each item in the FlatList
  const renderChatData = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ChatScreen', {
          userName: item.full_name,
          userProfilePic: item.profile_pic,
          chatId: item.id,
        })
      }>
      <View style={styles.chatinboxwrapper}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {item.profile_pic ? (
            <Image
              source={{uri: item.profile_pic}}
              style={{width: 50, height: 50, borderRadius: 25}}
            />
          ) : (
            <AntDesign name="user" size={40} color="#000" />
          )}
          <Text
            style={{
              color: '#000000',
              fontSize: 20,
              fontWeight: '500',
              paddingLeft: 20,
            }}>
            {item.full_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={[styles.headersection, {paddingTop: 20, paddingBottom: 20}]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{
            position: 'absolute',
            left: 10,
            width: 50,
            height: 50,
            top: 20,
          }}>
          <MaterialIcons name="arrow-back-ios-new" size={25} color="#ffff" />
        </TouchableOpacity>
        <TextInput
          placeholder="Search here"
          placeholderTextColor="#000"
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={[
            styles.textfield,
            {
              width: '60%',
              height: 40,
              marginLeft: 20,
              padding: 5,
              marginTop: 0,
            },
          ]}
        />
      </View>

      {/* Display loading or error states */}
      {loading ? (
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text>Loading...</Text>
        </View>
      ) : error ? (
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text>{error}</Text>
        </View>
      ) : filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          renderItem={renderChatData}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing} 
              onRefresh={handleRefresh}
            />
          }
        />
      ) : (
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text>No matching users found</Text>
        </View>
      )}
    </>
  );
};

export default ChatInbox;
