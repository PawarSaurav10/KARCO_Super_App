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
        await axios.get(`${getURL.base_URL}/applogin/userlogin?username=${username.trimStart("").trimEnd("")}&password=${password.trimStart("").trimEnd("")}`)
            .then((response) => {
                if (response.data.CrewListId > 0) {
                    saveUserDataToStorage(response.data, password.trimStart("").trimEnd(""))
                    dispatch(loginSuccess(response.data, password.trimStart("").trimEnd("")));
                    setOnlineScreenVisited("Yes");
                } else {
                    dispatch(loginFail("Invalid Credentials"));
                }
            })
            .catch((err) => {
                dispatch(loginFail(err))
            });
    };
};

export const logout = async () => {
    await AsyncStorage.removeItem("online_screen_visited")
    await AsyncStorage.removeItem("userData")
    return { type: LOGOUT };
};
