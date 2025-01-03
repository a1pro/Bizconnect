import React, { useEffect, useMemo } from 'react';
import { Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getReview } from '../redux/GetReviewSlice';
import styles from './styles/Styles';

const renderReviews = ({ item }) => {
  return (
    <>
      {item?.status === 'Completed' && (
        <View style={styles.reviewWrapper}>
          <View style={styles.reviewHeader}>
            <Text style={styles.businessName}>{item.business_name}</Text>
            <View style={styles.invoiceContainer}>
              <Text style={styles.invoiceLabel}>Invoice No:</Text>
              <Text style={styles.invoiceNumber}>{item.invoice_number}</Text>
            </View>
          </View>

          <View style={styles.reviewDetails}>
            <Text>{item.date}</Text>
            <View style={styles.orderContainer}>
              <Text style={styles.orderLabel}>Order No:</Text>
              <Text style={styles.orderNumber}>{item.order_number}</Text>
            </View>
          </View>
          <Text style={styles.reviewText}>{item.description}</Text>
        </View>
      )}
    </>
  );
};

const CompletedReviews = () => {
  const { review = [], loading } = useSelector(state => state.review);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReview());
  }, [dispatch]);

  // Filter out completed reviews safely
  const CompletedReviews = useMemo(() => {
    return Array.isArray(review) ? review.filter(item => item.status === 'Completed') : [];
  }, [review]);

  // Loader while fetching
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Reviews...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={CompletedReviews}
      renderItem={renderReviews}
      keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
      contentContainerStyle={styles.flatListContainer}
    />
  );
};

export default CompletedReviews;
