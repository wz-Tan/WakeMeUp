import NavBar from "@/assets/components/NavBar";
import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tab() {
  return (
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
        <Text style={styles.headerText}>John Doe</Text>
        <Text style={styles.headerSubText}>abc123@gmail.com</Text>
      </View>

      {/* Selections */}
      <View style={styles.settingsBox}>
        <View style={styles.settingSelection}>
          <Text>Logo</Text>
          <Text>Description</Text>
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
  profilePictureContainer: {
    borderRadius: 180,
    width: 80,
    height: 80,
    backgroundColor: "#999000",
  },
  settingsBox: {
    borderRadius: 15,
    width: "100%",
    height: "30%",
  },
  settingSelection: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
});
