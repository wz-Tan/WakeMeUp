import { useGoogleMap } from '@/contexts/GoogleMapContext';
import { Canvas, Circle } from "@shopify/react-native-skia";
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome6';
import ImageNotFound from "@/assets/icon/noImage.png"

export default function Tab() {
  const { getPlaceDetails } = useGoogleMap();
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [showBottomBar, setShowBottomBar] = useState(false);
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

  //UI Sizes
  let ScreenWidth = Dimensions.get("screen").width;
  let ScreenHeight = Dimensions.get("screen").height;

  return (
    <View style={{
      flex: 1,
      flexDirection: "column"
    }}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ zIndex: -10, flex: 1, height: "100%", width: "100%" }}
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

        </MapView>

        {/* Center Icon */}
        {showBottomBar? null: <View style={{ zIndex: 10, position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -15 }, { translateY: -40 }] }}>
          <Icon
            name="location-dot"
            color="#ED0000"
            size={40}
          />
        </View>}

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
                color={"#F3EEFF"}
              />
            </Canvas>

            <View style={styles.infoBarTextBox}>
              <TouchableOpacity style={{ alignSelf: "center", position: "absolute", top: -40 }} onPress={() => setShowBottomBar(false)}>
                <Icon
                  name="grip-lines"
                  color="#000000"
                  size={18}
                />
              </TouchableOpacity>

              <Text style={styles.locationName}>
                {locationName}
              </Text>

              <Text style={styles.addressText}>
                {address}
              </Text>

              <View style={[{ width: "100%", position: "absolute", bottom: 30}]}>
                <View style={styles.imageRow}>
                {photoURL? 
                  <Image style={styles.imageBox} source={{uri:`${photoURL}`}}/>
                  :
                  <Image style={styles.imageBox} source={ImageNotFound}/>
                }
              </View>
              
                <TouchableOpacity style={[styles.button, { backgroundColor: "#359DFF" }]}>
                  <Text style={styles.buttonText}>Set Active ✅</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { backgroundColor: "#FF358C" }]}>
                  <Text style={styles.buttonText}>Favourite 🧡</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View> :

          <View style={styles.miniBottomBar}>
            <TouchableOpacity onPress={() => setShowBottomBar(true)}>
              <Icon
                name="grip-lines"
                color="#000000"
                size={18}
              />
            </TouchableOpacity>

            <Text style={styles.locationName}>{loading ? "Loading..." : locationName}</Text>
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
    height: "60%",
    backgroundColor: "transparent",
    flexDirection: "column",
    alignItems: "center",
  },

  infoBarTextBox: {
    marginTop: "15%",
    width: "90%",
    height:"90%",
    flexDirection: "column",
    alignItems: "flex-start",
    position: "relative"
  },

  locationName: {
    fontSize: 18,
    color: "#000000",
    fontFamily: "bold",
    lineHeight: 24
  },

  addressText: {
    fontSize: 14,
    color: "#999999",
    fontFamily: "regular"
  },

  miniBottomBar: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    paddingBottom: 30,
    position: "absolute",
    width: "100%",
    bottom: -20,
    borderRadius: 30,
    backgroundColor: "#F3EFFF",
    gap: 5
  },

  imageRow: {
    flexDirection: "row",
    width: "100%",
    height: 180,
    alignItems: "center",
    borderRadius: 15,
    marginVertical: 10
  },

  imageBox: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 15
  },

  button: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 3px 5px #C4C1C1FF",
    marginTop: 10
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "bold",
    lineHeight: 18,
  }



});