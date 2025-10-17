import { useGoogleMap } from '@/contexts/GoogleMapContext';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome6';


export default function Tab() {
  const { getPlaceDetails } = useGoogleMap();



  useEffect(()=>{
    async function startUpFunction(){
      let result=await getPlaceDetails("Burung hantu ss15");
    }

    startUpFunction()
    
  }, [])

  const [currentRegion, setCurrentRegion] = useState({
    latitude: 3.0567,
    longitude: 101.5851,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <View style={{
      flex: 1,
      flexDirection: "column"
    }}>
      <MapView
        style={{ flex: 1, zIndex: -10 }}
        initialRegion={{
          latitude: 3.0567,
          longitude: 101.5851,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChange={(region) => setCurrentRegion(region)}
      >
        <Marker coordinate={currentRegion} />
      </MapView>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Icon
          name="magnifying-glass"
          color="#000000"
          size={20}
        />
        <Text>Search Bar Here </Text>
      </View>

      {/* Info Bar at the Bottom */}
      <View style={styles.infoBar}>

      </View>




    </View >

  );
}

const styles = StyleSheet.create({
  searchBar: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    borderRadius: 30,
    width: "80%",
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    padding: 15,
    gap: 10,
    alignItems: "center"
  },

  infoBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    height: "40%",
  }
});