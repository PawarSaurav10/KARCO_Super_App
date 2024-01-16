import NetInfo from "@react-native-community/netinfo";
import RNExitApp from 'react-native-exit-app';
import { Platform, Alert, View } from "react-native";
import CustomToast from "../Components/CustomToast";
import DownloadedIcon from "../Images/checkmark.png"

export class NetworkUtils {
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

handleFirstConnectivityChange = (isConnected) => {
    NetInfo.isConnected.removeEventListener(
        "connectionChange",
        this.handleFirstConnectivityChange
    );

    if (isConnected === false) {
        Alert.alert('Oops !!', 'Your Device is not Connected to Internet, Please Check your Internet Connectivity', [
            { text: 'OK', onPress: () => RNExitApp.exitApp() },
        ]);
    }
};


export async function CheckDownload(isDownload) {
    // For Android devices
    if (isDownload) {
        <CustomToast
            icon={DownloadedIcon}
            iconStyle={{
                tintColor: COLORS.white,
                marginRight: 10,
            }}
            containerStyle={{
                backgroundColor: COLORS.primary,
            }}
            labelStyle={{
                color: COLORS.white,
                fontWeight: "bold",
            }}
            message={"Your Video is Downloaded"}
            onHide={() => {
                !isDownload
            }}
        />
    } else {
        // setisDownload(false)
    }
};