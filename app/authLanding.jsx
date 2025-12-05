import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import SignUp from "./signUp";

export default function AuthLanding() {
  // 0 for Selection Page, 1 for Signing Up, 2 for Logging In
  const [shownPage, setShownPage] = useState(1);
  const navigator = useNavigation();

  if (shownPage === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          padding: 20,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.headerText}>WakeMeUp</Text>
        <Text style={styles.headerSubText}>Your Friendly Pocket Alarm</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#000000" }]}
          onPress={() => setShownPage(1)}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FAFAFA" }]}
          onPress={() => setShownPage(2)}
        >
          <Text style={[styles.buttonText, { color: "#000000" }]}>Log In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Sign Up
  else if (shownPage === 1) {
    return <SignUp />;
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    color: "#000000",
    fontFamily: "bold",
    lineHeight: 28,
  },

  headerSubText: {
    fontSize: 18,
    color: "#999999",
    fontFamily: "regular",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 3px 5px #C4C1C1FF",
    marginTop: 15,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "bold",
    lineHeight: 18,
  },
});
