import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Modal, ScrollView, BackHandler } from 'react-native'
import { WebView } from 'react-native-webview';
import { COLORS } from '../../../Constants/theme';
import CustomIconButton from '../../../Components/CustomIconButton';
import Header from '../../../Components/Header';
import axios from 'axios';
import PDFViewer from '../../../Components/PDFViewer';
import { useIsFocused } from '@react-navigation/native';
import VideoScreenLoader from '../../../Components/VideoScreenLoader';
import Pdf from 'react-native-pdf';
import { getURL } from "../../../baseUrl"
import NetInfo from "@react-native-community/netinfo";
import images from '../../../Constants/images';
import CustomAlert from '../../../Components/CustomAlert';
import RNFetchBlob from 'react-native-blob-util';
import moment from "moment"
import CustomToast from '../../../Components/CustomToast';
import AsyncStorage from '../../../node_modules/@react-native-async-storage/async-storage';
import { useSelector } from '../../../node_modules/react-redux';

const VideoDetailScreen = ({ navigation, route }) => {
    const webViewRef = useRef(null);
    const isFocused = useIsFocused();
    const [videoType, setVideoType] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [pdfView, setPdfView] = useState(false)
    const [viewPdf, setViewPdf] = useState(false)
    const [htmlContent, setHtmlContent] = useState(htmlContentPromo)
    const [orientation, setOrientation] = useState()
    const [viewAlert, setViewAlert] = useState({
        isShow: false,
        AlertType: ""
    })
    const [pdfURL, setPdfURL] = useState("")
    const [toastHide, setToastHide] = useState(false)
    const [message, setMessage] = useState({
        message: "Your Certificate is Downloading",
        icon: images.downloading_icon,
        isHide: false
    })
    const l_loginReducer = useSelector(state => state.loginReducer)
    const v_videoData = useSelector(state => state.videoDtlReducer)

    const backAction = () => {
        navigation.replace("Online_Home", { type: route.params.type })
        return true;
    };

    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    const CompletedDate = moment(v_videoData.videoData.CompletedDate, "DD MMM YYYY").format("YYYY-MM-DD")

    useEffect(() => {
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            setOrientation(
                isPortrait() ? 'portrait' : 'landscape'
            );
        });
    }, [orientation])

    function CheckConnectivity() {
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.fetch().then(xx => {
                if (xx.isConnected) {
                } else {
                    setViewAlert({
                        isShow: true,
                        AlertType: "Internet"
                    })
                }
            });
        }
    }

    useEffect(() => {
        if (isFocused) {
            CheckConnectivity()
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 1500);
            const dim = Dimensions.get('screen');
            if (dim.height >= dim.width) {
                setOrientation("protrait")
            } else {
                setOrientation("landscape")
            }
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            return () => {
                backHandler.remove();
                clearTimeout(timer)
            }
        }
    }, [])

    const onPromoViewVideoClick = () => {
        axios.get(`${getURL.base_URL}/AppVideo/UpdateVideoPreViewActivity?VideoId=${v_videoData.videoId}&username=${l_loginReducer.userData.EmployeeId}&password=${l_loginReducer.password}&CrewId=${l_loginReducer.userData.CrewListId}&VesselId=${l_loginReducer.userData.VesselId}`)
            .then((response) => { })
    }

    const onFullViewVideoClick = () => {
        axios.get(`${getURL.base_URL}/AppVideo/UpdateVideoViewActivity?VideoId=${v_videoData.videoId}&username=${l_loginReducer.userData.EmployeeId}&password=${l_loginReducer.password}&CrewId=${l_loginReducer.userData.CrewListId}&VesselId=${l_loginReducer.userData.VesselId}`)
            .then((response) => { })
    }

    const onClickPlayVideo = () => {
        axios.get(`${getURL.base_URL}/AppVideo/UpdateCrewActivity?VideoId=${v_videoData.videoId}&username=${l_loginReducer.userData.EmployeeId}&password=${l_loginReducer.password}&CrewId=${l_loginReducer.userData.CrewListId}&VesselId=${l_loginReducer.userData.VesselId}`)
            .then((response) => { })
    }

    const htmlContentPromo = `
    <html>
        <body>
            <div width="100%" height="auto" allowfullscreen="true">
                <iframe id="i_frame" class="spotlightr" allow="autoplay" src="${getURL.play_video_URL}/${v_videoData.videoData.videokeypromo}" frameborder="0" allowfullscreen="true" watch-type="" url-params="" height="100%" name="videoPlayerframe"  scrolling="no" width="100%" allowtransparency="true" />
            </div>
            <script src="https://videojs.cdn.spotlightr.com/assets/spotlightr.js"></script>
        </body>
    </html>
    `;

    const htmlContentFull = `
        <div width="100%" height="auto" allowfullscreen="true">
            <iframe allow="autoplay" src="${getURL.play_video_URL}/${v_videoData.videoData.videokey}" frameborder="0" allowfullscreen="true" watch-type="" url-params="" height="100%" name="videoPlayerframe"  scrolling="no" width="100%" allowtransparency="true" />
        </div>
    `;

    // const runSpotlightrAPI = () => {
    //     // Base64 decode the API key if needed
    //     const apiKey = 'MTMzNzIyMA==';
    //     // Call the spotlightrAPI function with the parameters
    //     const scriptToRun = `spotlightrAPI('${apiKey}', 'play');`;

    //     // Execute the script in the WebView
    //     if (webViewRef.current) {
    //         webViewRef.current.injectJavaScript(scriptToRun);
    //     }
    // };

    const togglePlayPause = () => {
        const apiKey = v_videoData.videoData.videokeypromo;
        const runFirst = `
            document.body.style.backgroundColor = 'red';
            // document.getElementById('i_frame').style.display = 'none';
            document.getElementById('i_frame').innerHTML=countNum();
            
            function countNum() {
                setTimeout(
                    function() { 
                        window.alert('hi');
                        spotlightrAPI('${apiKey}', 'play');
                    }, 1000);
            }
            true; // note: this is required, or you'll sometimes get silent failures
        `;
        webViewRef.current.injectJavaScript(runFirst)
    };

    const viewCertificate = async () => {
        CheckConnectivity()
        await axios.get(`https://testtrace.karco.in/api/AppAssessment/GetCertificatePathByCrewId?CompanyId=${l_loginReducer.userData.CompanyId}&EmpId=${l_loginReducer.userData.EmployeeId}&CrewId=${l_loginReducer.userData.CrewListId}&VesselId=${l_loginReducer.userData.VesselId}&VideoId=${v_videoData.videoId}&dateOn=${CompletedDate}`)
            .then((res) => {
                setPdfURL(res.data)
                setViewPdf(true)
                setIsLoading(false)
            })
    }

    const downloadCertificate = async () => {
        CheckConnectivity()
        await axios.get(`https://testtrace.karco.in/api/AppAssessment/GetCertificatePathByCrewId?CompanyId=${l_loginReducer.userData.CompanyId}&EmpId=${l_loginReducer.userData.EmployeeId}&CrewId=${l_loginReducer.userData.CrewListId}&VesselId=${l_loginReducer.userData.VesselId}&VideoId=${v_videoData.videoId}&dateOn=${CompletedDate}`)
            .then((res) => {
                setPdfURL(res.data)
                let dirs = RNFetchBlob.fs.dirs
                setToastHide(true)
                RNFetchBlob
                    .config({
                        fileCache: true,
                        path: dirs.DownloadDir + "/Documents" + `/${v_videoData.videoData.VideoName}_certificate.pdf`,
                        transform: true
                    })
                    .fetch('GET', `https://testtrace.karco.in/${res.data}`)
                    .then((res) => {
                        setIsLoading(false)
                        setToastHide(true)
                        setMessage({ message: "Your Certificate is Downloaded", icon: images.downloaded_icon, isHide: true })
                    })
            })
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <Header
                    titleStyle={{
                        fontSize: 16, fontWeight: "bold"
                    }}
                    leftComponent={
                        <TouchableOpacity
                            style={{ marginHorizontal: 12, justifyContent: "flex-start", padding: 6 }}
                            onPress={() => navigation.replace("Online_Home", { type: route.params.type })}
                        >
                            <Image source={images.left_arrow_icon} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    }
                    title={v_videoData.videoData.VideoName}
                />
                {isLoading &&
                    <VideoScreenLoader />
                }
                {!isLoading &&
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            contentInsetAdjustmentBehavior="automatic"
                        >
                            {v_videoData.videoData.ModuleType !== "Circular" && (videoType == "PROMOKEY" || videoType == "") &&
                                <View style={{ width: Dimensions.get('window').width, height: orientation === "landscape" ? 280 : 240 }}>
                                    <WebView
                                        ref={webViewRef}
                                        source={{ html: htmlContentPromo }}
                                        allowsFullscreenVideo={true}
                                        automaticallyAdjustContentInsets
                                        // mediaPlaybackRequiresUserAction={true}
                                        startInLoadingState={<ActivityIndicator />}
                                        minimumFontSize={12}
                                        injectJavaScript={true}
                                    // onLoad={runSpotlightrAPI}
                                    // injectedJavaScript={`
                                    //     function togglePlay() {
                                    //             vooAPI('MTMzNzIyMA==','play')
                                    //     }
                                    // `}
                                    />
                                </View>
                            }
                            {videoType == "FULLKEY" &&
                                <View style={{ width: Dimensions.get('screen').width, height: orientation === "landscape" ? 280 : 240 }}>
                                    <WebView
                                        source={{ html: htmlContentFull }}
                                        allowsFullscreenVideo={true}
                                        automaticallyAdjustContentInsets
                                        mediaPlaybackRequiresUserAction={true}
                                        startInLoadingState={<ActivityIndicator />}
                                        minimumFontSize={12}
                                    />
                                </View>
                            }

                            {v_videoData.videoData.ModuleType == "Circular" && (videoType == "PDF" || videoType == "") &&
                                <View style={{ width: Dimensions.get('screen').width, height: orientation === "landscape" ? 280 : 240 }}>
                                    <PDFViewer pdf={v_videoData.videoData.VideoPath} pageNo={1} />
                                </View>
                            }

                            <View style={{ margin: 20 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
                                    <Text style={{ fontSize: 20, width: 300, fontWeight: "bold", color: COLORS.darkBlue }}>{v_videoData.videoData.VideoName}</Text>
                                    {/* <View style={[styles.icon_container, styles.shadowProp]}><Image style={styles.icon} source={FavouriteIcon} /></View> */}
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        alignSelf: "flex-start",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginVertical: 10,
                                        borderRadius: 20,
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        // width: "50%",
                                        backgroundColor: `${v_videoData.videoData.Category === "OCIMF SIRE VIQ SERIES"
                                            ? "#FFC239" :
                                            v_videoData.videoData.Category === "SHIP SPECIFIC SERIES"
                                                ? "#29ABE2" :
                                                v_videoData.videoData.Category === "ACCIDENT / INCIDENT SERIES"
                                                    ? "#9E005D" :
                                                    v_videoData.videoData.Category === "PERSONAL SAFETY"
                                                        ? "#f75a24" :
                                                        v_videoData.videoData.Category === "SHIP BOARD OPERATION"
                                                            ? "#22B573" :
                                                            "red"
                                            }`
                                    }}>
                                    <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.white }} numberOfLines={1}>{v_videoData.videoData.Category}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 4 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                        <View style={{ borderRadius: 35, height: 30, width: 30, borderColor: COLORS.lightGray1, borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white2, marginRight: 6 }}>
                                            <Image style={{
                                                height: 16,
                                                width: 16,
                                            }} source={images.calendar_icon} />
                                        </View>
                                        <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.darkBlue }}>{v_videoData.videoData.CreatedDate}</Text>
                                    </View>

                                </View>
                                {/* {v_videoData.videoData.ModuleType != "Circular" && ( */}
                                <View style={{ fontSize: 12, flexDirection: "row", marginBottom: 10 }}>
                                    <Text style={{ color: COLORS.darkBlue, fontWeight: "600" }}>Description : </Text>
                                    <TouchableOpacity style={{ borderBottomWidth: 1, maxWidth: "100%", color: COLORS.blue }}
                                        onPress={() => {
                                            CheckConnectivity()
                                            setViewPdf(!viewPdf)
                                            // onSynopsisPress(`https://trace.karco.in/Uploads/Synopsis/${v_videoData.videoData.SynopsisPath}`)
                                        }}
                                    >
                                        <Text style={{ color: COLORS.blue }}>View Synopsis</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* )} */}
                                <View style={{ borderWidth: 1, borderColor: COLORS.darkBlue, width: "100%", marginVertical: 8 }}></View>
                                {v_videoData.videoData.ModuleType == "Circular"
                                    ?
                                    <CustomIconButton
                                        label={"View PDF"}
                                        icon={images.view_icon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            setViewPdf(!viewPdf)
                                            setVideoType("PDF")
                                            onFullViewVideoClick()
                                            onClickPlayVideo()
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.primary,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            marginVertical: 6,
                                            borderRadius: 5,
                                        }}
                                        iconStyle={{ marginRight: 6, tintColor: "white" }}
                                    />
                                    :
                                    <CustomIconButton
                                        label={(videoType == "" || videoType == "PROMOKEY") ? "View Full Video" : "View Promo Video"}
                                        icon={images.view_icon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            onClickPlayVideo()
                                            // spotlightrAPI('MTM1MjA5MA==', 'play')
                                            // togglePlayPause()
                                            if ((videoType === "PROMOKEY") || (videoType === "")) {
                                                setHtmlContent(htmlContentFull)
                                                setVideoType("FULLKEY")
                                                onFullViewVideoClick()
                                            } else {
                                                setHtmlContent(htmlContentPromo)
                                                setVideoType("PROMOKEY")
                                                onPromoViewVideoClick()
                                            }
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.primary,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            marginVertical: 6,
                                            borderRadius: 5,
                                        }}
                                        iconStyle={{ marginRight: 6, tintColor: "white" }}
                                    />
                                }

                                {v_videoData.videoData.AssessmentStatus == "Pending" &&
                                    <CustomIconButton
                                        label={"Take Assessment"}
                                        icon={images.assessment_icon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            if (v_videoData.videoData.HavingAssessment == "Y" && videoType != "") {
                                                navigation.replace("AssessmentNew", { Id: v_videoData.videoId, videoPassword: v_videoData.videoData.Password, ModuleType: v_videoData.videoData.ModuleType })
                                            } else {
                                                if (v_videoData.videoData.HavingAssessment !== "Y") {
                                                    alert(`The ${v_videoData.videoData.ModuleType === "Video" ? "video" : "content"} does not have an Assessment`)
                                                } else {
                                                    alert(`Please First ${v_videoData.videoData.ModuleType == "Circular" ? "View Circular" : "Play Full Video"}`)
                                                }
                                            }
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.darkBlue,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            marginVertical: 6,
                                            borderRadius: 5,
                                        }}
                                        iconStyle={{ marginRight: 6 }}
                                    />
                                }

                                {v_videoData.videoData.AssessmentStatus == "Continue" &&
                                    <CustomIconButton
                                        label={"Continue Assessment"}
                                        icon={images.assessment_icon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            navigation.replace("AssessmentNew", { Id: v_videoData.videoId, videoPassword: v_videoData.videoData.Password, ModuleType: v_videoData.videoData.ModuleType })
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.darkBlue,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            borderRadius: 5,
                                        }}
                                        iconStyle={{ marginRight: 6 }}
                                    />
                                }

                                {v_videoData.videoData.AssessmentStatus == "Feedback" &&
                                    <CustomIconButton
                                        label={"Give Feedback"}
                                        icon={images.assessment_icon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            navigation.replace("Feedback Form", { Id: v_videoData.videoId, videoPassword: v_videoData.videoData.Password })
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.darkBlue,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            borderRadius: 5,
                                        }}
                                        iconStyle={{ marginRight: 6 }}
                                    />
                                }

                                {v_videoData.videoData.AssessmentStatus == "Completed" &&
                                    <CustomIconButton
                                        label={"View Certificate"}
                                        icon={images.view_icon}
                                        onPress={() => {
                                            setIsLoading(true)
                                            CheckConnectivity()
                                            viewCertificate()
                                            // setViewPdf(true)
                                            setPdfView(true)
                                            // navigation.replace("Feedback Form", { Id: v_videoData.videoId, videoPassword: v_videoData.videoData.Password })
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.darkBlue,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            borderRadius: 5,
                                            marginVertical: 6,
                                        }}
                                        iconStyle={{ marginRight: 6, tintColor: "white" }}
                                    />
                                }

                                {v_videoData.videoData.AssessmentStatus == "Completed" &&
                                    <CustomIconButton
                                        label={"Download Certificate"}
                                        icon={images.downloading_icon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            downloadCertificate()
                                            // navigation.replace("Feedback Form", { Id: v_videoData.videoId, videoPassword: v_videoData.videoData.Password })
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.darkBlue,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            borderRadius: 5,
                                            marginVertical: 6,
                                        }}
                                        iconStyle={{ marginRight: 6 }}
                                    />
                                }
                            </View>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={viewPdf}
                                onRequestClose={() => {
                                    setViewPdf(false)
                                }}>
                                <View
                                    style={{
                                        width: "100%",
                                        height: '100%',
                                        marginTop: 'auto',
                                        backgroundColor: COLORS.white2,
                                    }}>
                                    <View style={{ justifyContent: "flex-end", position: "absolute", top: 16, left: 16, zIndex: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setViewPdf(false)
                                                setPdfView(false)
                                            }}>
                                            <Image source={images.close_icon} style={{ width: 20, height: 20 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <Pdf
                                        enablePaging={true}
                                        scale={1.0}
                                        minScale={1.0}
                                        trustAllCerts={false}
                                        source={{
                                            uri: `${(v_videoData.videoData.ModuleType === "Circular" && pdfView === false) ? `${getURL.view_PDF_URL}/${v_videoData.videoData.VideoPath}`
                                                : (v_videoData.videoData.ModuleType === "Video" && pdfView === false) ? `${getURL.view_Synopsis_URL}/${v_videoData.videoData.SynopsisPath}`
                                                    : pdfView === true ? `https://testtrace.karco.in/${pdfURL}` : ""}`
                                        }}
                                        style={[styles.pdf, { position: "relative" }]}
                                        onError={(error) => {
                                            setViewAlert({
                                                isShow: true,
                                                AlertType: "PDF"
                                            })
                                        }}
                                        renderActivityIndicator={() =>
                                            <ActivityIndicator color={COLORS.blue} size={"large"} />
                                        }
                                    />
                                </View>
                            </Modal>
                            {viewAlert.isShow && (
                                <CustomAlert
                                    isView={viewAlert.isShow}
                                    Title="Oops !!"
                                    Content={viewAlert.AlertType === "Internet" ?
                                        "Your Device is not Connected to Internet, Please Check your Internet Connectivity"
                                        : "File is not View able or corrupted"}
                                    buttonContainerStyle={{
                                        flexDirection: "row",
                                        justifyContent: "flex-end"
                                    }}
                                    ButtonsToShow={[
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                if (viewAlert.AlertType === "Internet") {
                                                    navigation.reset({
                                                        index: 0,
                                                        routes: [{ name: "Home" }],
                                                    })
                                                } else {
                                                    setViewPdf(false)
                                                }
                                                setViewAlert({
                                                    isShow: false,
                                                    AlertType: ""
                                                })
                                            },
                                            toShow: true,
                                        },
                                    ]}
                                />
                            )}

                        </ScrollView>
                    </View>
                }
            </ScrollView>
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
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        height: 20,
        width: 20,
        padding: 4,
    },
    icon_container: {
        borderRadius: 35,
        height: 35,
        width: 35,
        borderColor: COLORS.lightGray1,
        borderWidth: 1,

        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white2,
    },
    shadowProp: {
        shadowColor: COLORS.white2,
        shadowOffset: { width: -4, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
    }
})

export default VideoDetailScreen
