import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, Image, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator, StyleSheet, Button } from 'react-native'
import { WebView } from 'react-native-webview';
import { COLORS } from '../../../Constants/theme';
import CustomIconButton from '../../../Components/CustomIconButton';
import axios from 'axios';
import moment from "moment"
import RNFetchBlob from 'react-native-blob-util';
import Header from '../../../Components/Header';
import { PERMISSIONS, check, request, RESULTS, requestMultiple } from 'react-native-permissions';
import ReactNativeBlobUtil from 'react-native-blob-util'
import CustomToast from '../../../Components/CustomToast';
import { useIsFocused } from '../../../node_modules/@react-navigation/core';
import NetInfo from "@react-native-community/netinfo";
import NoInternetComponent from '../../../Components/NoInternetComponent';
import { getURL } from "../../../baseUrl"
import { setDownloaded } from '../../../Utils/getScreenVisisted';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../../../Constants/images';

const VideoDetailScreen = ({ navigation, route }) => {
    const isFocused = useIsFocused()
    const [videoDetail, setVideoDetail] = useState(null)
    const [fileContent, setFileContent] = useState(null)
    const [toastHide, setToastHide] = useState(false)
    const [message, setMessage] = useState({
        message: "Your Video is Downloading",
        icon: images.downloading_icon,
        isHide: false
    })
    const [directory, setDirectory] = useState([]);
    const [isView, setIsView] = useState(route.params.type === "Downloads" ? false : true)
    const [isLoading, setIsLoading] = useState(route.params.type === "Downloads" ? false : true)
    const [orientation, setOrientation] = useState()

    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    useEffect(() => {
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            setOrientation(
                isPortrait() ? 'portrait' : 'landscape'
            );
        });
    }, [orientation])

    function CheckConnectivity() {
        setIsLoading(false)
        // For Android devices
        if (route.params.type !== "Downloads") {
            if (Platform.OS === "android") {
                NetInfo.fetch().then(xx => {
                    if (xx.isConnected) {
                        setIsView(false)
                        // Alert.alert("You are online!");
                    } else {
                        setIsView(true)
                    }
                });
            } else {
                // For iOS devices
                NetInfo.isConnected.addEventListener(
                    "connectionChange",
                    this.handleFirstConnectivityChange
                );
            }
        }
    };

    handleFirstConnectivityChange = isConnected => {
        NetInfo.isConnected.removeEventListener(
            "connectionChange",
            this.handleFirstConnectivityChange
        );
        if (route.params.type !== "Downloads") {
            if (isConnected === false) {
                setIsView(true)
            } else {
                setIsView(false)
                Alert.alert("You are online!");
            }
        }
    };

    useEffect(() => {
        if (isFocused) {
            CheckConnectivity()
            requestMultiple([
                PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            ])
            axios.get(`${getURL.VideoView_baseURL}?vooKey=${getURL.vooKey}&videoID=${route.params}`)
                .then((res) => {
                    setVideoDetail(res.data.videos.data[0])
                    setIsLoading(false)
                })
        }
    }, [route.params.type !== "Downloads", isFocused])

    useEffect(() => {
        if (route.params.type === "Downloads") {
            CheckConnectivity()
            RNFetchBlob.fs.stat(route.params.data.path)
            RNFetchBlob.fs.readStream(route.params.data.path, 'utf8')
                .then((stream) => {
                    setFileContent(stream.path);
                });
        }
    }, [route.params.type === "Downloads"]);

    useEffect(() => {
        if (isFocused) {
            CheckConnectivity()
            const dim = Dimensions.get('screen');
            if (dim.height >= dim.width) {
                setOrientation("protrait")
            } else {
                setOrientation("landscape")
            }
            const docPath = ReactNativeBlobUtil.fs.dirs.DownloadDir;
            const getDirectoryList = async () => {
                await ReactNativeBlobUtil.fs
                    .lstat(docPath)
                    .then(response => {
                        setDirectory(response);
                    })
                    .catch(error => console.error(error));
            };
            getDirectoryList();
        }
    }, []);

    const downloadFile = async () => {
        CheckConnectivity()
        // let fileExpired = directory.filter((xx) => (xx.filename).slice(0, -4) === videoDetail.name && (moment.utc(moment.unix(xx.lastModified / 1000).format("YYYYMMDD")).local().startOf('hours').fromNow() <= "2 days")).length === 0
        let fileDownloaded = directory.filter((xx) => (xx.filename).slice(0, -4) === videoDetail.name).length > 0
        if (fileDownloaded === false) {
            setToastHide(true)
            let dirs = RNFetchBlob.fs.dirs
            RNFetchBlob
                .config({
                    fileCache: true,
                    path: dirs.DownloadDir + `/${videoDetail.name}.bin`,
                    transform: true
                })
                .fetch('GET', `${videoDetail.originalFileURL}`)
                .then((res) => {
                    setDownloaded("Yes")
                    setToastHide(true)
                    setMessage({ message: "Your Video is Downloaded", icon: images.downloaded_icon, isHide: true })
                })
        } else {
            Alert.alert('Warning', 'This Video is already downloaded to view downloaded video go to Downloads.', [
                { text: 'OK', onPress: () => { } },
            ]);
        }
    }

    const htmlStyles = `
    <style>
    .video-js{
        width: 100% !important;
        height: 100% !important;
        background: #004C6B;
    }
    //   .container:hover .controls,
    //   .container:focus-within .controls {
    //     display: flex;
    //   }
    // .container {
    //     position: relative;
    //     display: flex;
    //     width:100%;
    //     height: 100%;
    //     justify-content: center;
    //     align-items: center;
    // }
    // .container #video {
    //     width: 100%;
    //     height: 100%;
    //     border-radius: 0px;
    // }
    // .container .controls {
    //     padding: 10px;
    //     position: absolute;
    //     bottom: 0px;
    //     width: 100%;
    //     display: flex;
    //     justify-content: space-around;
    //     opacity: 1;
    //     background: #004C6B;
    //     transition: opacity 0.4s;
    // }

    // .container .controls button {
    //     background: transparent;
    //     color: #fff;
    //     font-weight: bolder;
    //     text-shadow: 2px 1px 2px #000;
    //     border: none;
    //     cursor: pointer;
    // }
    // .container .controls .timeline {
    //     flex: 1;
    //     display: flex;
    //     align-items: center;
    //     border: none;
    //     // border-right: 3px solid #ccc;
    //     // border-left: 3px solid #ccc;
    // }
    // .container .controls .timeline .bar{
    //     background: rgb(1, 1, 65);
    //     height: 10px;
    //     width: 100%;
    //     // flex: 1;
    // }
    // .container .controls .timeline .bar .inner{
    //     background: #ccc;
    //     width: 0%;
    //     height: 100%;
    // }
    // .fa {
    //     font-size: 28px !important;
    // }

    .vjs-matrix.video-js .vjs-big-play-button {
        position: absolute; 
        left: 0; 
        right: 0; 
        margin-left: auto; 
        margin-right: auto; 
        width: ${orientation === "landscape" ? "60px" : "80px"}; /* Need a specific value to work */
        height: ${orientation === "landscape" ? "60px" : "80px"};
        background-color: #004C6B !important;
        border-color: #004C6B;
        border-radius: ${orientation === "landscape" ? "60px" : "80px"};
    }
    
    .vjs-matrix.video-js {
        color: white;
        font-size:  ${orientation === "landscape" ? "12px" : "18px"} !important;
        text-align: "center"
    }

    .vjs-matrix.video-js .vjs-control-bar{
        position: absolute;
        bottom: 0;
        background-color: #004C6B;
        height: ${orientation === "landscape" ? "50px" : "72px"};
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
                class="vjs-matrix vjs-default-skin video-js "
                controls
                width="960"
                height="264"
                poster="${videoDetail && videoDetail.thumbnail}"
                data-setup='{"playbackRates": [0.5, 1, 1.5, 2],"fill": true, "responsive": true}'>
                    <source src="${videoDetail && videoDetail.originalFileURL}"  type="video/mp4">
                </video>
            </div>
            <script src="https://vjs.zencdn.net/8.6.1/video.min.js"></script>
        </body> 
     </html>`

    // const htmlContent = `
    // <html>
    // <head>
    //     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    // </head>
    // <body>
    //     <div class="container">
    //         <video onclick="play()" src="${videoDetail && videoDetail.originalFileURL}" id="video" poster="${videoDetail && videoDetail.thumbnail}"></video>
    //         <div class="controls">
    //             <button onclick="play()"><i id="fa-play" class="fa fa-play"></i></button>
    //             <button onclick="play()"><i id="fa-pause" class="fa fa-pause"></i></button>
    //             <button onclick="rewind()"><i class="fa fa-fast-backward"></i></button>
    //             <div class="timeline">
    //                 <div class="bar">
    //                     <div class="inner"></div>
    //                 </div>
    //             </div>
    //             <button onclick="forward(event)"><i class="fa fa-fast-forward"></i></button>
    //             <button onclick="fullScreen(event)"><i class="fa fa-expand"></i></button>
    //             <button onclick="download(event)"><i class="fa fa-cloud-download"></i></button>
    //         </div>
    //     </div>
    //     <script>

    // </script> 
    // </body>
    // </html>   
    // `

    // const htmlContent = `
    //         <video width="100%" height="100%" controls controlsList="nodownload" preload="auto" poster="${videoDetail && videoDetail.thumbnail}" style="background-color: #000;">
    //             <source src="${videoDetail && videoDetail.originalFileURL}" type="video/mp4">
    //         </video>
    //   `;

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
                    <source src="file://${fileContent}"  type="video/mp4">
                </video>
            </div>
            <script src="https://vjs.zencdn.net/8.6.1/video.min.js"></script>
        </body> 
     </html>
      `;

    let rawhtml = htmlStyles + htmlContent
    let rawhtmlContent = htmlStyles + htmlDownloadContent

    return (
        <View style={{ flex: 1 }}>
            {isLoading &&
                <ActivityIndicator
                    style={{ flex: 1 }}
                    size="large"
                    color={COLORS.primary}
                />
            }
            {!isLoading && !isView &&
                <>
                    <Header
                        titleStyle={{
                            fontSize: 16, fontWeight: "bold"
                        }}
                        leftComponent={
                            <TouchableOpacity
                                style={{ marginHorizontal: 12, justifyContent: "flex-start" }}
                                onPress={() => navigation.replace(route.params.type !== "Downloads" ? "Video_Home" : "Downloads")}
                            >
                                <Image source={images.left_arrow_icon} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>
                        }
                        title={route.params.type !== "Downloads" ? (videoDetail && ((videoDetail.name).slice(0, -4)).replace(/[^a-zA-Z0-9 ]+/g, " ")) : (route.params.data.filename).slice(0, -4)}
                    />
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                    >
                        <View style={{ width: Dimensions.get('screen').width, height: 240 }}>
                            <WebView
                                ref={(ref) => (webViewRef = ref)}
                                allowFileAccess={true}
                                source={{ html: route.params.type !== "Downloads" ? rawhtml : rawhtmlContent }}
                                mediaPlaybackRequiresUserAction={route.params.type === "Downloads" ? false : true}
                                allowsFullscreenVideo={true}
                                minimumFontSize={orientation === "landscape" ? 16 : 30}
                                scalesPageToFit={(Platform.OS === 'ios') ? false : true}
                                // injectedJavaScript={
                                //     runjsscript
                                // }
                                javaScriptEnabled={true}
                            />
                        </View>
                        <View style={{ margin: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ fontSize: 20, width: 300, fontWeight: "bold", color: COLORS.darkBlue }}>
                                    {route.params.type !== "Downloads" ? (videoDetail && ((videoDetail.name).slice(0, -4)).replace(/[^a-zA-Z0-9 ]+/g, " ")) : (route.params.data.filename).slice(0, -4)}
                                </Text>
                                {/* <View style={[styles.icon_container, styles.shadowProp]}><Image style={styles.icon} source={FavouriteIcon} /></View> */}
                            </View>
                            {route.params.type !== "Downloads" &&
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 4 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                                        <View style={{ borderRadius: 35, height: 30, width: 30, borderColor: COLORS.lightGray1, borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white2, marginRight: 6 }}>
                                            <Image style={{
                                                height: 16,
                                                width: 16,
                                            }} source={images.calendar_icon} />
                                        </View>
                                        <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.darkBlue }}>{moment(videoDetail && videoDetail.created).format("DD MMM YYYY")}</Text>
                                    </View>
                                </View>
                            }

                            {route.params.type !== "Downloads" &&
                                <>
                                    <View style={{ borderWidth: 1, borderColor: COLORS.darkBlue, width: "100%", marginVertical: 8 }}></View>
                                    <CustomIconButton
                                        label={"Download"}
                                        icon={images.downloading_icon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            downloadFile()
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.primary,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            marginVertical: 6,
                                            borderRadius: 5,
                                        }}
                                        iconStyle={{ marginRight: 6 }}
                                    />
                                </>
                            }
                        </View>
                    </ScrollView>
                </>
            }

            {toastHide === true &&
                <CustomToast
                    icon={message.icon}
                    iconStyle={{
                        tintColor: COLORS.white,
                        marginRight: 10,
                    }}
                    containerStyle={{
                        backgroundColor: COLORS.primary,
                    }}
                    labelStyle={{
                        color: COLORS.white,
                        fontWeight: "bold",
                    }}
                    message={message.message}
                    onHide={async () => {
                        await AsyncStorage.removeItem("downloaded")
                        setToastHide(!toastHide)
                    }}
                    ViewPoint={-20}
                />
            }

            {isView === true && (
                <NoInternetComponent />
            )}
        </View>
    )
}

export default VideoDetailScreen
