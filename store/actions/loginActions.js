import AsyncStorage from "@react-native-async-storage/async-storage";
import { setOnlineScreenVisited, saveUserDataToStorage, saveCompanyDataToStorage, setScreenVisited } from "../../Utils/getScreenVisisted";

export const USER_LOGIN_START = "USER_LOGIN_START";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_UCCESS";
export const USER_LOGIN_FAIL = "USER_LOGIN_FAIL";

export const USER_LOGOUT = "USER_LOGOUT";

export const COMPANY_LOGIN_START = "COMPANY_LOGIN_START";
export const COMPANY_LOGIN_SUCCESS = "COMPANY_LOGIN_UCCESS";
export const COMPANY_LOGIN_FAIL = "COMPANY_LOGIN_FAIL";

export const COMPANY_LOGOUT = "COMPANY_LOGOUT";

const userLoginStart = () => {
    return {
        type: USER_LOGIN_START,
        error: null,
    };
};

const userLoginSuccess = (userData, password) => {
    return {
        type: USER_LOGIN_SUCCESS,
        userData: userData,
        password: password
    };
};
const userLoginFail = (error) => {
    return {
        type: USER_LOGIN_FAIL,
        error: error,
    };
};

export const userLogin = (userData, password) => {
    return async (dispatch) => {
        dispatch(userLoginStart());
        try {
            if (userData) {
                saveUserDataToStorage(userData, password)
                dispatch(userLoginSuccess(userData, password))
                setOnlineScreenVisited("Yes")
            } else {
                dispatch(userLoginFail("Invalid Credentials"));
            }
        } catch (err) {
            dispatch(userLoginFail(err));
        }
    };
};

// export const login = (username, password) => {
//     return async (dispatch) => {
//         dispatch(loginStart());
//         try {
//             await axios.get(`${getURL.base_URL}/applogin/userlogin?username=${username}&password=${password}`)
//                 .then((response) => {
//                     if (response.data.CrewListId > 0) {
//                         saveUserDataToStorage(response.data, password)
//                         dispatch(loginSuccess(response.data, password))
//                         setOnlineScreenVisited("Yes")
//                     } else {
//                         dispatch(loginFail("Invalid Credentials"))
//                     }
//                 })
//         } catch (err) {
//             dispatch(loginFail("Invalid Credentials"));
//         }
//     };
// };

export const userLogout = () => {
    AsyncStorage.removeItem('persist:root')
    AsyncStorage.removeItem("online_screen_visited")
    AsyncStorage.removeItem("userData")
    return { type: USER_LOGOUT };
};

const companyLoginStart = () => {
    return {
        type: COMPANY_LOGIN_START,
        error: null,
    };
};

const companyLoginSuccess = (companyData) => {
    return {
        type: COMPANY_LOGIN_SUCCESS,
        // userData: userData,
        companyData: companyData,
    };
};
const companyLoginFail = (error) => {
    return {
        type: COMPANY_LOGIN_FAIL,
        error: error,
    };
};

export const companyLogin = (companyData) => {
    return async (dispatch) => {
        dispatch(companyLoginStart());
        try {
            if (companyData) {
                saveCompanyDataToStorage(companyData)
                dispatch(companyLoginSuccess(companyData))
                setScreenVisited("Yes")
            } else {
                dispatch(companyLoginFail("Invalid Credentials"));
            }
        } catch (err) {
            dispatch(companyLoginFail(err));
        }
    };
};

export const companyLogout = () => {
    AsyncStorage.removeItem("screen_visited")
    AsyncStorage.removeItem("userCompanyData_")
    return {
        type: COMPANY_LOGOUT,
        companyData: null,
    };
};
