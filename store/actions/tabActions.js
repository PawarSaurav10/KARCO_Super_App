export const SET_SELECTED_TAB = "SET_SELECTED_TAB";

export const setSelectedTabSuccess = (selectedTab, params) => ({
    type: SET_SELECTED_TAB,
    payload: { selectedTab, params },
});

export function setSelectedTab(selectedTab, params) {
    return (dispatch) => {
        dispatch(setSelectedTabSuccess(selectedTab, params));
    };
}