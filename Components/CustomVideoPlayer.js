import React from 'react'
import { View, Dimensions, Platform } from 'react-native'
import { WebView } from '../node_modules/react-native-webview';

const CustomVideoPlayer = ({ contentType, orientationType, url, posterUrl, mediaPlaybackRequiresUserAction }) => {
    const htmlStyles = `
        <style>
            .video-js{
                width: 100% !important;
                height: 100% !important;
                background: #004C6B;
            }
            .vjs-matrix.video-js .vjs-big-play-button {
                position: absolute; 
                left: 0; 
                right: 0; 
                margin-left: auto; 
                margin-right: auto; 
                width: ${orientationType === "landscape" ? "60px" : "100px"}; /* Need a specific value to work */
                height: ${orientationType === "landscape" ? "60px" : "100px"};
                background-color: #004C6B !important;
                border-color: #004C6B;
                border-radius: ${orientationType === "landscape" ? "60px" : "100px"};
            }
            .vjs-matrix.video-js {
                color: white;
                font-size:  ${orientationType === "landscape" ? "12px" : "20px"} !important;
                text-align: "center"
            }
            .vjs-matrix.video-js .vjs-control-bar{
                position: absolute;
                bottom: 0;
                background-color: #004C6B;
                height: ${orientationType === "landscape" ? "46px" : "72px"};
                padding: ${orientationType === "landscape" ? "6px" : "8px"};
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .vjs-matrix.video-js .vjs-playback-rate{
                font-size: ${orientationType === "landscape" ? "12px" : "20px"};
                padding: 12px;
                width: 50px !important;
            }
            .vjs-matrix.video-js .vjs-play-control{
                width: 26px !important;
                padding: 16px;
                font-size: ${orientationType === "landscape" ? "12px" : "20px"} !important;
            }
            .vjs-matrix.video-js .vjs-fullscreen-control{
                width: 10px !important;
                padding: 16px;
                margin: 10px;
                font-size: ${orientationType === "landscape" ? "12px" : "20px"} !important;
            }
            .vjs-matrix.video-js .vjs-volume-control{
                width: 10px !important;
                padding: 16px;
                margin: 10px;
                font-size: 20px;
            }
        </style>
    `

    const htmlContent = `
        <html> 
            <body> 
                <head>
                    <link href="https://vjs.zencdn.net/8.6.1/video-js.min.css" rel="stylesheet" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                </head>
                <div data-vjs-player>
                    <video   
                    id="my_video"
                    class="vjs-matrix vjs-default-skin video-js"
                    controls
                    width="960"
                    height="264"
                    poster="${posterUrl}"
                    data-setup='{"playbackRates": [0.5, 1, 1.5, 2],"fill": true, "responsive": true, "inactivityTimeout": 1000, "volumeControl": false}'>
                        <source src="${url}"  type="video/mp4">
                    </video>
                </div>
                <script src="https://vjs.zencdn.net/8.6.1/video.min.js"></script>
            </body>
        </html>
    `

    const htmlDownloadContent = `
        <html> 
            <body> 
                <head>
                    <link href="https://vjs.zencdn.net/8.6.1/video-js.min.css" rel="stylesheet" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                </head>
                <div data-vjs-player>
                    <video   
                    autoplay
                    id="my_video"
                    class="vjs-matrix vjs-default-skin video-js "
                    controls
                    width="960"
                    height="264"
                    data-setup='{"playbackRates": [0.5, 1, 1.5, 2],"fill": true, "responsive": true}'>
                        <source src="file://${url}"  type="video/mp4">
                    </video>
                </div>
                <script src="https://vjs.zencdn.net/8.6.1/video.min.js"></script>
            </body> 
        </html>
    `;

    let rawhtml = htmlStyles + htmlContent
    let rawhtmlContent = htmlStyles + htmlDownloadContent

    return (
        <View style={{ width: Dimensions.get('screen').width, height: 240 }}>
            <WebView
                allowFileAccess={true}
                source={{ html: contentType !== "Downloads" ? rawhtml : rawhtmlContent }}
                mediaPlaybackRequiresUserAction={mediaPlaybackRequiresUserAction}
                allowsFullscreenVideo={true}
                minimumFontSize={orientationType === "landscape" ? 16 : 30}
                scalesPageToFit={(Platform.OS === 'ios') ? false : true}
                javaScriptEnabled={true}
            />
        </View>
    )
}

export default CustomVideoPlayer
