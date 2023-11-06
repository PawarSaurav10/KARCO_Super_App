export const SET_SECREEN_VISITED = "SET_SECREEN_VSITED";

export const setSecreenVistedSuccess = (screenVisited, params) => ({
    type: SET_SECREEN_VISITED,
    payload: { screenVisited, params },
});

export function setSecreenVisted(screenVisited, params) {
    return (dispatch) => {
        dispatch(setSecreenVistedSuccess(screenVisited, params));
    };
}
