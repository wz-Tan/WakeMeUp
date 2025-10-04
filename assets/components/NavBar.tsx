import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";


export default function NavBar() {
    const router = useRouter();
    const pathName= usePathname();

    return (
        <View style={styleSheet.navBar}>
            <TouchableOpacity style={styleSheet.iconCol}
                onPress={() => {
                    if (pathName!="/") router.navigate("/(tabs)")
                }}
            >
                <Icon
                    name="house"
                    color="#000000"
                    size={25}
                />

                <View style={{opacity: pathName=="/" ? 1 : 0}}>
                    <Icon
                        name="circle-dot"
                        color="#63099c"
                        size={10}
                    />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styleSheet.iconCol}
                onPress={() => {
                    if (pathName!="/map") router.navigate("/(tabs)/map")
                }}
            >
                <Icon
                    name="map"
                    color="#000000"
                    size={25}
                />

                <View style={{opacity: pathName=="/map" ? 1 : 0}}>
                    <Icon
                        name="circle-dot"
                        color="#63099c"
                        size={10}
                    />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styleSheet.iconCol}
                onPress={() => {
                    if (pathName!="/settings") router.navigate("/(tabs)/settings")
                }}
            >
                <Icon
                    name="user"
                    color="#000000"
                    size={25}
                />

                <View style={{opacity: pathName=="/settings" ? 1 : 0}}>
                    <Icon
                        name="circle-dot"
                        color="#63099c"
                        size={10}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styleSheet = StyleSheet.create({
    navBar: {
        backgroundColor: "#FFFFFF",
        position: "absolute",
        width: "90%",
        flex: 1,
        alignSelf: "center",
        bottom: 30,
        flexDirection: "row",
        borderRadius: 30,
        padding: 10,
        justifyContent: "space-around",
        boxShadow: "0px 2px 15px #C4C1C1FF"
    },

    iconCol: {
        flexDirection: "column",
        gap: 3,
        alignItems: "center"
    }
})