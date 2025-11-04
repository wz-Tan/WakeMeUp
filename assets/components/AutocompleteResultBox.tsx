import { View, Text, StyleSheet } from "react-native";
const AutocompleteResultBox = ({ locationInfo }: { locationInfo: any }) => {
  console.log("location is ", locationInfo);

  let locationName = locationInfo.text.text;
  let distance = locationInfo.distanceMetersl;

  //TODO : Format Output
  return (
    <View style={styles.container}>
      <Text style={styles.locationText}>{locationName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    width: "100%",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  locationText: {
    fontSize: 16,
    fontFamily: "bold",
  },

  locationSubtext: {
    fontSize: 14,
    fontFamily: "regular",
    color: "#999999",
  },
});

export default AutocompleteResultBox;
