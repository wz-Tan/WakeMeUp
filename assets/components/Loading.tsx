import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Wander } from "react-native-animated-spinkit";

function LoadingPopUp(loadingMessage: string) {
  return (
    <View
      style={[
        styles.loadingBackground,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <Wander size={80} color="#6A5ACD" />
      <Text style={styles.loadingMessage}>{loadingMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingBackground: {
    backgroundColor: "#FAFAFA",
    zIndex: 200,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    flexDirection: "column",
  },

  loadingMessage: {
    fontSize: 16,
    fontFamily: "regular",
    color: "#000000",
    margin: 10,
  },
});

export default LoadingPopUp;
