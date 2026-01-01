import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome6";

// To Do: Pass Arguments into Destination Box
function DestinationBox() {
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
        if (dragPoint <= allowedMovement) offset.value = dragPoint;
      } else if (direction.value === "RTL") {
        let difference = originalWidth - dragPoint;
        if (difference <= allowedMovement) offset.value = -difference;
      } else {
        return;
      }
    })
    .onFinalize(() => {
      offset.value = withSpring(0);
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

  const leftContainerStyle = useAnimatedStyle(() => ({
    width: direction.value === "LTR" ? offset.value : 0,
  }));

  const rightContainerStyle = useAnimatedStyle(() => ({
    width: direction.value === "RTL" ? Math.abs(offset.value) : 0,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: Math.abs(offset.value) >= allowedMovement / 2 ? 1 : 0,
  }));

  return (
    <View style={{ flexDirection: "row" }}>
      {/* Side Bar */}

      <Animated.View
        style={[
          styleSheet.sideContainer,
          leftContainerStyle,
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
          <Icon name="heart" size={25} color="#FFFFFF" />
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
              <Text style={styleSheet.locationText}>LRT USJ 7 </Text>
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
          rightContainerStyle,
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
