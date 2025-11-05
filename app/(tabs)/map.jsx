import MapDetailBox from "@/assets/components/MapDetailBox";
import { useGoogleMap } from "@/contexts/GoogleMapContext";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import MapView from "react-native-maps";
import Icon from "react-native-vector-icons/FontAwesome6";
import { Toast } from "toastify-react-native";
import { useNavigation } from "@react-navigation/native";

export default function Tab() {
  const navigation = useNavigation();

  const { getPlaceDetails, currentRegion, setCurrentRegion } = useGoogleMap();
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [hideDestinationIcon, setHideDestinationIcon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState(null);

  //Fetches and Sets Location Data
  async function refreshLocationData() {
    setLoading(true);
    let result = await getPlaceDetails(null, [
      currentRegion.latitude,
      currentRegion.longitude,
    ]);

    if (result.error) {
      Toast.error("Could Not Find Location Data!", "bottom");
    } else {
      setLocationName(result.locationName);
      setAddress(result.address);
      if (result.photo) {
        setPhotoURL(result.photo);
      } else {
        setPhotoURL(null);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    async function startUpFunction() {
      await refreshLocationData();
    }

    startUpFunction();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      <View style={{ flex: 1 }}>
        <MapView
          style={{ zIndex: -10, flex: 1, height: "100%", width: "100%" }}
          initialRegion={currentRegion}
          onRegionChangeComplete={(region) => {
            setCurrentRegion(region);
            refreshLocationData();
          }}
        ></MapView>

        {/* Center Icon */}
        {hideDestinationIcon ? null : (
          <View
            style={{
              zIndex: 10,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [{ translateX: -15 }, { translateY: -40 }],
            }}
          >
            <Icon name="location-dot" color="#ED0000" size={40} />
          </View>
        )}
      </View>

      {/* Search Bar Click -> Redirect to Another Page*/}
      <View style={styles.searchBarArea}>
        <TouchableOpacity onPress={() => navigation.navigate("autocomplete")}>
          {/* Input Field*/}
          <View style={styles.searchBar}>
            <Icon name="magnifying-glass" color="#000000" size={20} />
            <TextInput
              style={styles.searchBarText}
              placeholder="Enter Place Name Here..."
              editable={false}
            />
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Info Bar at the Bottom */}
      <MapDetailBox
        locationName={locationName}
        address={address}
        photoURL={photoURL}
        setHideDestinationIcon={setHideDestinationIcon}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarArea: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    width: "90%",
    flexDirection: "column",
    gap: 5,
  },

  searchBar: {
    borderRadius: 30,
    width: "100%",
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    padding: 5,
    gap: 10,
    paddingLeft: 15,
    alignItems: "center",
    boxShadow: "0px 5px 10px #C4C1C1FF",
  },

  searchBarText: {
    paddingHorizontal: 10,
    fontFamily: "regular",
    fontSize: 12,
    color: "#000000",
    width: "90%",
  },
});
