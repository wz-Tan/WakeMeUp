import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Toast } from "toastify-react-native";

export default function AuthLanding() {
  const { loadAuthToken, authSignIn } = useAuth();

  // Default is Log In, Navigate to Sign Up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Try Loading Token
  useEffect(() => {
    const loadToken = async () => {
      let response = await loadAuthToken();
      if (response === true) {
        router.replace("(tabs)");
      }
    };
    loadToken();
  }, []);

  async function signIn() {
    setLoading(true);
    try {
      if (email.replace(" ", "") == "" || password.replace(" ", "") == "") {
        Toast.error("Fields cannot be empty!", "bottom");
        setLoading(false);
        return;
      }

      let response = await authSignIn(email, password);

      if (response.status === 200) {
        Toast.success("Sign In Successful!", "bottom");
        // Switch to Tabs Interface
        router.replace("(tabs)");
      }
      if (response.error) {
        console.log("Error signing in ", response.error);
        Toast.error(response.error, "bottom");
      }
    } catch (error) {
      Toast.error(error.message, "bottom");
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
      {loading && <LoadingPopUp loadingMessage="Signing You In..." />}

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
