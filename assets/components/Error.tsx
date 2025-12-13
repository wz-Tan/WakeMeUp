import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

function ErrorPopUp(errorMessage: string, clearError: Function) {
  return (
    <View
      style={[
        styles.errorBackground,
        { justifyContent: "center", alignItems: "center", gap: 10 },
      ]}
    >
      <Icon name="face-frown" color="#000000" size={100} />
      <Text style={[styles.errorHeader]}>Oops! Something Went Wrong.</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TouchableOpacity onPress={() => clearError()} style={styles.button}>
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
    fontSize: 20,
    fontFamily: "regular",
    color: "#000000",
    lineHeight: 28,
    marginTop: 20,
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

export default ErrorPopUp;
