import { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import LoadingPopUp from "../assets/components/Loading";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function signIn() {
    setLoading(true);
    //Todo : Refine Sign Up Conditions
    if (password === confirmPassword && password != "") {
      try {
        let response = await fetch("http://192.168.0.152:4000/user/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName,
            email,
            password,
          }),
        });

        response = await response.json();
        console.log("Create Account Response", response);

        if (response.status === 200) {
          router.back();
        } else if (response.error) {
          setError(response.error);
        }
      } catch (err) {
        setError(err);
      }
    } else {
      console.log("Invalid Sign Up Details");
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        {loading && LoadingPopUp("Creating Account...")}

        {error && ErrorPopUp(error)}

        <Text style={styles.headerText}>WakeMeUp</Text>
        <Text style={styles.headerSubText}>Create An Account</Text>
        <View style={{ width: "95%", gap: 20 }}>
          <TextInput
            style={styles.textInput}
            onChangeText={setUsername}
            value={userName}
            placeholder="Enter Username"
          />

          <TextInput
            style={styles.textInput}
            onChangeText={setEmail}
            value={email}
            placeholder="Enter Your Email"
          />

          <TextInput
            style={styles.textInput}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            placeholder="Enter Your Password"
          />

          <TextInput
            style={styles.textInput}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => signIn()}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[{ width: "95%", marginTop: 10 }]}
          onPress={() => router.back()}
        >
          <Text
            style={[
              styles.buttonText,
              { color: "#001F3F", textAlign: "center" },
            ]}
          >
            I Have An Account
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
    boxShadow: "0px 5px 5px #C4C1C1FF",
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
