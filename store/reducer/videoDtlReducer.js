import * as actionTypes from "../actions/videoDtlActions";
import { updateObject } from "../../Utils/getScreenVisisted"

const initialState = {
    videoData: null,
    videoId: null,
    videoPassword: null,
    isLoading: null,
    error: null,
    karcoVideoData: []
};

const videoDataFetchStart = (state, action) => {
    return updateObject(state, {
        isLoading: true,
        error: null,
    });
};

const videoDataFetchSuccess = (state, action) => {
    return updateObject(state, {
        videoData: action.videoData,
        videoId: action.videoId,
        videoPassword: action.videoPassword,
        isLoading: false,
        error: null,
    });
};

const videoDataFetchFail = (state, action) => {
    return updateObject(state, {
        videoData: null,
        videoId: null,
        videoPassword: null,
        isLoading: false,
        error: action.error,
    });
};

const fetchVideoDataStart = (state, action) => {
    return updateObject(state, {
        isLoading: true,
        error: null,
    });
};

const fetchVideoDataSuccess = (state, action) => {
    return updateObject(state, {
        karcoVideoData: action.karcoVideoData,
        isLoading: false,
        error: null,
    });
};

const fetchVideoDataFail = (state, action) => {
    return updateObject(state, {
        karcoVideoData: [],
        isLoading: false,
        error: action.error,
    });
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.VIDEO_DATA_FETCH_START:
            return videoDataFetchStart(state, action);
        case actionTypes.VIDEO_DATA_FETCH_SUCCESS:
            return videoDataFetchSuccess(state, action);
        case actionTypes.VIDEO_DATA_FETCH_FAIL:
            return videoDataFetchFail(state, action);

        case actionTypes.FETCH_VIDEO_DATA_START:
            return fetchVideoDataStart(state, action);
        case actionTypes.FETCH_VIDEO_DATA_SUCCESS:
            return fetchVideoDataSuccess(state, action);
        case actionTypes.FETCH_VIDEO_DATA_FAIL:
            return fetchVideoDataFail(state, action);
        default:
            return state;
    }
};
