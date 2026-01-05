import { useAuth } from "@/contexts/AuthContext";
import { useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome6";
import { scheduleOnRN } from "react-native-worklets";

interface locationData {
  location_name: string;
  longitude: number;
  latitude: number;
}

function DestinationBox({
  locationData,
  refreshPage,
}: {
  locationData: locationData;
  refreshPage: Function;
}) {
  const { location_name, latitude, longitude } = locationData;
  const { token } = useAuth();

  // Edit Location Name
  async function editSavedLocationName() {
    console.log("Edit saved location name", location_name);

    try {
      let response = await fetch("http://192.168.0.152:4000/location/edit", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude,
          longitude,
          location_name: "edited_name",
        }),
      });

      let data = await response.json();
      if (data.status == 200) {
        console.log("Successfully Edited Location name");
        refreshPage();
      } else if (data.error) {
        console.log("Error editing location name ", data.error);
      }
    } catch (error) {
      console.log("Error editing location", (error as any).message);
    }
  }

  // Delete Location
  async function deleteSavedLocation() {
    console.log("Deleting saved location", location_name);
    try {
      let response = await fetch("http://192.168.0.152:4000/location/delete", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude,
          longitude,
        }),
      });

      let data = await response.json();
      if (data.status == 200) {
        console.log("Successfully deleted location");
        refreshPage();
      } else if (data.error) {
        console.log("Error deleting location", data.error);
      }
    } catch (error) {
      console.log("Error deleting location", error);
    }
  }

  // UseRef to Prevent Multiple Calls in Same Swipe
  const actionAllowed = useRef(true);
  const userAction = useRef(0); // 0 to Do Nothing, 1 to Delete, 2 to Edit

  // UI Variables
  const offset = useSharedValue<number>(0);
  const direction = useSharedValue("");
  const [originalWidth, setOriginalWidth] = useState(0);
  const [leftSegment, setLeftSegment] = useState(0);
  const [rightSegment, setRightSegment] = useState(0);
  const [allowedMovement, setAllowedMovement] = useState(0);
  const [marginGap, setMarginGap] = useState(0);

  function setWidthPresets(width: number) {
    setOriginalWidth(width);
    setLeftSegment(width / 3);
    setRightSegment((width * 2) / 3);
    setAllowedMovement(width / 4);
    setMarginGap((Dimensions.get("window").width - width) / 2);
  }

  //On Drag Change X and Spring Back the 0 When Released
  const drag = Gesture.Pan()
    .onBegin((event) => {
      let contactPoint = event.absoluteX - marginGap;

      if (contactPoint <= leftSegment) {
        direction.value = "LTR";
      } else if (contactPoint >= rightSegment) {
        direction.value = "RTL";
      } else {
        direction.value = "";
      }
    })

    .onChange((event) => {
      let dragPoint = event.absoluteX - marginGap;

      //Cap at Zero
      if (dragPoint < 0 || dragPoint > originalWidth) return;

      if (direction.value === "LTR") {
        // Move Container as Long as Within Bounds
        if (dragPoint <= allowedMovement) offset.value = dragPoint;

        // Edit Location Name
        if (dragPoint >= allowedMovement && actionAllowed.current) {
          userAction.current = 2;
          actionAllowed.current = false;
        }
      } else if (direction.value === "RTL") {
        let difference = originalWidth - dragPoint;
        if (difference <= allowedMovement) offset.value = -difference;

        // Logic to Trigger Action (Delete Location)
        if (difference >= allowedMovement && actionAllowed.current) {
          userAction.current = 1;
          actionAllowed.current = false;
        }
      }
    })
    .onFinalize(() => {
      offset.value = withSpring(0); // TODO: Fix Not Finalised Properly Issue (Some Leftover Padding Based on Location)
      if (userAction.current == 1) {
        scheduleOnRN(deleteSavedLocation);
      } else if (userAction.current == 2) {
        // Edit Location Name
        scheduleOnRN(editSavedLocationName);
      }

      userAction.current = 0;
      actionAllowed.current = true;
    });

  //Animated Style
  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          direction.value === "RTL"
            ? offset.value - 3
            : direction.value === "LTR"
              ? offset.value + 3
              : 0,
      },
    ],
  }));

  // Only Show if Swiping Right
  const leftActionContainerStyle = useAnimatedStyle(() => ({
    width: direction.value === "LTR" ? offset.value : 0,
  }));

  // Only Show if Swiping Left
  const rightActionContainerStyle = useAnimatedStyle(() => ({
    width: direction.value === "RTL" ? Math.abs(offset.value) : 0,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: Math.abs(offset.value) >= allowedMovement / 2 ? 1 : 0,
  }));

  return (
    <View style={{ flexDirection: "row" }}>
      <Animated.View
        style={[
          styleSheet.sideContainer,
          leftActionContainerStyle,
          {
            backgroundColor: "#FF007F",
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
          },
        ]}
      >
        <Animated.View style={iconStyle}>
          <Icon name="pen" size={25} color="#FFFFFF" />
        </Animated.View>
      </Animated.View>

      <GestureDetector gesture={drag}>
        <Animated.View
          onLayout={(event) => {
            setWidthPresets(event.nativeEvent.layout.width);
          }}
          style={[styleSheet.container, containerStyle]}
        >
          <View style={styleSheet.flexCol}>
            <View style={styleSheet.flexRow}>
              <Icon
                name="location-dot"
                size={25}
                paddingRight={10}
                color="#FF0000"
              />
              <Text style={styleSheet.locationText}>{location_name}</Text>
            </View>

            <View style={styleSheet.flexRow}>
              <Icon name="clock" size={20} paddingRight={10} color="#000000" />
              <Text style={styleSheet.locationSubtext}>15 Mins </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>

      <Animated.View
        style={[
          styleSheet.sideContainer,
          rightActionContainerStyle,
          {
            backgroundColor: "#FF0000",
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
          },
        ]}
      >
        <Animated.View style={iconStyle}>
          <Icon name="trash" size={25} color="#FFFFFF" />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  sideContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    width: "100%",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    boxShadow: "0px 5px 5px #C4C1C1FF",
  },

  flexCol: {
    flexDirection: "column",
  },

  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },

  locationText: {
    fontSize: 16,
    fontFamily: "bold",
  },

  locationSubtext: {
    fontSize: 14,
    fontFamily: "regular",
    color: "#999999",
  },
});

export default DestinationBox;
