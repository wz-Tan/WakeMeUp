import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { useState, useRef } from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useGoogleMap } from "@/contexts/GoogleMapContext";
import { Toast } from "toastify-react-native";
import AutocompleteResultBox from "@/assets/components/AutocompleteResultBox";

export default function Tab() {
  const inputLocationName = useRef();
  const { getPlaceAutocomplete, setCurrentRegion } = useGoogleMap();
  const [locationData, setLocationData] = useState();

  //Handle Toast Notifs For the Autocomplete Call
  async function handleAutocompleteResults() {
    let response = await getPlaceAutocomplete(inputLocationName.current);

    if (response.error) {
      Toast.error(
        "Error occured when getting autocomplete results :(",
        "bottom",
      );
    } else {
      //Successfully Acquiring The Data
      setLocationData(response.data);
    }
  }

  //Debouncing -> Reset For Every Value Change
  function useDebounce() {
    //Create a Timeout Object
    const timeoutObject = useRef();
    const delay = 700;

    //Return The Function with One Timeout Only -> We Can Reuse It
    return function () {
      if (timeoutObject.current) {
        clearTimeout(timeoutObject.current); //Reset timeout object
      }
      timeoutObject.current = setTimeout(() => {
        //Fill Value into timeout object
        handleAutocompleteResults();
      }, delay);
    };
  }

  //Create Function Instance
  const DebounceCall = useDebounce();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#FAFAFA",
      }}
    >
      <Text style={styles.title}>Select a Destination</Text>
      {/* Input Field*/}
      <View style={styles.searchBar}>
        <TouchableOpacity
          onPress={async () => {
            await handleAutocompleteResults();
          }}
        >
          {/* <Icon name="arrow-left" color="#000000" size={20} />*/}
          <Icon name="magnifying-glass" color="#000000" size={20} />
        </TouchableOpacity>

        <TextInput
          style={styles.searchBarText}
          placeholder="Enter Place Name Here..."
          onChangeText={(text) => {
            inputLocationName.current = text;
            DebounceCall(); //Start the Debounce Call on Text Change
          }}
        />
      </View>

      {/* Results Field*/}
      <View style={styles.resultsView}>
        <FlatList
          data={locationData}
          style={{ width: "100%" }}
          renderItem={({ item }) => {
            return <AutocompleteResultBox locationInfo={item} />;
          }}
          keyExtractor={(item) => item.placeId}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
    fontFamily: "bold",
    fontSize: 18,
    alignSelf: "center",
  },

  resultsView: {
    marginTop: "5%",
    width: "90%",
    alignSelf: "center",
    flex: 1,
  },

  subtitle: {
    fontFamily: "regular",
    paddingLeft: 10,
    fontSize: 18,
  },

  searchBar: {
    borderRadius: 30,
    width: "90%",
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    alignSelf: "center",
    padding: 5,
    gap: 10,
    paddingLeft: 15,
    alignItems: "center",
    borderColor: "#000000",
    borderWidth: 1,
    marginTop: 5,
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
