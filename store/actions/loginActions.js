import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getURL } from "../../baseUrl";
import { setOnlineScreenVisited, saveUserDataToStorage } from "../../Utils/getScreenVisisted";
import { saveUserLogin } from "./appMainActions";

export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";

export const LOGOUT = "LOGOUT";

const loginStart = () => {
    return {
        type: LOGIN_START,
        error: null,
    };
};

const loginSuccess = (userData, password) => {
    console.log("login suceess")
    return {
        type: LOGIN_SUCCESS,
        userData: userData,
        password: password
    };
};
const loginFail = (error) => {
    return {
        type: LOGIN_FAIL,
        error: error,
    };
};

export const login = (username, password) => {
    return async (dispatch) => {
        dispatch(loginStart());
        console.log("object")
        try {
            console.log("object1")
            await axios.get(`${getURL.base_URL}/applogin/userlogin?username=${username}&password=${password}`)
                .then((response) => {
                    console.log("object2")
                    if (response.data.CrewListId > 0) {
                        console.log("object3")
                        saveUserDataToStorage(response.data, password)
                        dispatch(loginSuccess(response.data, password))
                        setOnlineScreenVisited("Yes")
                    } else {
                        console.log("object4")
                        dispatch(loginFail("Invalid Credentials"))
                    }
                })
        } catch (err) {
            console.log("object5")

            dispatch(loginFail("Invalid Credentials"));
        }

    };
};

export const logout = () => {
    AsyncStorage.removeItem('persist:root')
    AsyncStorage.removeItem("online_screen_visited")
    AsyncStorage.removeItem("userData")
    return { type: LOGOUT };
};
