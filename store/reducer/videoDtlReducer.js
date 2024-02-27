import * as actionTypes from "../actions/videoDtlActions";
import { updateObject } from "../../Utils/getScreenVisisted"

const initialState = {
    videoData: null,
    videoId: null,
    videoPassword: null,
    isLoading: null,
    error: null,
};

const videoDateFetchStart = (state, action) => {
    return updateObject(state, {
        isLoading: true,
        error: null,
    });
};

const videoDateFetchSuccess = (state, action) => {
    return updateObject(state, {
        videoData: action.videoData,
        videoId: action.videoId,
        videoPassword: action.videoPassword,
        isLoading: false,
        error: null,
    });
};

const videoDateFetchFail = (state, action) => {
    return updateObject(state, {
        videoData: null,
        videoId: null,
        videoPassword: null,
        isLoading: false,
        error: action.error,
    });
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.VIDEO_DATA_FETCH_START:
            return videoDateFetchStart(state, action);
        case actionTypes.VIDEO_DATA_FETCH_SUCCESS:
            return videoDateFetchSuccess(state, action);
        case actionTypes.VIDEO_DATA_FETCH_FAIL:
            return videoDateFetchFail(state, action);
        default:
            return state;
    }
};
