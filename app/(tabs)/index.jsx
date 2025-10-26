import DestinationBox from "@/assets/components/DestinationBox";
import CloudyIcon from "@/assets/icon/cloudy.png";
import { Image, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Tab() {
  return (
        <ScrollView
        
          style={{
            flex: 1,
            padding: 20,
            flexDirection: "column",
            backgroundColor:"#F3EFFF"
          }}
        >
          {/* Header, Left is Title and Time, Right is Weather Icon */}
          <View style={styleSheet.headerView}>
            <View style={styleSheet.flexCol}>
              <Text style={styleSheet.headerText}>WakeMeUp</Text>
              <Text style={styleSheet.headerSubText}>Monday, 10:30 a.m.</Text>
            </View>

            <Image source={CloudyIcon} style={{width:40, height: 40}} />
          </View>

          {/* List Here */}
          <View style={styleSheet.List}>
            <Text style={styleSheet.listTitle}>Recents</Text>
            <DestinationBox/>
            <DestinationBox/>
            <DestinationBox/>
          </View>

          <View style={styleSheet.List}>
            <Text style={styleSheet.listTitle}>Favourites</Text>
            <DestinationBox/>
          </View>

        </ScrollView>
  );
}

const styleSheet = StyleSheet.create({
  headerView: {
    alignSelf: "flex-start",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
    
  },

  headerText: {
    fontSize: 20,
    color: "#000000",
    fontFamily: "bold",
    lineHeight: 28
  }, 

  headerSubText:{
    fontSize: 18,
    color: "#999999",
    fontFamily: "regular"
  },

  flexCol:{
    flexDirection: "column"
  },

  List:{
    paddingTop: 10,
    flexDirection: "column",
    gap: 10
  },

  listTitle:{
    fontSize: 18,
    color: "#000000",
    fontFamily: "bold",
    marginBottom: -10
  },

})