import { useGoogleMap } from '@/contexts/GoogleMapContext';
import { Canvas, Circle } from "@shopify/react-native-skia";
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome6';


export default function Tab() {
  const { getPlaceDetails } = useGoogleMap();
  const [locationName, setLocationName] = useState("")
  const [address, setAddress] = useState("")
  const [showBottomBar, setShowBottomBar] = useState(false)

  //Fetches and Sets Location Data 
  async function refreshLocationData() {
    let result = await getPlaceDetails(null, [currentRegion.latitude, currentRegion.longitude]);
    setLocationName(result.locationName)
    setAddress(result.address)
  }


  useEffect(() => {

    async function startUpFunction() {
      await refreshLocationData()
    }

    startUpFunction()
  }, [])


  const [currentRegion, setCurrentRegion] = useState({
    latitude: 3.0567,
    longitude: 101.5851,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  //UI Sizes
  let ScreenWidth = Dimensions.get("screen").width;
  let ScreenHeight = Dimensions.get("screen").height;

  return (
    <View style={{
      flex: 1,
      flexDirection: "column"
    }}>
      <View>
        <MapView
          style={{ zIndex: -10, flex: 1 }}
          initialRegion={{
            latitude: 3.0567,
            longitude: 101.5851,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}

          onRegionChangeComplete={
            (region) => {
              setCurrentRegion(region)
              refreshLocationData()
            }

          }
        >
          <Marker coordinate={currentRegion} />
        </MapView>
      </View>


      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Icon
          name="magnifying-glass"
          color="#000000"
          size={20}
        />
        <Text>{locationName}</Text>
      </View>

      {/* Info Bar at the Bottom */}
      {
        showBottomBar ?
          <View style={styles.infoBar}>
            <Canvas style={{ width: "100%", height: "100%", backgroundColor: "transparent", position: "absolute", top: 0 }}>
              <Circle
                cx={ScreenWidth / 2}
                cy={ScreenHeight * 0.45}
                r={ScreenWidth}
                color={"white"}
              />
            </Canvas>

            <View style={styles.infoBarTextBox}>
              <Text style={styles.locationName}>
                {locationName}
              </Text>

              <Text style={styles.addressText}>
                {address}
              </Text>
            </View>
          </View> :

          <View>
            <Text>This is a mini bottom bar</Text>

          </View>
      }


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
    height: "50%",
    backgroundColor: "transparent",
    flexDirection: "column",
    alignItems: "center"
  },

  infoBarTextBox: {
    marginTop: "15%",
    width: "90%",
    flexDirection: "column",
    alignItems: "flex-start"
  },

  locationName: {
    fontSize: 18,
    color: "#000000",
    fontFamily: "bold",
    lineHeight: 20
  },

  addressText: {
    fontSize: 14,
    color: "#999999",
    fontFamily: "regular"
  }

});