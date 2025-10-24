import MapDetailBox from '@/assets/components/MapDetailBox';
import { useGoogleMap } from '@/contexts/GoogleMapContext';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Toast } from 'toastify-react-native';

export default function Tab() {
  const {getPlaceDetails, getPlaceAutocomplete } = useGoogleMap();
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [hideDestinationIcon, setHideDestinationIcon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState(null);
  const [inputText, setInputText] = useState("");
  const [autocompleteLocations, setAutocompleteLocations] = useState(undefined)

  //Fetches and Sets Location Data 
  async function refreshLocationData() {
    setLoading(true);
    let result = await getPlaceDetails(null, [currentRegion.latitude, currentRegion.longitude]);

    if (result.error) {
      Toast.error("Could Not Find Location Data!", "bottom")
    }

    else {
      setLocationName(result.locationName)
      setAddress(result.address)
      if (result.photo) {
        setPhotoURL(result.photo)
      }
      else {
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
        {hideDestinationIcon ? null : <View style={{ zIndex: 10, position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -15 }, { translateY: -40 }] }}>
          <Icon
            name="location-dot"
            color="#ED0000"
            size={40}
          />
        </View>}

      </View>


      {/* Search Bar -> Google Autocomplete */}
      <View style={styles.searchBar}>
        <TouchableOpacity

          onPress={async () => {
            let response = await getPlaceAutocomplete(inputText, currentRegion)

            if (response.error){
              Toast.error("Error occured when getting autocomplete results :(", "bottom")
            }

            else{
              console.log("retured autocomplete results are ", response)
            }

          }}

          style={{paddingLeft: 10}}
        >
          <Icon
            name="magnifying-glass"
            color="#000000"
            size={20}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.searchBarText}
          placeholder='Enter Place Name Here...'
          onChangeText={setInputText}
          value={inputText}
        />
      </View>

      {/* Info Bar at the Bottom */}
      <MapDetailBox locationName={locationName} address={address} photoURL={photoURL} setHideDestinationIcon={setHideDestinationIcon} loading={loading} />
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
    padding: 5,
    gap: 10,
    alignItems: "center"
  },

  searchBarText: {
    paddingHorizontal: 10,
    fontFamily: "regular",
    fontSize: 12,
    color: "#000000",
    width: "90%"
  }

});
