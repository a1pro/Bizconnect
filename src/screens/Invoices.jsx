import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles/Styles';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Base_url} from '../ApiUrl';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../component/Header';

const renderInvoiceData = ({item}) => {
  return (
    <View style={styles.invoiceContainer}>
      <View>
        <Text style={[styles.h3, {color: '#000000'}]}>{item.name}</Text>
        <Text style={{color: '#F34343'}}>{item.invoice_number}</Text>
      </View>
      <View>
        <Text style={[styles.h3, {color: '#000000'}]}>
          ${item.total_amount}
        </Text>
        <Text>{item.status}</Text>
        <Text>{item.date_reminder}</Text>
      </View>
    </View>
  );
};
const Invoices = () => {
  const navigation = useNavigation();
  const [invoicesData, setInvoicesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // get invoice data api
  const getInvoice = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }
      const res = await axios({
        method: 'GET',
        url: Base_url.getInvoice,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success === true) {
        setLoading(false);
        setInvoicesData(res.data.data.reviews);
        console.log(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getInvoice();
  },[]);
  return (
    <>
      {/*headersection */}
      <Header title="Invoices" />
      <View style={styles.container}>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#eeee',
          }}>
          <Text>2022</Text>
          <Text>$3,365</Text>
        </View> */}
        {loading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            <FlatList
              data={invoicesData}
              renderItem={renderInvoiceData}
              // keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.scrollContainer}
            />
          </>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate('AddInvoices')}
          style={{
            backgroundColor: '#00008B',
            width: 70,
            height: 70,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-end',
          }}>
          <MaterialIcons name="add" size={40} color="#ffff" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Invoices;