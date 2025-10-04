import NavBar from '@/assets/components/NavBar';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

//Main Layout (Safe Area -> Gesture -> View -> Outlet)
export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
            <Tabs.Screen
              name="index"
            />

            <Tabs.Screen
              name="map"
            />

            <Tabs.Screen
              name="settings"
            />
          </Tabs>

          <NavBar />
        </View>

      </GestureHandlerRootView>



    </SafeAreaView>


  );
}
