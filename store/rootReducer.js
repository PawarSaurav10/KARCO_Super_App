import { combineReducers } from "redux";
import tabReducer from "./reducer/tabReducer"
import loginReducer from "./reducer/loginReducer";
import screenVisitedReducer from "./reducer/screenVisitedReducer"
import videoDtlReducer from "./reducer/videoDtlReducer"

export default combineReducers({
    loginReducer,
    videoDtlReducer,
    tabReducer,
    screenVisitedReducer
});