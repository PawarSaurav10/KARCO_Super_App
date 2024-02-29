import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setOnlineScreenVisited(screenData) {
    await AsyncStorage.setItem(
        "online_screen_visited",
        screenData
    );
}

export function getOnlineScreenVisited() {
    return new Promise(async (resolve, reject) => {
        await AsyncStorage.getItem("online_screen_visited")
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


export async function setScreenVisited(screenData) {
    await AsyncStorage.setItem(
        "screen_visited",
        screenData
    );
}

export async function saveCompanyDataToStorage(companyData) {
    AsyncStorage.setItem(
        "userCompanyData_",
        JSON.stringify({
            companyData: companyData
        })
    );
};

export function getCompanyUserData() {
    return new Promise(async (resolve, reject) => {
        await AsyncStorage.getItem("userCompanyData_")
            .then((value) => JSON.parse(value))
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

export async function saveUserDataToStorage(userData, userPassword) {
    AsyncStorage.setItem(
        "userData",
        JSON.stringify({ userData: userData, userPassword: userPassword })
    );
};


export async function saveDataToStorage(userId, password, crewId, vesselId) {
    AsyncStorage.setItem(
        "userData_",
        JSON.stringify({
            userId: userId,
            password: password,
            crewId: crewId,
            vesselId: vesselId
        })
    );
};

export function getUserData_1() {
    return new Promise(async (resolve, reject) => {
        await AsyncStorage.getItem("userData")
            .then((value) => JSON.parse(value))
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


export function getUserData() {
    return new Promise(async (resolve, reject) => {
        await AsyncStorage.getItem("userData_")
            .then((value) => JSON.parse(value))
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

export async function setDownloaded(screenData) {
    await AsyncStorage.setItem(
        "downloaded",
        screenData
    );
}

export function getDownloaded() {
    return new Promise(async (resolve, reject) => {
        await AsyncStorage.getItem("downloaded")
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


export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties,
    };
};