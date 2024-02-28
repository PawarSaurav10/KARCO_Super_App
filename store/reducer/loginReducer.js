import * as actionTypes from "../actions/loginActions";
import { updateObject } from "../../Utils/getScreenVisisted"

const initialState = {
    userData: null,
    password: null,
    isLoading: null,
    error: null,
};

const loginStart = (state, action) => {
    return updateObject(state, {
        isLoading: true,
        error: null,
    });
};

const loginSuccess = (state, action) => {
    return updateObject(state, {
        userData: action.userData,
        password: action.password,
        isLoading: false,
        error: null,
    });
};

const loginFail = (state, action) => {
    return updateObject(state, {
        isLoading: false,
        userData: null,
        password: null,
        error: action.error,
    });
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_START:
            return loginStart(state, action)
        case actionTypes.LOGIN_SUCCESS:
            return loginSuccess(state, action)
        case actionTypes.LOGIN_FAIL:
            return loginFail(state, action)

        case actionTypes.LOGOUT:
            return initialState
        default:
            return state
    }
};
