import { updateObject } from "../../Utils/getScreenVisisted";
import * as actionTypes from "../actions/appMainActions";


const initialState = {
    error: null,
    isLoading: false,
    userInfo: [],
    // userDefaultAddress: null,
    // layoutGroup: [],
    // appconfigs: [],
    // isLoaded: null,
    // locations: [],
    // currentlocation: { LocationId: null, LocationName: null },
    // userConfigs: [],
    // userAddress: [],
    // menuData: [],
};


const fetchUserInfoStart = (state, action) => {
    return updateObject(state, {
        isLoading: true,
        error: null,
        userInfo: [],
    });
};

const fetchUserInfoSuccess = (state, action) => {
    // console.log(state,action,"sad")
    return updateObject(state, {
        userInfo: action.userInfo,
        error: null,
        isLoading: false,
    });
};

const fetchUserInfoError = (state, action) => {
    // console.log("user info reducer", action);
    return updateObject(state, {
        isLoading: false,
        userInfo: [],
        error: action.error,
    });
};

export default (state = initialState, action) => {
    switch (action.type) {
  
      case actionTypes.FETCH_USERINFO_START:
        return fetchUserInfoStart(state, action);
      case actionTypes.FETCH_USERINFO_SUCCESS:
        return fetchUserInfoSuccess(state, action);
      case actionTypes.FETCH_USERINFO_FAIL:
        return fetchUserInfoError(state, action);
        
      default:
        return state;
    }
  };
  