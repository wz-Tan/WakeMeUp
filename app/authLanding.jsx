import { useRouter } from "expo-router";
import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingPopUp from "../assets/components/Loading";
import ErrorPopUp from "../assets/components/Error";
import SecureStore from "expo-secure-store";

export default function AuthLanding() {
  // Default is Log In, Navigate to Sign Up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const TOKEN_NAME = "Auth_JWT";

  async function signIn() {
    setLoading(true);

    try {
      let response = await fetch("http://10.83.169.230:4000/user/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      response = await response.json();

      if (response.status === 200) {
        setLoading(false);

        // Store JWT Token
        await SecureStore.setItemAsync(TOKEN_NAME, response.token);

        // Switch to Tabs Interface
        router.replace("(tabs)");
      } else if (response.error) {
        setError(response.error);
      }

      console.log("Sign in response from the backend is ", response);
    } catch (err) {
      // Server Side Error
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {/* Loading Message*/}
      {loading && LoadingPopUp("Signing You In...")}

      {/* Error Message*/}
      {error && ErrorPopUp(error, () => setError(""))}

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
        <Text style={styles.headerSubText}>Log Into an Existing Account</Text>
        <View style={{ width: "95%", gap: 20 }}>
          <TextInput
            style={styles.textInput}
            onChangeText={setEmail}
            value={email}
            placeholder="Enter Email"
          />

          <TextInput
            style={styles.textInput}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            placeholder="Enter Your Password"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => signIn()}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[{ width: "95%", marginTop: 10 }]}
          onPress={() => router.push("/signUp")}
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
    boxShadow: "0px 3px 5px #C4C1CC",
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
