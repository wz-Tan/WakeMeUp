import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignUp from "./signUp";

export default function AuthLanding() {
  // Default is Log In, Navigate to Sign Up
  const [shownPage, setShownPage] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigator = useNavigation();

  async function signIn() {}

  if (shownPage === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 20,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FAFAFA",
          }}
        >
          <Text style={styles.headerText}>WakeMeUp</Text>
          <Text style={styles.headerSubText}>Log In</Text>
          <View style={{ width: "95%", gap: 20 }}>
            <TextInput
              style={styles.textInput}
              onChangeText={setEmail}
              value={email}
              placeholder="Enter Email Here"
            />

            <TextInput
              style={styles.textInput}
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
              placeholder="Enter Your Password Here"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={() => signIn()}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[{ width: "95%", marginTop: 10 }]}
            onPress={() => {
              // change to sign up screen
            }}
          >
            <Text
              style={[
                styles.buttonText,
                { color: "#001F3F", textAlign: "center" },
              ]}
            >
              Create An Account
            </Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 24,
    color: "#000000",
    fontFamily: "bold",
    lineHeight: 28,
    margin: 15,
  },

  headerSubText: {
    fontSize: 18,
    color: "#050505",
    fontFamily: "regular",
    lineHeight: 24,
    alignSelf: "flex-start",
    margin: 10,
  },
  button: {
    width: "95%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 3px 5px #C4C1FF",
    marginTop: 15,
    backgroundColor: "#001F3F",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "regular",
    lineHeight: 20,
  },

  textInput: {
    width: "100%",
    fontSize: 14,
    fontFamily: "regular",
    lineHeight: 20,
    boxShadow: "1px 5px 5px #D3D3D3",
    paddingHorizontal: 20,
    borderRadius: 5,
    color: "#000000",
    backgroundColor: "#FAFAFA",
    height: 50,
  },
});
