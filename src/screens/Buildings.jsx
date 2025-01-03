import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [outerPolygon, setOuterPolygon] = useState([]); 
  const [innerPolygons, setInnerPolygons] = useState([]); 
  const [currentPolygon, setCurrentPolygon] = useState([]); 
  const [drawingOuter, setDrawingOuter] = useState(true); 

  useEffect(() => {
    // Load saved polygons from AsyncStorage when the component mounts
    const loadPolygons = async () => {
      try {
        const outerPolygonData = await AsyncStorage.getItem('outerPolygon');
        const innerPolygonsData = await AsyncStorage.getItem('innerPolygons');
        
        if (outerPolygonData) {
          setOuterPolygon(JSON.parse(outerPolygonData));
        }

        if (innerPolygonsData) {
          setInnerPolygons(JSON.parse(innerPolygonsData));
        }
      } catch (error) {
        console.error('Failed to load polygons from AsyncStorage:', error);
      }
    };

    loadPolygons();
  }, []);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setCurrentPolygon((prev) => [...prev, { latitude, longitude }]);
  };

  const handleAddPolygon = async () => {
    if (currentPolygon.length < 3) {
      Alert.alert('Error', 'A polygon must have at least 3 points.');
      return;
    }

    if (drawingOuter) {
      setOuterPolygon(currentPolygon);
      await AsyncStorage.setItem('outerPolygon', JSON.stringify(currentPolygon));
    } else {
      setInnerPolygons((prev) => [...prev, currentPolygon]);
      await AsyncStorage.setItem('innerPolygons', JSON.stringify([...innerPolygons, currentPolygon]));
    }
    setCurrentPolygon([]);
  };

  const handleClearAll = async () => {
    setOuterPolygon([]);
    setInnerPolygons([]);
    setCurrentPolygon([]);
    setDrawingOuter(true);
    await AsyncStorage.removeItem('outerPolygon');
    await AsyncStorage.removeItem('innerPolygons');
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 37.78830,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Render the outer polygon */}
        {outerPolygon.length > 0 && (
          <Polygon
            coordinates={outerPolygon}
            strokeColor="blue"
            fillColor="rgba(0, 0, 255, 0.3)"
            strokeWidth={2}
          />
        )}

        {/* Render inner polygons */}
        {innerPolygons.map((polygon, index) => (
          <Polygon
            key={index}
            coordinates={polygon}
            strokeColor="red"
            fillColor="rgba(255, 0, 0, 0.3)"
            strokeWidth={2}
          />
        ))}

        {/* Render markers for the current polygon */}
        {currentPolygon.map((coordinate, index) => (
          <Marker key={`marker-${index}`} coordinate={coordinate} />
        ))}

        {/* Render the temporary polygon while drawing */}
        {currentPolygon.length >= 3 && (
          <Polygon
            coordinates={currentPolygon}
            strokeColor={drawingOuter ? 'green' : 'orange'}
            fillColor={drawingOuter ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 165, 0, 0.3)'}
            strokeWidth={2}
          />
        )}
      </MapView>

      <View style={styles.buttons}>
        <Button
          title={drawingOuter ? 'Finalize Outer Polygon' : 'Finalize Inner Polygon'}
          onPress={handleAddPolygon}
          disabled={currentPolygon.length < 3}
        />
        <Button
          title={drawingOuter ? 'Switch to Inner Polygons' : 'Switch to Outer Polygon'}
          onPress={() => {
            if (drawingOuter && outerPolygon.length === 0) {
              Alert.alert('Error', 'You must finalize the outer polygon first!');
              return;
            }
            setDrawingOuter(!drawingOuter);
          }}
        /> 
        <Button title="Clear All" onPress={handleClearAll}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default App;
