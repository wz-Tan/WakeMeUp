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
import ErrorPopUp from "../assets/components/Error";
import { useAuth } from "../contexts/AuthContext";
import { Toast } from "toastify-react-native";
import ToastManager from "toastify-react-native/components/ToastManager";

export default function SignUp() {
  const { authSignUp, authSignIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Warning States
  const [shownWarning, setShownWarning] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    emptyFields: false,
  });

  // Warning Content
  const [usernameWarning, setUsernameWarning] = useState([]);
  const [emailWarning, setEmailWarning] = useState([]);
  const [passwordWarning, setPasswordWarning] = useState([]);

  // Validators (Also Set Value)
  function validateUsername(username) {
    // Reset Empty Field Warning
    setShownWarning((prev) => ({
      ...prev,
      emptyFields: false,
    }));

    let warning = [];

    // Can Consist of A-Z or Numbers or Underscore
    const re = /^[a-zA-Z0-9_]+$/;
    if (username.length < 3) {
      warning.push("Username should be at least 3 characters.");
    }
    if (!re.test(username)) {
      warning.push("No special characters allowed aside from underscore.");
    }

    setUsername(username);
    setUsernameWarning(warning);
  }

  function validateEmail(email) {
    // Reset Empty Field Warning
    setShownWarning((prev) => ({
      ...prev,
      emptyFields: false,
    }));

    let warning = [];

    // Anything That's Not Space or @, + means undefined number
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      warning.push("Invalid Email");
    }

    setEmail(email);
    setEmailWarning(warning);
  }

  function validatePassword(password) {
    // Reset Empty Field Warning
    setShownWarning((prev) => ({
      ...prev,
      emptyFields: false,
    }));

    let warning = [];

    // Look for at least 1 uppercase
    const uppercaseRe = /^(?=.*[A-Z]).*$/;
    if (!uppercaseRe.test(password)) {
      warning.push("Password should have at least 1 uppercase character.");
    }

    const lowercaseRe = /^(?=.*[a-z]).*$/;
    if (!lowercaseRe.test(password)) {
      warning.push("Password should have at least 1 lowercase character.");
    }

    const numberRe = /^(?=.*[0-9]).*$/;
    if (!numberRe.test(password)) {
      warning.push("Password should have at least 1 number.");
    }

    if (password.length < 6) {
      warning.push("Password should be at least 6 characters long.");
    }

    setPassword(password);
    setPasswordWarning(warning);
  }

  async function signUp() {
    let conditionFailed = false;

    // Edge Cases
    if (
      !username.length ||
      !email.length ||
      !password.length ||
      !confirmPassword.length
    ) {
      setShownWarning((prev) => ({
        ...prev,
        emptyFields: true,
      }));
      conditionFailed = true;
    }

    // Warning for Each Field
    if (usernameWarning.length) {
      setShownWarning((prev) => ({
        ...prev,
        username: true,
      }));
      conditionFailed = true;
    }

    if (emailWarning.length) {
      setShownWarning((prev) => ({
        ...prev,
        email: true,
      }));
      conditionFailed = true;
    }

    if (passwordWarning.length) {
      setShownWarning((prev) => ({
        ...prev,
        password: true,
      }));
      conditionFailed = true;
    }

    if (confirmPassword !== password) {
      setShownWarning((prev) => ({
        ...prev,
        confirmPassword: true,
      }));
      conditionFailed = true;
    }

    // Run if No Warning
    if (!conditionFailed) {
      setLoading(true);

      // Run Sign Up Function
      let response = await authSignUp(username, email, password);
      if (response.status === 200) {
        try {
          await authSignIn(email, password);
        } catch (err) {
          console.log(
            "Error trying to sign in automatically after signing up",
            err,
          );
        }
        Toast.success("Sign Up Successful!", "bottom");
        router.replace("authLanding");
      } else {
        Toast.error(response.error, "bottom");
      }
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ToastManager />
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
        {loading && <LoadingPopUp loadingMessage="Creating Account..." />}

        <Text style={styles.headerText}>WakeMeUp</Text>
        <Text style={styles.headerSubText}>Create An Account</Text>
        <View style={{ width: "95%", gap: 20 }}>
          <TextInput
            style={styles.textInput}
            onChangeText={(input) => {
              validateUsername(input);
            }}
            value={username}
            placeholder="Enter Username"
            onFocus={() =>
              setShownWarning((prev) => ({
                ...prev,
                username: true,
              }))
            }
            onBlur={() =>
              setShownWarning((prev) => ({
                ...prev,
                username: false,
              }))
            }
          />

          {shownWarning.username && usernameWarning.length > 0 && (
            <View style={styles.warningTextContainer}>
              {usernameWarning.map((warningMessage, key) => (
                <Text key={key} style={styles.warningText}>
                  {warningMessage}
                </Text>
              ))}
            </View>
          )}

          <TextInput
            style={styles.textInput}
            onChangeText={(input) => {
              validateEmail(input);
            }}
            value={email}
            placeholder="Enter Your Email"
            onFocus={() =>
              setShownWarning((prev) => ({
                ...prev,
                email: true,
              }))
            }
            onBlur={() =>
              setShownWarning((prev) => ({
                ...prev,
                email: false,
              }))
            }
          />

          {shownWarning.email && emailWarning.length > 0 && (
            <View style={styles.warningTextContainer}>
              {emailWarning.map((warningMessage, key) => (
                <Text key={key} style={styles.warningText}>
                  {warningMessage}
                </Text>
              ))}
            </View>
          )}

          <TextInput
            style={styles.textInput}
            onChangeText={(input) => {
              validatePassword(input);
            }}
            value={password}
            secureTextEntry={true}
            placeholder="Enter Your Password"
            onFocus={() =>
              setShownWarning((prev) => ({
                ...prev,
                password: true,
              }))
            }
            onBlur={() =>
              setShownWarning((prev) => ({
                ...prev,
                password: false,
              }))
            }
          />

          {shownWarning.password && passwordWarning.length > 0 && (
            <View style={styles.warningTextContainer}>
              {passwordWarning.map((warningMessage, key) => (
                <Text key={key} style={styles.warningText}>
                  {warningMessage}
                </Text>
              ))}
            </View>
          )}

          <TextInput
            style={styles.textInput}
            onChangeText={(input) => {
              setConfirmPassword(input);

              input !== password
                ? setShownWarning((prev) => ({
                    ...prev,
                    confirmPassword: true,
                  }))
                : setShownWarning((prev) => ({
                    ...prev,
                    confirmPassword: false,
                  }));
            }}
            value={confirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
          />

          {shownWarning.confirmPassword && (
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningText}>Passwords do not match.</Text>
            </View>
          )}

          {shownWarning.emptyFields && (
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningText}>
                Ensure There Are No Empty Fields!
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={() => signUp()}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[{ width: "95%", marginTop: 10 }]}
          onPress={() => router.replace("authLanding")}
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

  warningText: {
    fontSize: 12,
    fontFamily: "medium",
    color: "#FFA500",
  },

  warningTextContainer: {
    width: "100%",
    flexDirection: "column",
  },
});
