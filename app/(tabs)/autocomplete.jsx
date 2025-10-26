import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import Icon from "react-native-vector-icons/FontAwesome6";
import { useGoogleMap } from "@/contexts/GoogleMapContext";
import { Toast } from 'toastify-react-native';


export default function Tab() {
    const [inputText, setInputText] = useState("");
    const { getPlaceAutocomplete, currentRegion, setCurrentRegion } = useGoogleMap();
    
    return (
        <View
            style={{
                flex: 1,
                flexDirection: "column"
            }}
        >
          {/* Search Bar Area*/}
          <View style={styles.searchBarArea}>
            {/* Input Field*/}
            <View style={styles.searchBar}>
              <TouchableOpacity
                onPress={async () => {
                  let response = await getPlaceAutocomplete(
                    inputText,
                    currentRegion,
                  );
    
                  if (response.error) {
                    Toast.error(
                      "Error occured when getting autocomplete results :(",
                      "bottom",
                    );
                  } else {
                    console.log("retured autocomplete results are ", response.data);
                    //Display As List
                    console.log("The first returned item is ", response.data[0]);
                  }
                }}
              >  
                <Icon name="magnifying-glass" color="#000000" size={20} />
              </TouchableOpacity>
    
              <TextInput
                style={styles.searchBarText}
                placeholder="Enter Place Name Here..."
                onChangeText={setInputText}
                value={inputText}
              />
            </View>
    
            {/* Results*/}
            <View style={styles.resultItem}>
              <Icon name="angles-right" size={15} />
            </View>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
  searchBar: {
    borderRadius: 30,
    width: "100%",
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    padding: 5,
    gap: 10,
    paddingLeft: 15,
    alignItems: "center",
  },
  
  searchBarArea: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    width: "90%",
    flexDirection: "column",
    gap: 5,
  },
  
  searchBarText: {
    paddingHorizontal: 10,
    fontFamily: "regular",
    fontSize: 12,
    color: "#000000",
    width: "90%",
  },

  resultItem: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 30,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});