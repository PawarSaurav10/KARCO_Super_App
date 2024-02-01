import React, { useRef, useMemo } from 'react'
import { View, Dimensions, Platform } from 'react-native'
import { WebView } from '../node_modules/react-native-webview';

const CustomVideoPlayer = ({ contentType, orientationType, url, posterUrl, mediaPlaybackRequiresUserAction }) => {
    const dim = Dimensions.get('screen');
    // if (dim.height >= dim.width) {
    //     setOrientation("protrait")
    // } else {
    //     setOrientation("landscape")
    // }

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
                width: ${dim.height <= dim.width ? "75px" : "75px"}; /* Need a specific value to work */
                height: ${dim.height <= dim.width ? "75px" : "75px"};
                background-color: #004C6B !important;
                border-color: #004C6B;
                border-radius: ${dim.height <= dim.width ? "75px" : "75px"};
            }
            .vjs-matrix.video-js {
                color: white;
                font-size:  ${dim.height <= dim.width ? "16px" : "16px"} !important;
                text-align: "center"
            }
            .vjs-matrix.video-js .vjs-control-bar{
                position: absolute;
                bottom: 0;
                background-color: #004C6B;
                height: ${dim.height <= dim.width ? "59px" : "59px"};
                padding: ${dim.height <= dim.width ? "6px" : "8px"};
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .vjs-matrix.video-js .vjs-playback-rate{
                font-size: ${dim.height <= dim.width ? "16px" : "16px"};
                padding: 12px;
                width: 50px !important;
            }
            .vjs-matrix.video-js .vjs-play-control{
                width: 30px !important;
                padding: 16px;
                font-size: ${dim.height <= dim.width ? "16px" : "16px"} !important;
            }
            .vjs-matrix.video-js .vjs-fullscreen-control{
                width: 30px !important;
                padding: 16px;
                margin: 10px;
                font-size: ${dim.height <= dim.width ? "16px" : "16px"} !important;
            } 
            .vjs-matrix.video-js .vjs-volume-control{
                width: 30px !important;
                padding: 16px;
                margin: 10px;
                font-size: 16px !important;
            }
            .vjs-matrix.video-js .vjs-remaining-time{
                color:"red";
                top: 0px;
                font-size: 16px !important;
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
                    preload="auto"
                    poster="${posterUrl}"
                    data-setup='{"playbackRates": [0.5, 1, 1.5, 2],"fill": true, "responsive": true, "inactivityTimeout": 1000, "volumeControl": false, "landscapeFullscreen" :{"enterOnRotate": true}}'>
                        <source src="${url}"  type="video/mp4">
                    </video>
                </div>
                <script src="https://vjs.zencdn.net/8.6.1/video.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/videojs-landscape-fullscreen@1.4.6/dist/videojs-landscape-fullscreen.min.js"></script>
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
                    preload="auto"
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
    const webview =
        <WebView
            allowFileAccess={true}
            source={{ html: contentType !== "Downloads" ? rawhtml : rawhtmlContent }}
            mediaPlaybackRequiresUserAction={dim.height <= dim.width ? mediaPlaybackRequiresUserAction : false}
            allowsFullscreenVideo={true}
            minimumFontSize={20}
            javaScriptEnabled={true}
        />


    const webviewComponent = useMemo(() => (
        webview
    ), [url])

    return (
        <View style={{ width: Dimensions.get('window').width, height: 240 }}>
            {/* <WebView
            allowFileAccess={true}
            source={{ html: contentType !== "Downloads" ? rawhtml : rawhtmlContent }}
            mediaPlaybackRequiresUserAction={orientationType === "landscape" ? mediaPlaybackRequiresUserAction : false}
            allowsFullscreenVideo={true}
            minimumFontSize={20}
            javaScriptEnabled={true}
        /> */}
            {webviewComponent}
        </View>
    )
}

export default CustomVideoPlayer
