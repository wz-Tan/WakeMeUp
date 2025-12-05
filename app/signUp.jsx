import { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function verifySignUp() {
    //Todo : Refine Sign Up Conditions
    if (password === confirmPassword && password != "") {
      const response = await fetch("http://192.168.0.152:4000/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          email,
          password,
        }),
      });

      //To Do: Loading Screen
    } else {
      console.log("Invalid Sign Up Details");
    }
  }

  return (
    <SafeAreaView
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
      <Text style={styles.headerSubText}>Create An Account</Text>
      <View style={{ width: "100%", gap: 20 }}>
        <TextInput
          style={styles.textInput}
          onChangeText={setUsername}
          value={userName}
          placeholder="Enter Username Here"
        />

        <TextInput
          style={styles.textInput}
          onChangeText={setEmail}
          value={email}
          placeholder="Enter Your Email Here"
        />

        <TextInput
          style={styles.textInput}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Enter Your Password Here"
        />

        <TextInput
          style={styles.textInput}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry={true}
          placeholder="Confirm Password"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => verifySignUp()}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
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
    paddingVertical: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 3px 5px #C4C1C1FF",
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
    width: "95%",
    alignSelf: "center",
    fontSize: 14,
    fontFamily: "regular",
    lineHeight: 20,
    boxShadow: "0px 5px 5px #C4C1C1FF",
    paddingHorizontal: 15,
    borderRadius: 5,
    color: "#000000",
    backgroundColor: "#FAFAFA",
    height: 50,
  },
});
