import { useGoogleMap } from "@/contexts/GoogleMapContext";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

function PermissionRequest({ clearPopUp }: { clearPopUp: Function }) {
  const { requestLocationPermission } = useGoogleMap();
  return (
    <View
      style={[
        styles.errorBackground,
        { justifyContent: "center", alignItems: "center", gap: 10 },
      ]}
    >
      <Icon name="face-frown" color="#000000" size={100} />
      <Text style={[styles.errorHeader]}>
        To continue using the app, please provide location access all the time for background usage.
      </Text>
      <TouchableOpacity
        onPress={async () => {
          let permissionGranted = await requestLocationPermission();
          console.log(
            "Permission granted in the component is ",
            permissionGranted,
          );
          if (permissionGranted) {
            clearPopUp();
          }
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Got It</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  errorBackground: {
    backgroundColor: "#FAFAFA",
    zIndex: 150,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    flexDirection: "column",
  },

  errorHeader: {
    fontSize: 16,
    fontFamily: "regular",
    color: "#000000",
    lineHeight: 20,
    margin: 20,
    textAlign: "center",
  },

  errorMessage: {
    fontSize: 16,
    fontFamily: "regular",
    color: "#000000",
    lineHeight: 20,
    paddingHorizontal: 20,
    textAlign: "center",
  },

  button: {
    width: "70%",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 3px 5px #C4C1CC",
    marginTop: 15,
    backgroundColor: "#FF0000",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "regular",
    lineHeight: 20,
  },
});

export default PermissionRequest;
