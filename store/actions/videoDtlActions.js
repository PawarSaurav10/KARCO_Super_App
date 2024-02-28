import { getURL } from "../../baseUrl";
import axios from "axios"

export const VIDEO_DATA_FETCH_START = "VIDEO_DATA_FETCH_START";
export const VIDEO_DATA_FETCH_SUCCESS = "VIDEO_DATA_FETCH_SUCCESS";
export const VIDEO_DATA_FETCH_FAIL = "VIDEO_DATA_FETCH_FAIL";

export const FETCH_VIDEO_DATA_START = "FETCH_VIDEO_DATA_START";
export const FETCH_VIDEO_DATA_SUCCESS = "FETCH_VIDEO_DATA_SUCCESS";
export const FETCH_VIDEO_DATA_FAIL = "FETCH_VIDEO_DATA_FAIL";

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
            dispatch(videoDataFetchFail("No Video ID Found"));
        }
    };
};

const fetchVideoDataStart = () => {
    return {
        type: FETCH_VIDEO_DATA_START,
        error: null,
    };
};

const fetchVideoDataSuccess = (videoData) => {
    return {
        type: FETCH_VIDEO_DATA_SUCCESS,
        karcoVideoData: videoData,
    };
};

const fetchVideoDataFail = (error) => {
    return {
        type: FETCH_VIDEO_DATA_FAIL,
        error: error,
    };
};

export const fetchKARCOVideoData = () => {
    return async (dispatch) => {
        dispatch(fetchVideoDataStart());
        try {
            await axios.get(`${getURL.VideoView_baseURL}?vooKey=${getURL.vooKey}`)
                .then((response) => {
                    const res = response.data.videos.data;
                    let videoData = [];
                    for (const key in res) {
                        videoData.push({
                            ...res[key],
                        });
                    }
                    dispatch(fetchVideoDataSuccess(videoData));
                })
        } catch (err) {
            dispatch(fetchVideoDataFail("Invalid Credentials"));
        }
    };
};
