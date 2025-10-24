import { useGoogleMap } from '@/contexts/GoogleMapContext';
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MapDetailBox from '@/assets/components/MapDetailBox';

export default function Tab() {
  const { getPlaceDetails } = useGoogleMap();
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [hideDestinationIcon, setHideDestinationIcon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState(null);

  //Fetches and Sets Location Data 
  async function refreshLocationData() {
    setLoading(true);
    let result = await getPlaceDetails(null, [currentRegion.latitude, currentRegion.longitude]);

    if (result.error) {
      console.log("Something went wrong", result.error);
    }

    else {
      setLocationName(result.locationName)
      setAddress(result.address)
      if (result.photo){
        setPhotoURL(result.photo)
      }
      else{
        setPhotoURL(null)
      }
    }

    setLoading(false);
  }


  useEffect(() => {
    async function startUpFunction() {
      await refreshLocationData()
    }

    startUpFunction()
  }, [])
  


  const [currentRegion, setCurrentRegion] = useState({
    latitude: 3.2144774,
    longitude: 101.6721846,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  

  return (
    <View style={{
      flex: 1,
      flexDirection: "column"
    }}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ zIndex: -10, flex: 1, height: "100%", width: "100%" }}
          initialRegion={currentRegion}

          onRegionChangeComplete={
            (region) => {
              setCurrentRegion(region)
              refreshLocationData()
            }

          }
        >

        </MapView>

        {/* Center Icon */}
        {hideDestinationIcon? null: <View style={{ zIndex: 10, position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -15 }, { translateY: -40 }] }}>
          <Icon
            name="location-dot"
            color="#ED0000"
            size={40}
          />
        </View>}

      </View>


      {/* Search Bar -> Google Autocomplete */}
      <View style={styles.searchBar}>
        <Icon
          name="magnifying-glass"
          color="#000000"
          size={20}
        />
        <TextInput/>
      </View>

      {/* Info Bar at the Bottom */}
      <MapDetailBox locationName={locationName} address={address} photoURL={photoURL} setHideDestinationIcon={setHideDestinationIcon} loading={loading}/>
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

});
