import * as screenActionsTypes from "../actions/ScreenActions";

const initialState = {
    screenVsited: "",
    params: null,
};

const screenVsitedReducer = (state = initialState, action) => {
    switch (action.type) {
        case screenActionsTypes.SET_SELECTED_TAB:
            return {
                ...state,
                screenVsited: action.payload.screenVisited,
                params: action.payload.params,
            };
        default:
            return state;
    }
};

export default screenVsitedReducer;