import DestinationBox from "@/assets/components/DestinationBox";
import LoadingPopUp from "@/assets/components/Loading";
import CloudyIcon from "@/assets/icon/cloudy.png";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Toast } from "toastify-react-native";
import { TextInputContainer } from "@/assets/components/TextInputContainer";

export default function Tab() {
  const { token } = useAuth();
  const [loading, setLoading] = useState("");
  const [savedLocation, setSavedLocation] = useState([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const editedLocationData = useRef({
    previousName: "",
    latitude: "",
    longitude: "",
  });

  async function fetchSavedLocation() {
    try {
      let response = await fetch("http://192.168.0.152:4000/location/get", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token.current}`,
        },
      });

      response = await response.json();

      if (response.status == 200) {
        setSavedLocation(response.location); // Store Passed In Locations
      } else if (response.error) {
        Toast.error(response.error.message, "bottom");
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

  // Edit Location Name
  async function editSavedLocationName(latitude, longitude, location_name) {
    setLoading("Editing location name...");
    try {
      let response = await fetch("http://192.168.0.152:4000/location/edit", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token.current}`,
        },
        body: JSON.stringify({
          latitude,
          longitude,
          location_name,
        }),
      });

      let data = await response.json();
      if (data.status == 200) {
        setShowTextInput(false);
        fetchSavedLocation();
      } else if (data.error) {
        Toast.error("Error editing location name " + data.error, "bottom");
      }
    } catch (error) {
      Toast.error("Error editing location" + error.message, "bottom");
    }
    setLoading(false);
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
    <View
      style={{
        flex: 1,
      }}
    >
      {loading && <LoadingPopUp loadingMessage={loading} />}
      {showTextInput && (
        <TextInputContainer
          previousName={editedLocationData.current.previousName}
          latitude={editedLocationData.current.latitude}
          longitude={editedLocationData.current.longitude}
          cancelEdit={() => {
            setShowTextInput(false);
          }}
          confirmEdit={(latitude, longitude, newName) => {
            editSavedLocationName(latitude, longitude, newName);
          }}
        />
      )}

      <View style={{ padding: 20, flexDirection: "column" }}>
        {/* Header, Left is Title and Time, Right is Weather Icon */}
        <View style={styleSheet.headerView}>
          <View style={styleSheet.flexCol}>
            <Text style={styleSheet.headerText}>WakeMeUp</Text>
            <Text style={styleSheet.headerSubText}>Monday, 10:30 a.m.</Text>
          </View>

          <TouchableOpacity onPress={fetchSavedLocation}>
            <Image source={CloudyIcon} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
        </View>

        {/* List Here */}
        <View style={styleSheet.List}>
          <Text style={styleSheet.listTitle}>Favourites</Text>
          {savedLocation.map((v, k) => (
            <DestinationBox
              key={k}
              locationData={v}
              refreshPage={fetchSavedLocation}
              showEditNameContainer={() => {
                const { latitude, longitude, location_name } = v;
                editedLocationData.current = {
                  latitude,
                  longitude,
                  previousName: location_name,
                };
                console.log(
                  "Edited location data is now ",
                  editedLocationData.current,
                );
                setShowTextInput(true);
              }}
            />
          ))}
        </View>
      </View>
    </View>
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
