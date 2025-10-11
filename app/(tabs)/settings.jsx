import NavBar from '@/assets/components/NavBar';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Tab() {
    return (
        <View
            style={{
                flex: 1,
                padding: 20,
                flexDirection: "column"
            }}
        >
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});