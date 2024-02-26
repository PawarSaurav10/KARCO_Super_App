import { combineReducers } from "redux";
import tabReducer from "./reducer/tabReducer"
import loginReducer from "./reducer/loginReducer";
import screenVisitedReducer from "./reducer/screenVisitedReducer"

export default combineReducers({
    loginReducer,
    tabReducer,
    screenVisitedReducer
});