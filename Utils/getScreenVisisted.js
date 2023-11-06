import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setOnlineScreenVisited(screenData) {
    console.log(screenData,"screenData")
    AsyncStorage.setItem(
        "online_screen_visited",
        JSON.stringify({
            data: [...screenData],
        })
    );
}

export function getOnlineScreenVisited() {
    return new Promise(async (resolve, reject) => {
        await AsyncStorage.getItem("online_screen_visited")
            .then((value) => JSON.parse(value))
            .then((res) => {
                if (res && res.data) {
                    resolve(res.data);
                    // console.log(res.data, "res.data");
                } else {
                    resolve([]);
                    // console.log(data, "data");
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

export async function saveCompanyDataToStorage(userId, password, companyId, companyName, companyLogoName, companyLogoPath, NoOfShips) {
    AsyncStorage.setItem(
        "userCompanyData_",
        JSON.stringify({
            userId: userId,
            password: password,
            companyId: companyId,
            companyName: companyName,
            companyLogoName: companyLogoName,
            companyLogoPath: companyLogoPath,
            NoOfShips: NoOfShips
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