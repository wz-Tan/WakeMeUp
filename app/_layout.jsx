import { GoogleMapProvider } from "../contexts/GoogleMapContext"
import { FontAwesome6 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "semibold": require("../assets/fonts/Poppins-SemiBold.ttf"),

    ...FontAwesome6.font
  })

  if (!fontsLoaded ){
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Loading App</Text>
      </SafeAreaView>
    )
  }

  return (
    <GoogleMapProvider>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GoogleMapProvider>
  )
    ;

}
