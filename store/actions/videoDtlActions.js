export const VIDEO_DATA_FETCH_START = "VIDEO_DATA_FETCH_START";
export const VIDEO_DATA_FETCH_SUCCESS = "VIDEO_DATA_FETCH_SUCCESS";
export const VIDEO_DATA_FETCH_FAIL = "VIDEO_DATA_FETCH_FAIL";

const videoDataFetchStart = () => {
    return {
        type: VIDEO_DATA_FETCH_START,
        error: null,
    };
};

const videoDataFetchSuccess = (videoData, videoId, videoPassword) => {
    return {
        type: VIDEO_DATA_FETCH_SUCCESS,
        videoData: videoData,
        videoId: videoId,
        videoPassword: videoPassword,
    };
};

const videoDataFetchFail = (error) => {
    return {
        type: VIDEO_DATA_FETCH_FAIL,
        error: error,
    };
};

export const fetchVideoData = (videoData, videoId, videoPassword) => {
    return async (dispatch) => {
        dispatch(videoDataFetchStart());
        if (videoId !== 0) {
            dispatch(videoDataFetchSuccess(videoData, videoId, videoPassword));
        } else {
            dispatch(videoDataFetchFail("Invalid Credentials"));
        }
    };
};
