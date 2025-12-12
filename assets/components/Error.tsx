import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

function ErrorPopUp(errorMessage: string) {
  return (
    <View
      style={[
        styles.errorBackground,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      {/*<Icon name="face-sad-tear" color="#000000" size={60} />*/}
      <Text style={styles.loadingMessage}>Error!</Text>
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

  loadingMessage: {
    fontSize: 16,
    fontFamily: "regular",
    color: "#000000",
    margin: 10,
  },
});

export default ErrorPopUp;
