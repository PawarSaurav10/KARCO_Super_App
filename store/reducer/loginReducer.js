import * as actionTypes from "../actions/loginActions";
import { updateObject } from "../../Utils/getScreenVisisted"

const initialState = {
    userData: null,
    password: null,
    companyData: null,
    isLoading: null,
    error: null,
};

const userLoginStart = (state, action) => {
    return updateObject(state, {
        isLoading: true,
        error: null,
    });
};

const userLoginSuccess = (state, action) => {
    return updateObject(state, {
        userData: action.userData,
        password: action.password,
        isLoading: false,
        error: null,
    });
};

const userLoginFail = (state, action) => {
    return updateObject(state, {
        isLoading: false,
        userData: null,
        password: null,
        error: action.error,
    });
};

const companyLoginStart = (state, action) => {
    return updateObject(state, {
        isLoading: true,
        error: null,
    });
};

const companyLoginSuccess = (state, action) => {
    return updateObject(state, {
        companyData: action.companyData,
        isLoading: false,
        error: null,
    });
};

const companyLoginFail = (state, action) => {
    return updateObject(state, {
        isLoading: false,
        companyData: null,
        error: action.error,
    });
};

const companyLogout = (state, action) => {
    return updateObject(state, {
        isLoading: false,
        companyData: null,
        error: null,
    });
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_START:
            return userLoginStart(state, action)
        case actionTypes.USER_LOGIN_SUCCESS:
            return userLoginSuccess(state, action)
        case actionTypes.USER_LOGIN_FAIL:
            return userLoginFail(state, action)

        case actionTypes.USER_LOGOUT:
            return initialState

        case actionTypes.COMPANY_LOGIN_START:
            return companyLoginStart(state, action)
        case actionTypes.COMPANY_LOGIN_SUCCESS:
            return companyLoginSuccess(state, action)
        case actionTypes.COMPANY_LOGIN_FAIL:
            return companyLoginFail(state, action)

        case actionTypes.COMPANY_LOGOUT:
            return companyLogout(state, action)
        default:
            return state
    }
};
