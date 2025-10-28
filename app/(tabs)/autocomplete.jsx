import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useGoogleMap } from "@/contexts/GoogleMapContext";
import { Toast } from "toastify-react-native";
import { FlatList } from "react-native";

export default function Tab() {
  const [inputText, setInputText] = useState("");
  const { getPlaceAutocomplete, currentRegion, setCurrentRegion } = useGoogleMap();
  
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];

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
            let response = await getPlaceAutocomplete(inputText, currentRegion);

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
          {/* <Icon name="arrow-left" color="#000000" size={20} />*/}
          <Icon name="magnifying-glass" color="#000000" size={20} />
        </TouchableOpacity>

        <TextInput
          style={styles.searchBarText}
          placeholder="Enter Place Name Here..."
          onChangeText={setInputText}
          value={inputText}
        />
      </View>
      
      {/* Results Field*/}
      <View style={styles.resultsView}>
        <Text style={styles.subtitle}>Results</Text>
        
        <FlatList 
        data={DATA} 
        style={{width:"100%"}}
        renderItem={({item}) => <Text>{item.title} </Text>}
        keyExtractor={item => item.id}
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
  
  resultsView:{
    marginTop: "10%",
    width: "90%",
    alignSelf:"center",
    flex:1,
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
    marginTop: 5
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
