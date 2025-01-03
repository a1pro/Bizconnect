import React, { useState } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text, Image } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { isPointInPolygon } from 'geolib';

// Replace with your own image source, for example, an icon in your assets folder
const iconImage = require('../assets/facebook-icon.png');

const App = () => {
  // Parent polygon coordinates (room/house shape)
  const [polygonCoordinatesList, setPolygonCoordinatesList] = useState([
    [
      { latitude: 37.78825, longitude: -122.4324 },
      { latitude: 37.78845, longitude: -122.4524 },
      { latitude: 37.76825, longitude: -122.4524 },
      { latitude: 37.76825, longitude: -122.4324 },
    ],
  ]);

  // State for handling polygon creation mode and inner polygons
  const [isCreatingPolygon, setIsCreatingPolygon] = useState(false);
  const [placedPolygons, setPlacedPolygons] = useState([]); // Track placed fire equipment polygons
  const [currentPolygonCoordinates, setCurrentPolygonCoordinates] = useState([]); // Coordinates for the polygon being created

  // Function to handle map press for placing polygons (representing fire equipment)
  const onMapPress = (e) => {
    if (isCreatingPolygon) {
      const coordinate = e.nativeEvent.coordinate;

      // Ensure the new polygon point is inside the parent polygon
      const selectedPolygon = polygonCoordinatesList[polygonCoordinatesList.length - 1];
      const insideParentPolygon = isPointInPolygon(
        { latitude: coordinate.latitude, longitude: coordinate.longitude },
        selectedPolygon
      );

      if (insideParentPolygon) {
        setCurrentPolygonCoordinates((prevCoordinates) => [
          ...prevCoordinates,
          coordinate,
        ]);
      } else {
        Alert.alert('Invalid Location', 'The new polygon must be inside the parent polygon!');
      }
    }
  };

  // Function to finish drawing the current polygon and add it to the placed polygons list
  const finishPolygonPlacement = () => {
    if (currentPolygonCoordinates.length >= 3) { // Polygon should have at least 3 points
      setPlacedPolygons((prevPolygons) => [
        ...prevPolygons,
        currentPolygonCoordinates,
      ]);
      setCurrentPolygonCoordinates([]); // Reset the current polygon coordinates for the next one
    } else {
      Alert.alert('Invalid Polygon', 'A polygon must have at least 3 points.');
    }
  };

  // Function to start drawing a new polygon (representing a fire equipment)
  const handlePolygonSelect = () => {
    if (isCreatingPolygon) {
      finishPolygonPlacement(); // Finalize the current polygon if the user tries to start a new one
    }
    setIsCreatingPolygon(true);
    setCurrentPolygonCoordinates([]); // Reset the current polygon coordinates for a fresh start
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={onMapPress} // Handle map press for placing polygons
      >
        {/* Render parent polygon */}
        {polygonCoordinatesList.map((polygonCoordinates, index) => (
          <Polygon
            key={index}
            coordinates={polygonCoordinates}
            strokeColor="blue"
            fillColor="rgba(0, 0, 255, 0.3)"
            strokeWidth={2}
          />
        ))}

        {/* Render placed polygons (representing fire equipment) */}
        {placedPolygons.map((polygon, index) => (
          <Polygon
            key={index}
            coordinates={polygon}
            strokeColor="green"
            fillColor="rgba(0, 255, 0, 0.3)"
            strokeWidth={2}
          />
        ))}

        {/* Render the current polygon being drawn */}
        {isCreatingPolygon && currentPolygonCoordinates.length > 1 && (
          <Polygon
            coordinates={currentPolygonCoordinates}
            strokeColor="red"
            fillColor="rgba(255, 0, 0, 0.3)"
            strokeWidth={2}
          />
        )}

        {/* Render a marker for each fire equipment polygon */}
        {placedPolygons.map((polygon, index) => {
          // Just place the icon in the center of each polygon for now
          const centerCoordinate = polygon[0];
          return (
            <Marker key={index} coordinate={centerCoordinate}>
              <Image source={iconImage} style={styles.markerImage} />
            </Marker>
          );
        })}
      </MapView>

      {/* Buttons to toggle marker creation */}
      <TouchableOpacity style={styles.button} onPress={handlePolygonSelect}>
        <Text style={styles.buttonText}>Start New Polygon</Text>
      </TouchableOpacity>
      {isCreatingPolygon && (
        <TouchableOpacity style={styles.button} onPress={finishPolygonPlacement}>
          <Text style={styles.buttonText}>Finish Polygon Placement</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.button} onPress={() => setIsCreatingPolygon(false)}>
        <Text style={styles.buttonText}>Cancel Polygon Creation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  map: {
    flex: 1,
  },
  button: {
    backgroundColor: '#008CBA',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    flex:1
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    flex:1
  },
  markerImage: {
    width: 40,
    height: 40,
    backgroundColor: 'yellow',
    margin: 10,
  },
});

export default App;
