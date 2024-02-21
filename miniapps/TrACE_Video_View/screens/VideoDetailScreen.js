import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, Image, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native'
import { COLORS } from '../../../Constants/theme';
import CustomIconButton from '../../../Components/CustomIconButton';
import axios from 'axios';
import moment from "moment"
import RNFetchBlob from 'react-native-blob-util';
import Header from '../../../Components/Header';
import { openSettings, checkMultiple, PERMISSIONS, check } from 'react-native-permissions';
import ReactNativeBlobUtil from 'react-native-blob-util'
import CustomToast from '../../../Components/CustomToast';
import NetInfo from "@react-native-community/netinfo";
import NoInternetComponent from '../../../Components/NoInternetComponent';
import { getURL } from "../../../baseUrl"
import { setDownloaded } from '../../../Utils/getScreenVisisted';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../../../Constants/images';
import CustomAlert from '../../../Components/CustomAlert';
import CustomVideoPlayer from '../../../Components/CustomVideoPlayer';

const VideoDetailScreen = ({ navigation, route }) => {
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
    const [viewAlert, setViewAlert] = useState({
        isShow: false,
        AlertType: ""
    })

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
            }
        }
    };

    const docPath = ReactNativeBlobUtil.fs.dirs.DownloadDir;
    const getDirectoryList = async () => {
        await ReactNativeBlobUtil.fs
            .lstat(docPath)
            .then(response => {
                setDirectory(response);
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        getDirectoryList();
        const dim = Dimensions.get('screen');
        if (dim.height >= dim.width) {
            setOrientation("protrait")
        } else {
            setOrientation("landscape")
        }
        if (route.params.type === "Downloads") {
            RNFetchBlob.fs.readStream(route.params.data.path, 'utf8')
            RNFetchBlob.fs.readStream(route.params.data.path)
                .then((stream) => {
                    setFileContent(stream.path);
                });
        }
        if (route.params.type !== "Downloads") {
            CheckConnectivity()
            axios.get(`${getURL.VideoView_baseURL}?vooKey=${getURL.vooKey}&videoID=${route.params}`)

                .then((res) => {
                    setVideoDetail(res.data.videos.data[0])
                    setIsLoading(false)
                })
        }
    }, [])

    const downloadFile = async () => {
        const OsVer = Platform.constants['Release'];
        CheckConnectivity()
        // let fileExpired = directory.filter((xx) => (xx.filename).slice(0, -4) === videoDetail.name && (moment.utc(moment.unix(xx.lastModified / 1000).format("YYYYMMDD")).local().startOf('hours').fromNow() <= "2 days")).length === 0
        let fileDownloaded = directory.filter((xx) => (xx.filename).slice(0, -4) === videoDetail.name).length > 0
        if (fileDownloaded === false) {
            if (OsVer > 12) {
                check(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO)
                    .then((result) => {
                        console.log(result);
                        if (result === "granted") {
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
                            setViewAlert({
                                isShow: true,
                                AlertType: "Permissions"
                            })
                        }
                    });
            } else {
                checkMultiple(
                    [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE])
                    .then((statuses) => {
                        console.log(statuses);
                        if (statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === "denied" || statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === "denied") {
                            setViewAlert({
                                isShow: true,
                                AlertType: "Permissions"
                            })
                        } else {
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
                        }
                    });
            }
        } else {
            setViewAlert(true)
        }
    }

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
                                style={{ justifyContent: "flex-start", padding: 6, marginHorizontal: 12 }}
                                onPress={() =>
                                    navigation.goBack()
                                }
                            >
                                <Image source={images.left_arrow_icon} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>
                        }
                        title={route.params.type !== "Downloads" ? (videoDetail && ((videoDetail.name).slice(0, -4)).replace(/[^a-zA-Z0-9 ]+/g, " ")) : ((route.params.data.filename).slice(0, -8)).replace(/[^a-zA-Z0-9 ]+/g, " ")}
                    />

                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        <CustomVideoPlayer
                            contentType={route.params.type}
                            orientationType={orientation}
                            url={route.params.type !== "Downloads" ? videoDetail && videoDetail.originalFileURL : fileContent}
                            mediaPlaybackRequiresUserAction={route.params.type === "Downloads" ? false : true}
                            posterUrl={videoDetail && videoDetail.thumbnail}
                            sharedCookiesEnabled={true}
                        />
                        <View style={{ margin: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ fontSize: 20, width: 300, fontWeight: "bold", color: COLORS.darkBlue }}>
                                    {route.params.type !== "Downloads" ? (videoDetail && ((videoDetail.name).slice(0, -4)).replace(/[^a-zA-Z0-9 ]+/g, " ")) : ((route.params.data.filename).slice(0, -8)).replace(/[^a-zA-Z0-9 ]+/g, " ")}
                                </Text>
                            </View>
                            {route.params.type !== "Downloads" &&
                                <>
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
                    {viewAlert.isShow && (
                        <CustomAlert
                            isView={viewAlert.isShow}
                            Title="Warning!"
                            Content={viewAlert.AlertType !== "Permissions" ? "This Video is already downloaded to view downloaded video go to Downloads."
                                : "Video can't be downloaded, allow permissions to access photos and media on your device"}
                            ButtonsToShow={[
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        setViewAlert({
                                            isShow: false,
                                            AlertType: ""
                                        })
                                    },
                                    toShow: viewAlert.AlertType !== "Permissions" ? true : false,
                                },
                                {
                                    text: 'GO TO SETTINGS',
                                    onPress: () => {
                                        openSettings().catch(() => console.warn('cannot open settings'));
                                        setViewAlert({
                                            isShow: false,
                                            AlertType: ""
                                        })
                                    },
                                    toShow: viewAlert.AlertType === "Permissions" ? true : false,
                                }
                            ]}
                        />
                    )}
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
