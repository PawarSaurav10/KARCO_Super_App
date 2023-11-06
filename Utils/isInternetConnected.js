import NetInfo from "@react-native-community/netinfo";
import RNExitApp from 'react-native-exit-app';
import { Platform, Alert, View } from "react-native";
import NoInternetComponent from "../Components/NoInternetComponent";
import { useNavigation } from "../node_modules/@react-navigation/core";


export default class NetworkUtils {
    static async isNetworkAvailable() {
        const response = await NetInfo.fetch();
        return response.isConnected;
    }
}

export async function CheckConnectivity() {
    // For Android devices
    if (Platform.OS === "android") {
        NetInfo.fetch().then(xx => {
            if (xx.isConnected) {
                // Alert.alert("You are online!");
            } else {
                Alert.alert('Oops !!', 'Your Device is not Connected to Internet, Please Check your Internet Connectivity', [
                    { text: 'OK', onPress: () => RNExitApp.exitApp() },
                ]);
            }
        });
    } else {
        // For iOS devices
        NetInfo.isConnected.addEventListener(
            "connectionChange",
            this.handleFirstConnectivityChange
        );
    }
};

handleFirstConnectivityChange = isConnected => {
    NetInfo.isConnected.removeEventListener(
        "connectionChange",
        this.handleFirstConnectivityChange
    );

    if (isConnected === false) {
        Alert.alert('Oops !!', 'Your Device is not Connected to Internet, Please Check your Internet Connectivity', [
            { text: 'OK', onPress: () => RNExitApp.exitApp() },
        ]);
    } else {
        Alert.alert("You are online!");
    }
};

export async function CheckConnectivityInternet() {
//    const navigation = useNavigation()
    // For Android devices
    if (Platform.OS === "android") {
        NetInfo.fetch().then(xx => {
            if (xx.isConnected) {
                // Alert.alert("You are online!");
            } else {
                Alert.alert('Oops !!', 'Your Device is not Connected to Internet, Please Check your Internet Connectivity', [
                    { text: 'OK', onPress: () => navigation.replace("Downloads") },
                ]);
            }
        });
    } else {
        // For iOS devices
        NetInfo.isConnected.addEventListener(
            "InternetConnectionChange",
            this.handleFirstIneternetConnectivityChange
        );
    }
};

handleFirstIneternetConnectivityChange = isConnected => {
    NetInfo.isConnected.removeEventListener(
        "InternetConnectionChange",
        this.handleFirstIneternetConnectivityChange
    );

    if (isConnected === false) {
        Alert.alert('Oops !!', 'Your Device is not Connected to Internet, Please Check your Internet Connectivity', [
            { text: 'OK', onPress: () => navigation.replace("Downloads") },
        ]);
    } else {
        // Alert.alert("You are online!");
    }
};