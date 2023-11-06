import * as tabActionTypes from "../actions/tabActions";

const initialState = {
    selectedTab: "",
    params: null,
};

const tabReducer = (state = initialState, action) => {
    switch (action.type) {
        case tabActionTypes.SET_SELECTED_TAB:
            return {
                ...state,
                selectedTab: action.payload.selectedTab,
                params: action.payload.params,
            };
        default:
            return state;
    }
};

export default tabReducer;