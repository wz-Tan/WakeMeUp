import MapDetailBox from "@/assets/components/MapDetailBox";
import { useGoogleMap } from "@/contexts/GoogleMapContext";
import { useEffect, useState, useRef } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/FontAwesome6";
import { Toast } from "toastify-react-native";
import { useNavigation } from "@react-navigation/native";
import LoadingPopUp from "@/assets/components/Loading";

export default function Tab() {
  const navigation = useNavigation();

  let {
    getPlaceDetails,
    cameraValues,
    currentLocation,
    activeDestination,
    setActiveDestination,
    currentDestination,
    setCurrentDestination,
    recenterCamera,
    init,
    mapInitStatus,
  } = useGoogleMap();
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [hideDestinationIcon, setHideDestinationIcon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState(null);

  const mapRef = useRef(null);

  // Initialise Map (Getting First Location)
  useEffect(() => {
    const mapInit = async () => {
      await init();
      await refreshLocationData();
    };
    mapInit();
  }, []);

  // Animate Camera Value on Context Value Change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateCamera(cameraValues);
    }
  }, [cameraValues.center]);

  //Fetches and Sets Location Data
  async function refreshLocationData() {
    setLoading(true);
    try {
      let result = await getPlaceDetails(null, [
        currentDestination.current.latitude,
        currentDestination.current.longitude,
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
    } catch (error) {
      Toast.error(`Error getting place details: ${error}`, "bottom");
    }

    setLoading(false);
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      {mapInitStatus && <LoadingPopUp loadingMessage="Initialising Map" />}
      <View style={{ flex: 1 }}>
        {/* Allow User Movement when the Destination Icon is Not Hidden*/}
        <MapView
          ref={mapRef}
          scrollEnabled={!hideDestinationIcon}
          zoomEnabled={!hideDestinationIcon}
          rotateEnabled={!hideDestinationIcon}
          pitchEnabled={!hideDestinationIcon}
          style={{ zIndex: -10, flex: 1, height: "100%", width: "100%" }}
          loadingEnabled={true}
          initialRegion={currentDestination.current}
          onRegionChangeComplete={(region) => {
            // Update the Context To Store Current Destination (may move this out of context), Then Refresh the Bottom Bar's Details
            setCurrentDestination(region);
            refreshLocationData();
          }}
        >
          {/* Current Location Icon*/}
          <Marker
            coordinate={currentLocation}
            title="Current Location"
            pinColor={"#0000FF"}
          />

          {/* Current Destination*/}
          <Marker
            coordinate={activeDestination}
            title="Active Destination"
            pinColor={"#FF0000"}
          />
        </MapView>
        {/* Center Icon */}
        {hideDestinationIcon ? null : (
          <View
            style={{
              zIndex: 10,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [{ translateX: -20 }, { translateY: -45 }],
              opacity: 0.7,
            }}
          >
            <Icon name="location-crosshairs" color="#333333" size={40} />
          </View>
        )}
      </View>

      {/* Search Bar Click -> Redirect to Another Page*/}
      <View style={styles.searchBarArea}>
        <TouchableOpacity onPress={() => navigation.navigate("autocomplete")}>
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
        setActiveDestination={() =>
          setActiveDestination(currentDestination.current)
        }
        setHideDestinationIcon={setHideDestinationIcon}
        loading={loading}
      />

      {/* Recenter Button */}
      <TouchableOpacity
        onPress={async () => {
          setLoading(true);
          await recenterCamera("current");
          setLoading(false);
        }}
        style={styles.recenterButton}
      >
        <Icon name="location-arrow" color="#000000" size={20} />
      </TouchableOpacity>

      {/* Go to Target*/}
      <TouchableOpacity
        onPress={async () => {
          setLoading(true);
          await recenterCamera("destination");
          setLoading(false);
        }}
        style={[styles.recenterButton, { top: 150 }]}
      >
        <Icon name="location-dot" color="#FF0000" size={20} />
      </TouchableOpacity>
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

  recenterButton: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 90,
    boxShadow: "0px 5px 10px #C4C1C1FF",
    top: 100,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
});
