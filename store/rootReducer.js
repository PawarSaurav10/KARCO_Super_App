import { combineReducers } from "redux";
import tabReducer from "./reducer/tabReducer"
import screenVisitedReducer from "./reducer/screenVisitedReducer"

export default combineReducers({
    tabReducer,
    screenVisitedReducer
});