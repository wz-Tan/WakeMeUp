import DestinationBox from "@/assets/components/DestinationBox";
import ErrorPopUp from "@/assets/components/Error";
import LoadingPopUp from "@/assets/components/Loading";
import CloudyIcon from "@/assets/icon/cloudy.png";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Tab() {
  const { userId } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  async function fetchSavedLocation() {
    console.log("Fetching saved location");
    console.log("User id is", userId);
    try {
      let response = await fetch("http://192.168.0.152:4000/location/get", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          userId,
        }),
      });

      response = await response.json();
      console.log("response is", response);

      if (response.status == 200) {
        // TODO: Store Array as Destination Boxes
      } else if (response.error) {
        console.log("Response error is", response.error);
        setError(response.error);
      }
    } catch (error) {
      console.log("Error fetching saved location", error);
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
      {error && (
        <ErrorPopUp errorMessage={error} clearError={() => setError("")} />
      )}

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
        <Text style={styleSheet.listTitle}>Recents</Text>
        <DestinationBox />
        <DestinationBox />
        <DestinationBox />
      </View>

      <View style={styleSheet.List}>
        <Text style={styleSheet.listTitle}>Favourites</Text>
        <DestinationBox />
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
