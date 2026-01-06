import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";

export function TextInputContainer({
  previousName,
  cancelEdit,
  confirmEdit,
}: {
  previousName: string;
  cancelEdit: Function;
  confirmEdit: Function;
}) {
  const [locationName, setLocationName] = useState(previousName);

  return (
    <View style={styles.grayOverlay}>
      <View></View>
      <View style={styles.mainContainer}>
        <Text style={[styles.boldText, { fontSize: 16 }]}>
          Edit Location Name
        </Text>
        <View style={styles.inputField}>
          <TextInput
            style={styles.regularText}
            value={locationName}
            onChangeText={(text) => setLocationName(text)}
          />
        </View>
        <View style={styles.buttonSplitContainer}>
          {/* Delete Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF358C" }]}
            onPress={() => cancelEdit()}
          >
            <Text style={[styles.boldText, { color: "#FFFFFF" }]}>Cancel</Text>
          </TouchableOpacity>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#359DFF" }]}
          >
            <Text style={[styles.boldText, { color: "#FFFFFF" }]}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grayOverlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(100,100,100,0.3)",
    padding: 10,
    position: "absolute",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    padding: 15,
    width: "100%",
    backgroundColor: "#FAFAFA",
    flexDirection: "column",
    borderRadius: 15,
    gap: 10,
  },
  boldText: {
    fontSize: 14,
    fontFamily: "bold",
    lineHeight: 16,
  },
  regularText: {
    fontSize: 14,
    fontFamily: "regular",
  },
  inputField: {
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 5,
    borderWidth: 0.3,
  },
  buttonSplitContainer: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    gap: 5,
  },
  button: {
    flex: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
