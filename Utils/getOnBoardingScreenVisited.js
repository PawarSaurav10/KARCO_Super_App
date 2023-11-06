import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setScreenVisited(screenData) {
    await AsyncStorage.setItem(
        "screen_visited",
        screenData
    );
}

export function getScreenVisited() {
    return new Promise(async (resolve, reject) => {
        await AsyncStorage.getItem("screen_visited")
            .then((value) => (value))
            .then((response) => {
                if (response) {
                    resolve(response);
                } else {
                    resolve(null);
                }
            })
            .catch((err) => reject(err));
    });
}