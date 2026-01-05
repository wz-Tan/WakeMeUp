import { GoogleMapProvider } from "../contexts/GoogleMapContext";
import { AuthContextProvider } from "../contexts/AuthContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ToastManager from "toastify-react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    regular: require("../assets/fonts/Poppins-Regular.ttf"),
    bold: require("../assets/fonts/Poppins-Bold.ttf"),
    medium: require("../assets/fonts/Poppins-Medium.ttf"),
    semibold: require("../assets/fonts/Poppins-SemiBold.ttf"),

    ...FontAwesome6.font,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Loading Fonts</Text>
      </SafeAreaView>
    );
  }

  // Display Login Screen
  return (
    <AuthContextProvider>
      <GoogleMapProvider>
        <Stack
          initialRouteName="authLanding"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="authLanding" options={{ headerShown: false }} />
          <Stack.Screen name="signUp" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <ToastManager/>
      </GoogleMapProvider>
    </AuthContextProvider>
  );
}
