import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import ErrorPopUp from "@/assets/components/Error";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Toast } from "toastify-react-native";

export default function Tab() {
  const { authSignOut, userData } = useAuth();
  const router = useRouter();

  async function signOut() {
    let response = await authSignOut();

    if (response.status === 200) {
      Toast.success("Sign Out Successful!", "bottom");
      router.replace("/authLanding");
    } else {
      Toast.error(response.error, "bottom");
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          padding: 20,
          flexDirection: "column",
        }}
      >
        <Text style={styles.headerText}>Profile</Text>

        {/* Profile Image and Username*/}
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <View style={styles.profilePictureContainer}></View>
          <Text style={styles.headerText}>{userData.name}</Text>
          <Text style={styles.headerSubText}>{userData.email}</Text>
        </View>

        <Text style={[styles.headerText, { marginTop: 10 }]}>Preferences</Text>

        {/* Selections */}
        <View style={styles.settingsBox}>
          <View style={styles.settingSelection}>
            <Icon name="bell" color="#000000" size={30} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>

          <View style={styles.settingSelection}>
            <Icon name="clock" color="#000000" size={30} />
            <Text style={styles.settingText}>Alarm</Text>
          </View>

          <View style={styles.settingSelection}>
            <Icon name="palette" color="#000000" size={30} />
            <Text style={styles.settingText}>Theme</Text>
          </View>

          <View style={styles.settingSelection}>
            <Icon name="language" color="#000000" size={30} />
            <Text style={styles.settingText}>Language</Text>
          </View>

          <TouchableOpacity
            style={styles.settingSelection}
            onPress={() => signOut()}
          >
            <Icon name="right-from-bracket" color="#000000" size={30} />
            <Text style={styles.settingText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  settingText: {
    fontSize: 16,
    color: "#999999",
    fontFamily: "regular",
  },
  profilePictureContainer: {
    borderRadius: 180,
    width: 80,
    height: 80,
    backgroundColor: "#999000",
  },
  settingsBox: {
    borderRadius: 15,
    width: "100%",
    boxShadow: "0px 5px 10px #C4C1C1FF",
    marginTop: 10,
    padding: 20,
    gap: 30,
  },
  settingSelection: {
    flexDirection: "row",
    width: "100%",
    gap: 20,
    alignItems: "center",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 3px 5px #C4C1C1FF",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "bold",
    lineHeight: 24,
  },
});
