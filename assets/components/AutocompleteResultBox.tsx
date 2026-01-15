import { useGoogleMap } from "@/contexts/GoogleMapContext";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
const AutocompleteResultBox = ({
  locationInfo,
  navigation,
}: {
  locationInfo: any;
  navigation: any;
  setCameraValues: any;
}) => {
  const { getPlaceDetails, setCameraValues } = useGoogleMap();

  let mainLocationText = locationInfo.structuredFormat.mainText.text;
  let subLocationText = locationInfo.structuredFormat.secondaryText.text;
  let distance = locationInfo.distanceMeters;
  let formattedDistance = distance / 1000;
  let latitude: number;
  let longitude: number;

  useEffect(() => {
    async function GetPlaceDetails() {
      let result = await getPlaceDetails(mainLocationText, null);
      latitude = result.coordinates.latitude;
      longitude = result.coordinates.longitude;
    }
    GetPlaceDetails();
  });

  return (
    <TouchableOpacity
      onPress={() => {
        // Change Context Camera Value to Current Location
        if (latitude && longitude) {
          setCameraValues({
            center: {
              latitude: latitude,
              longitude: longitude,
            },
            pitch: 10,
            heading: 10,
          });
        }

        // Data Not Loaded Yet
        else {
          console.log(
            "Autocomplete Result Box Cannot Retrieve The Coordinates Yet",
          );
        }

        navigation.navigate("map");
      }}
    >
      <View style={styles.container}>
        <View style={{ justifyContent: "center" }}>
          <View style={styles.iconCircle}>
            <Icon name="location-dot" size={20} color="#FFFFFF" />
          </View>

          {/*In Cases Where Distance is NaN*/}
          {!Number.isNaN(formattedDistance) && (
            <Text style={styles.locationSubtext}>
              {formattedDistance.toFixed(1)}km
            </Text>
          )}
        </View>

        <View
          style={{ paddingHorizontal: 10, borderRadius: 15, flexShrink: 1 }}
        >
          <Text style={styles.locationText}>{mainLocationText}</Text>
          <Text style={styles.locationSubtext}>{subLocationText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    boxShadow: "0px 5px 5px #C4C1C1FF",
    marginVertical: 10,
    alignSelf: "center",
    overflow: "hidden",
  },

  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 180,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  locationText: {
    fontSize: 16,
    fontFamily: "bold",
    lineHeight: 20,
  },

  locationSubtext: {
    fontSize: 12,
    fontFamily: "regular",
    color: "#999999",
  },
});

export default AutocompleteResultBox;
