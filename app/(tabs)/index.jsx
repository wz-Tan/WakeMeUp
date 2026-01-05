import DestinationBox from "@/assets/components/DestinationBox";
import ErrorPopUp from "@/assets/components/Error";
import LoadingPopUp from "@/assets/components/Loading";
import CloudyIcon from "@/assets/icon/cloudy.png";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Toast } from "toastify-react-native";

export default function Tab() {
  const { token } = useAuth();
  const [loading, setLoading] = useState("");
  const [savedLocation, setSavedLocation] = useState([]);

  async function fetchSavedLocation() {
    try {
      let response = await fetch("http://192.168.0.152:4000/location/get", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      response = await response.json();

      if (response.status == 200) {
        setSavedLocation(response.location); // Store Passed In Locations
      } else if (response.error) {
        Toast.error(response.error, "bottom");
      }
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message == "Network request failed"
      ) {
        Toast.error("Failed Connection to Server", "bottom");
      }
    }
  }

  useEffect(() => {
    const init = async () => {
      setLoading("Fetching Saved Location...");
      await fetchSavedLocation();
      setLoading("");
    };
    init();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
        flexDirection: "column",
      }}
    >
      {loading && <LoadingPopUp loadingMessage={loading} />}

      {/* Header, Left is Title and Time, Right is Weather Icon */}
      <View style={styleSheet.headerView}>
        <View style={styleSheet.flexCol}>
          <Text style={styleSheet.headerText}>WakeMeUp</Text>
          <Text style={styleSheet.headerSubText}>Monday, 10:30 a.m.</Text>
        </View>

        <Image source={CloudyIcon} style={{ width: 40, height: 40 }} />
      </View>

      {/* List Here */}
      <View style={styleSheet.List}>
        <Text style={styleSheet.listTitle}>Favourites</Text>
        {savedLocation.map((v, k) => (
          <DestinationBox
            key={k}
            locationData={v}
            refreshPage={fetchSavedLocation}
          />
        ))}
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

  flexCol: {
    flexDirection: "column",
  },

  List: {
    paddingTop: 10,
    flexDirection: "column",
    gap: 10,
  },

  listTitle: {
    fontSize: 18,
    color: "#000000",
    fontFamily: "bold",
    marginBottom: -10,
  },
});
