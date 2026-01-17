import DestinationBox from "@/assets/components/DestinationBox";
import LoadingPopUp from "@/assets/components/Loading";
import CloudyIcon from "@/assets/icon/cloudy.png";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Toast } from "toastify-react-native";
import { TextInputContainer } from "@/assets/components/TextInputContainer";
import { requestPermissions } from "@/contexts/LocationContext";
import { ActivationConfirmationContainer } from "@/assets/components/ActivationConfirmationContainer";
import { DeletionConfirmationContainer } from "@/assets/components/DeletionConfirmationContainer";

export default function Tab() {
  const URL_ENDPOINT = process.env.EXPO_PUBLIC_WIFI_ENDPOINT;

  const { token } = useAuth();
  const [loading, setLoading] = useState("");
  const [savedLocation, setSavedLocation] = useState([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const [confirmationContainer, setConfirmationContainer] = useState({
    activationContainer: false,
    deletionContainer: false,
  });
  const selectedActiveLocation = useRef();
  const editedLocationData = useRef({
    previousName: "",
    latitude: "",
    longitude: "",
  });

  const [time, setTime] = useState({
    hours: Number,
    minutes: Number,
  });

  setInterval(() => {
    let now = new Date();
    setTime({
      hours: now.getHours(),
      minutes: now.getMinutes(),
    });
  }, 60000);

  async function fetchSavedLocation() {
    try {
      let response = await fetch(`${URL_ENDPOINT}/location/get`, {
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
      let response = await fetch(`${URL_ENDPOINT}/location/edit`, {
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

  // Delete Location
  async function deleteSavedLocation(latitude, longitude) {
    console.log("Deleting location with coordinates", latitude, longitude);
    try {
      let response = await fetch(`${URL_ENDPOINT}/location/delete`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token.current}`,
        },
        body: JSON.stringify({
          latitude,
          longitude,
        }),
      });

      let data = await response.json();
      if (data.status == 200) {
        console.log("Successfully deleted location");
        fetchSavedLocation();
      } else if (data.error) {
        console.log("Error deleting location", data.error);
      }
    } catch (error) {
      console.log("Error deleting location", error);
    }
  }

  useEffect(() => {
    // requestPermissions();
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
      {/* Loading */}
      {loading && <LoadingPopUp loadingMessage={loading} />}

      {/* Confirmation UI */}
      {/* Set Active Destination*/}
      {confirmationContainer.activationContainer && (
        <ActivationConfirmationContainer
          locationData={selectedActiveLocation.current}
          closeConfirmationContainer={() =>
            setConfirmationContainer((prev) => ({
              ...prev,
              activationContainer: false,
            }))
          }
        />
      )}

      {/* Delete Selected Destination */}
      {confirmationContainer.deletionContainer && (
        <DeletionConfirmationContainer
          locationData={selectedActiveLocation}
          deleteLocation={(latitude, longitude) =>
            deleteSavedLocation(latitude, longitude)
          }
          closeConfirmationContainer={() =>
            setConfirmationContainer((prev) => ({
              ...prev,
              deletionContainer: false,
            }))
          }
        />
      )}

      {/* Edit Location Name */}
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
            <Text
              style={styleSheet.headerSubText}
            >{`${time.hours % 12}:${time.minutes} ${time.hours > 12 ? "PM" : "AM"}`}</Text>
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
              deleteSavedLocation={() => {
                deleteSavedLocation(v.latitude, v.longitude);
              }}
              showEditNameContainer={() => {
                const { latitude, longitude, location_name } = v;
                editedLocationData.current = {
                  latitude,
                  longitude,
                  previousName: location_name,
                };
                setShowTextInput(true);
              }}
              setSelectedActiveLocation={(locationData) =>
                (selectedActiveLocation.current = locationData)
              }
              showActiveConfirmationContainer={() =>
                setConfirmationContainer((prev) => ({
                  ...prev,
                  activationContainer: true,
                }))
              }
              showDeleteConfirmationContainer={() =>
                setConfirmationContainer((prev) => ({
                  ...prev,
                  deletionContainer: true,
                }))
              }
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
