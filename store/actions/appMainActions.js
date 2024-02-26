import axios from "axios";
import UserInfo from "../model/userInfo";
import { setSelectedTab } from "./tabActions";



// Initial
export const INITIAL_LOAD_COMPLETED = "INITIAL_LOAD_COMPLETED";
export const INITIAL_LOAD_RESET = "INITIAL_LOAD_RESET";

// UserInfo
export const FETCH_USERINFO_START = "FETCH_USERINFO_START";
export const FETCH_USERINFO_SUCCESS = "FETCH_USERINFO_SUCCESS";
export const FETCH_USERINFO_FAIL = "FETCH_USERINFO_FAIL";

// SAVE_USERLOGIN_LOG_START
export const SAVE_USERLOGIN_LOG_START = "SAVE_USERLOGIN_LOG_START";
export const SAVE_USERLOGIN_LOG_SUCCESS = "SAVE_USERLOGIN_LOG_SUCCESS";
export const SAVE_USERLOGIN_LOG_FAIL = "SAVE_USERLOGIN_LOG_FAIL";

export const fetchAppMain = () => {
    // console.log("called in fetchAppMain")
    return (dispatch, getState) => {
        Promise.all([
            dispatch({ type: INITIAL_LOAD_RESET }),
            dispatch(saveUserLogin()),
            dispatch(fetchUserInfo()),
            dispatch(setSelectedTab("Home"))
        ]).then(() => {
            dispatch({ type: INITIAL_LOAD_COMPLETED });
        });
    };
};

export const fetchUserInfo = () => {
    return async (dispatch, getState) => {
        // console.log(getState().loginReducer,"sad")
        dispatch({ type: FETCH_USERINFO_START });
        try {
            const userData = getState().loginReducer;
            // console.log(userData.CompCode,"CompCode")

            // const transformedData = await JSON.parse(userData);

            const data = {
                CompCode: userData.CompCode ? userData.CompCode : 1,
                userType: userData.userType,
                userId: userData.userId,
            };
            const res = await axios.get(
                `appmain/getUserInfo/${data.CompCode}/${data.userType}/${data.userId}`
            );
            const resData = res.data.data;

            let userInfo = new UserInfo();
            for (const key in resData) {
                userInfo = new UserInfo(
                    resData[key].UserType,
                    resData[key].UserId,
                    resData[key].UserTypeRef,
                    resData[key].Name,
                    resData[key].email,
                    resData[key].mobile,
                    resData[key].gender,
                    resData[key].hasDemographyInfo
                );

                // userInfo.push({ ...resData[key], key: parseFloat(key) });
            }
            dispatch({
                type: FETCH_USERINFO_SUCCESS,
                userInfo: userInfo,
            });
        } catch (err) {
            dispatch({
                type: FETCH_USERINFO_FAIL,
                error: "Network error !! Check your internet connection",
            });
        }
    };
};

export const saveUserLogin = (token) => {
    return async (dispatch, getState) => {
        dispatch({ type: SAVE_USERLOGIN_LOG_START });
        try {
            let token = null;
            let deviceName = null;
            const userData = getState().loginReducer;
            await AsyncStorage.getItem("tokenData_" + userData.userType)
                .then((value) => JSON.parse(value))
                .then((res) => {
                    // console.log(res, "token");
                    token = res.token;
                });
            await DeviceInfo.getDeviceName().then((res) => (deviceName = res));

            const data = {
                CompCode: getState().loginReducer.CompCode,
                UserType: userData.userType,
                UserId: userData.userId,
                MobileNo: userData.mobileNo,
                DeviceName: deviceName,
                ExpoDeviceId: null,
                SystemOS: Platform.OS,
                SystemOSVerNo: Platform.Version,
                ExpoNotificationToken: token,
            };

            const res = await axios.post("appmain/InsUserLoginLogs", data);

            const resData = res.data.data;

            let userConfigs = [];
            // let userConfigs = new AppUserConfigs();

            for (const key in resData) {
                // console.log( resData[key]," resData[key]")
                // userConfigs = new AppUserConfigs(
                //   resData[key].UserType,
                //   resData[key].UserId,
                //   resData[key].IsReceivePushNotifications,
                //   resData[key].IsReceivePromoEmails,
                //   resData[key].IsReceivePromoSMS,
                //   resData[key].ExpoNotificationToken,
                //   resData[key].LL_DeviceName,
                //   resData[key].LL_ExpoDeviceId,
                //   resData[key].LL_SystemOS,
                //   resData[key].LL_SystemOSVerNo,
                //   resData[key].LL_LoginDttm,
                //   resData[key].isLocked
                // );
                userConfigs.push({
                    UserType: resData[key].UserType,
                    UserId: resData[key].UserId,
                    IsReceivePushNotifications: resData[key].IsReceivePushNotifications,
                    IsReceivePromoEmails: resData[key].IsReceivePromoEmails,
                    IsReceivePromoSMS: resData[key].IsReceivePromoSMS,
                    ExpoNotificationToken: resData[key].ExpoNotificationToken,
                    LL_DeviceName: resData[key].LL_DeviceName,
                    LL_ExpoDeviceId: resData[key].LL_ExpoDeviceId,
                    LL_SystemOS: resData[key].LL_SystemOS,
                    LL_SystemOSVerNo: resData[key].LL_SystemOSVerNo,
                    LL_LoginDttm: resData[key].LL_LoginDttm,
                    isLocked: resData[key].isLocked,
                });

                dispatch({
                    type: SAVE_USERLOGIN_LOG_SUCCESS,
                    userConfigs: userConfigs,
                });
            }
        } catch (err) {
            console.log(err);
            dispatch({
                type: SAVE_USERLOGIN_LOG_FAIL,
                error: "Network error !! Check your internet connection",
            });
        }
    };
};