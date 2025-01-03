import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles/Styles';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Base_url } from '../ApiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Header from '../component/Header';

// Validation schema
const validationSchema = yup.object().shape({
  invoiceNumber: yup.string().required('Invoice number is required'),
  description: yup.string().required('Description is required'),
  orderNumber: yup.string().required('Order number is required'),
  businessName: yup.string().required('Business Name is required'),
  date: yup.string().required('Date is required'),
});

const AddReviews = ({ navigation }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false); // Added loading state

  const handleDateChange = (event, date, setFieldValue) => {
    setShowDatePicker(false);
    if (date) {
      // Format the date using moment to "YYYY/MM/DD"
      const formattedDate = moment(date).format('YYYY/MM/DD');
      setFieldValue('date', formattedDate);
      setSelectedDate(date);
    }
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  // Handle Reviews function
  const handleSubmit = async (values, { resetForm }) => {
    console.log('i am working');
    console.log('date', values.date);
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      console.log('token', token);
      const res = await axios({
        method: 'post',
        url: Base_url.addreviews,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        data: {
          invoice_number: values.invoiceNumber,
          description: values.description,
          order_number: values.orderNumber,
          business_name: values.businessName,
          date: values.date,
        },
      });
      setLoading(false); // Set loading to false after request completes
      resetForm();

      if (res.data.status === true) {
        console.log('Review Added Successfully');
        Alert.alert(res.data.message);
        navigation.navigate('Review');
      }
    } catch (error) {
      setLoading(false); // Set loading to false if there's an error
      console.log(error);
      Alert.alert('Error', 'An error occurred while submitting the review.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header Section */}
      <Header title="Add Reviews" />
      {/* Form Section */}
      <ScrollView>
        <Formik
          initialValues={{
            invoiceNumber: '',
            description: '',
            orderNumber: '',
            businessName: '',
            date: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
            resetForm,
          }) => (
            <View style={{ marginTop: 30, padding: 20 }}>
              {/* Invoice Number */}
              <View style={{ marginBottom: 15 }}>
                <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: 5 }}>
                  Invoice Number
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#D9D9D9',
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    height: 50,
                  }}
                  value={values.invoiceNumber}
                  onChangeText={handleChange('invoiceNumber')}
                  onBlur={handleBlur('invoiceNumber')}
                  placeholder="Invoice Number"
                />
                {touched.invoiceNumber && errors.invoiceNumber && (
                  <Text style={[styles.errortext, { paddingLeft: 0 }]}>
                    {errors.invoiceNumber}
                  </Text>
                )}
              </View>

              {/* Description */}
              <View style={{ marginBottom: 15 }}>
                <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: 5 }}>
                  Description
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#D9D9D9',
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    height: 50,
                  }}
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  placeholder="Description"
                />
                {touched.description && errors.description && (
                  <Text style={[styles.errortext, { paddingLeft: 0 }]}>
                    {errors.description}
                  </Text>
                )}
              </View>

              {/* Order Number */}
              <View style={{ marginBottom: 15 }}>
                <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: 5 }}>
                  Order Number
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#D9D9D9',
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    height: 50,
                  }}
                  value={values.orderNumber}
                  onChangeText={handleChange('orderNumber')}
                  onBlur={handleBlur('orderNumber')}
                  placeholder="Order Number"
                />
                {touched.orderNumber && errors.orderNumber && (
                  <Text style={[styles.errortext, { paddingLeft: 0 }]}>
                    {errors.orderNumber}
                  </Text>
                )}
              </View>

              {/* Business Name */}
              <View style={{ marginBottom: 15 }}>
                <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: 5 }}>
                  Business Name
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#D9D9D9',
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    height: 50,
                  }}
                  value={values.businessName}
                  onChangeText={handleChange('businessName')}
                  onBlur={handleBlur('businessName')}
                  placeholder="Business Name"
                />
                {touched.businessName && errors.businessName && (
                  <Text style={[styles.errortext, { paddingLeft: 0 }]}>
                    {errors.businessName}
                  </Text>
                )}
              </View>

              {/* Date Picker */}
              <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: 5 }}>
                Date
              </Text>
              <TouchableOpacity onPress={showDatePickerHandler}>
                <TextInput
                  style={{
                    backgroundColor: '#D9D9D9',
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    height: 50,
                    color: '#000',
                  }}
                  value={values.date}
                  placeholder="Select Date"
                  editable={false}
                />
              </TouchableOpacity>
              {touched.date && errors.date && (
                <Text style={[styles.errortext, { paddingLeft: 0 }]}>
                  {errors.date}
                </Text>
              )}

              {/* Date Picker */}
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) =>
                    handleDateChange(event, date, setFieldValue)
                  }
                />
              )}

              {/* Save Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#00CFFF',
                  borderRadius: 10,
                  paddingVertical: 15,
                  width: '30%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}
                onPress={handleSubmit}>
                {loading ? ( // Display loader if loading is true
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

export default AddReviews;
