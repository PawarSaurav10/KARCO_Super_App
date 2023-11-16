import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, Image, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';
import { COLORS } from '../../../Constants/theme';
import CalendarIcon from "../../../Images/calendar.png"
import CustomIconButton from '../../../Components/CustomIconButton';
import ViewIcon from "../../../Images/show.png"
import axios from 'axios';
import moment from "moment"
import RNFetchBlob from 'react-native-blob-util';
import Header from '../../../Components/Header';
import BackIcon from "../../../Images/left-arrow.png"
import { PERMISSIONS, check, request, RESULTS, requestMultiple } from 'react-native-permissions';
import ReactNativeBlobUtil from 'react-native-blob-util'
import CustomToast from '../../../Components/CustomToast';
import { useIsFocused } from '../../../node_modules/@react-navigation/core';
import NetInfo from "@react-native-community/netinfo";
import NoInternetComponent from '../../../Components/NoInternetComponent';
import DownloadingIcon from "../../../Images/downloading.png"
import DownloadedIcon from "../../../Images/checkmark.png"
import { getURL } from "../../../baseUrl"
import { setDownloaded } from '../../../Utils/getScreenVisisted';

const VideoDetailScreen = ({ navigation, route }) => {
    const isFocused = useIsFocused()
    const [videoDetail, setVideoDetail] = useState(null)
    const [fileContent, setFileContent] = useState(null)
    const [toastHide, setToastHide] = useState(false)
    const [message, setMessage] = useState({
        message: "Your Video is Downloading",
        icon: DownloadingIcon,
        isHide: false
    })
    const [directory, setDirectory] = useState([]);
    const [isView, setIsView] = useState(route.params.type === "Downloads" ? false : true)
    const [isLoading, setIsLoading] = useState(route.params.type === "Downloads" ? false : true)


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
                .then((statuses) => console.log(statuses))
                .catch((error) => console.log(error));
            axios.get(`${getURL.VideoView_baseURL}?vooKey=${getURL.vooKey}&videoID=${route.params}`)
                .then((res) => {
                    setVideoDetail(res.data.videos.data[0])
                    setIsLoading(false)
                })
        }
    }, [route.params.type !== "Downloads", isFocused])

    useEffect(() => {
        if (route.params.type === "Downloads") {
            // CheckConnectivity()
            RNFetchBlob.fs.stat(route.params.data.path)
                .then((stats) => { console.log(stats, "stats") })
                .catch((err) => { })
            // RNFetchBlob.fs.readFile(route.params.data.path, 'utf8')
            //     .then((data) => {
            //         console.log(data,"data")
            //         // handle the data ..
            //     })
            RNFetchBlob.fs.readStream(route.params.data.path, 'utf8')
                .then((stream) => {
                    // console.log(stream,"sad")
                    setFileContent(stream.path);
                    let data = ''
                    stream.open()
                    stream.onData((chunk) => {
                        data += chunk
                    })
                    stream.onEnd(() => { })
                });
        }
    }, [route.params.type === "Downloads"]);

    useEffect(() => {
        if (isFocused) {
            CheckConnectivity()
            const docPath = ReactNativeBlobUtil.fs.dirs.DownloadDir;
            const getDirectoryList = async () => {
                await ReactNativeBlobUtil.fs
                    .lstat(docPath)
                    .then(response => {
                        console.log(response, "response")
                        setDirectory(response);
                    })
                    .catch(error => console.error(error));
            };
            getDirectoryList();
        }
    }, []);

    const downloadFile = async () => {
        CheckConnectivity()
        let fileExpired = directory.filter((xx) => (xx.filename).slice(0, -4) === videoDetail.name && (moment.utc(moment.unix(xx.lastModified / 1000).format("YYYYMMDD")).local().startOf('hours').fromNow() <= "2 days")).length === 0
        let fileDownloaded = directory.filter((xx) => (xx.filename).slice(0, -4) === videoDetail.name).length > 0
        if (fileExpired) {
            console.log("true")
            setToastHide(true)
            let dirs = RNFetchBlob.fs.dirs
            RNFetchBlob
                .config({
                    fileCache: true,
                    path: dirs.DownloadDir + `/${videoDetail.name}.bin`,
                    transform: true
                })
                .fetch('GET', `${videoDetail.originalFileURL}`)
                // .progress((received, total) => {
                //     console.log('progress', received / total)
                // })
                .then((res) => {
                    console.log(res, "download res")
                    setDownloaded("Yes")
                    setToastHide(true)
                    setMessage({ message: "Your Video is Downloaded", icon: DownloadedIcon, isHide: true })
                })
        } else {
            console.log("false")
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
                    // .progress((received, total) => {
                    //     console.log('progress', received / total)
                    // })
                    .then((res) => {
                        console.log(res, "download res")
                        setDownloaded("Yes")
                        setToastHide(true)
                        setMessage({ message: "Your Video is Downloaded", icon: DownloadedIcon, isHide: true })
                    })
            } else {
                Alert.alert('Warning', 'This Video is already downloaded to view downloaded video go to Downloads.', [
                    { text: 'OK', onPress: () => console.log("object") },
                ]);
            }
        }

    }

    const htmlContent = `
            <video width="100%" height="100%" controls controlsList="nodownload" preload="auto">
                <source src="${videoDetail && videoDetail.originalFileURL}" type="video/mp4">
            </video>
      `;

    const htmlDownloadContent = `
            <video width="100%" height="100%" controls controlsList="nodownload" preload="auto" autoplay>
                <source src="file://${fileContent}" type="video/mp4">
            </video>
      `;

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
                                <Image source={BackIcon} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>
                        }
                        title={route.params.type !== "Downloads" ? (videoDetail && videoDetail.name) : (route.params.data.filename).slice(0, -4)}
                    />
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                    >
                        <View style={{ width: Dimensions.get('screen').width, height: 220 }}>
                            <WebView allowFileAccess={true} source={{ html: route.params.type !== "Downloads" ? htmlContent : htmlDownloadContent }} mediaPlaybackRequiresUserAction={route.params.type === "Downloads" ? false : true} allowsFullscreenVideo={true} minimumFontSize={30} />
                        </View>
                        <View style={{ margin: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ fontSize: 20, width: 300, fontWeight: "bold", color: COLORS.darkBlue }}>
                                    {route.params.type !== "Downloads" ? (videoDetail && videoDetail.name) : (route.params.data.filename).slice(0, -4)}
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
                                            }} source={CalendarIcon} />
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
                                        icon={ViewIcon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            downloadFile()
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.blue,
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
                    onHide={() => {
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
