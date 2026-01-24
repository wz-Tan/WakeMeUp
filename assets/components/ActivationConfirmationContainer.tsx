import { useGoogleMap } from "@/contexts/GoogleMapContext";
import { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export function ActivationConfirmationContainer({
  locationData,
  closeConfirmationContainer,
}: {
  locationData: any;
  closeConfirmationContainer: Function;
}) {
  const { setActiveDestination, setActiveDestinationName } = useGoogleMap();
  const { latitude, longitude, location_name } = locationData;

  return (
    <View style={styles.grayOverlay}>
      <View></View>
      <View style={styles.mainContainer}>
        <Text style={[styles.boldText, { fontSize: 16, textAlign: "center" }]}>
          Set Active Destination?
        </Text>

        <View style={styles.buttonSplitContainer}>
          {/* Confirm Button */}
          {/* On Confirmation Set the Active Location */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#359DFF" }]}
            onPress={() => {
              setActiveDestination((prev: any) => ({
                ...prev,
                latitude: Number(latitude),
                longitude: Number(longitude),
              }));
              setActiveDestinationName(location_name);
              closeConfirmationContainer();
            }}
          >
            <Text style={[styles.boldText, { color: "#FFFFFF" }]}>Confirm</Text>
          </TouchableOpacity>
          {/* Cancel Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF358C" }]}
            onPress={() => {
              closeConfirmationContainer();
            }}
          >
            <Text style={[styles.boldText, { color: "#FFFFFF" }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grayOverlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(100,100,100,0.3)",
    padding: 10,
    position: "absolute",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    padding: 15,
    width: "100%",
    backgroundColor: "#FAFAFA",
    flexDirection: "column",
    borderRadius: 15,
    gap: 10,
  },
  boldText: {
    fontSize: 14,
    fontFamily: "bold",
    lineHeight: 16,
  },
  regularText: {
    fontSize: 14,
    fontFamily: "regular",
  },
  inputField: {
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 5,
    borderWidth: 0.3,
  },
  buttonSplitContainer: {
    width: "100%",
    flexDirection: "column",
    gap: 5,
  },
  button: {
    height: 45,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
