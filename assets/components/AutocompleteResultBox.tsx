import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
const AutocompleteResultBox = ({ locationInfo }: { locationInfo: any }) => {
  console.log("location is ", locationInfo);

  let mainLocationText = locationInfo.structuredFormat.mainText.text;
  let subLocationText = locationInfo.structuredFormat.secondaryText.text;
  let distance = locationInfo.distanceMeters;
  let formattedDistance = distance / 1000;

  //TODO : Reroute Map on Click
  return (
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

      <View style={{ paddingHorizontal: 10, borderRadius: 15, flexShrink: 1 }}>
        <Text style={styles.locationText}>{mainLocationText}</Text>
        <Text style={styles.locationSubtext}>{subLocationText}</Text>
      </View>
    </View>
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
