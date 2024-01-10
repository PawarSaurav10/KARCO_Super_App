import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView, BackHandler, PermissionsAndroid } from 'react-native'
import { WebView } from 'react-native-webview';
import { COLORS } from '../../../Constants/theme';
import CustomIconButton from '../../../Components/CustomIconButton';
import Header from '../../../Components/Header';
import axios from 'axios';
import { getUserData, getUserData_1, getAppLaunched, setAppLaunched } from '../../../Utils/getScreenVisisted';
import PDFViewer from '../../../Components/PDFViewer';
import { useIsFocused } from '@react-navigation/native';
import VideoScreenLoader from '../../../Components/VideoScreenLoader';
import Pdf from 'react-native-pdf';
import { getURL } from "../../../baseUrl"
import NetInfo from "@react-native-community/netinfo";
import images from '../../../Constants/images';

const VideoDetailScreen = ({ navigation, route }) => {
    const htmlContentPromo = `
            <div width="100%" height="auto" allowFullScreen = "true">
                <iframe id="iframe" src="${getURL.play_video_URL}/${route.params.item.videokeypromo}" frameborder="0" allowFullscreen="true"  width="100%" height="100%" allowtransparency="true" onload="displayMessage()"/>
            </div>
    `;
    const htmlContentFull = `
        <div width="100%" height="auto" allowfullscreen="true">
            <iframe src="${getURL.play_video_URL}/${route.params.item.videokey}" frameborder="0" allowfullscreen="true" watch-type="" url-params="" height="100%" name="videoPlayerframe"  scrolling="no" width="100%" allowtransparency="true" />
        </div>
      `;
    const isFocused = useIsFocused();
    const [videoType, setVideoType] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [userLoginData, setUserLoginData] = useState({
        userId: null,
        password: null,
        crewId: null,
        vesselId: null,
    })
    const [viewPdf, setViewPdf] = useState(false)
    const [htmlContent, setHtmlContent] = useState(htmlContentPromo)
    const [orientation, setOrientation] = useState()

    const backAction = () => {
        navigation.replace("Online_Home", { type: route.params.type })
        return true;
    };

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

    const CheckConnectivity = () => {
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.fetch().then(xx => {
                if (xx.isConnected) {
                    // Alert.alert("You are online!");
                } else {
                    Alert.alert('Oops !!', 'Your Device is not Connected to Internet, Please Check your Internet Connectivity', [
                        {
                            text: 'OK', onPress: () =>
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: "Home" }],
                                })
                        },
                    ]);
                }
            });
        }
    }

    useEffect(() => {
        if (isFocused) {
            const dim = Dimensions.get('screen');
            if (dim.height >= dim.width) {
                setOrientation("protrait")
            } else {
                setOrientation("landscape")
            }
            // CheckConnectivity()
            getUserData_1().then((res) => {
                setUserLoginData({
                    userId: res.userData.EmployeeId,
                    password: res.userPassword,
                    crewId: res.userData.CrewListId,
                    vesselId: res.userData.VesselId,
                })
            });
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            return () => backHandler.remove();
        }
    }, [isFocused])

    useEffect(() => {
        CheckConnectivity()
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const onPromoViewVideoClick = () => {
        axios.get(`${getURL.base_URL}/AppVideo/UpdateVideoPreViewActivity?VideoId=${route.params.item.Id}&username=${userLoginData.userId}&password=${userLoginData.password}&CrewId=${userLoginData.crewId}&VesselId=${userLoginData.vesselId}`)
            .then((response) => { })
    }

    const onFullViewVideoClick = () => {
        axios.get(`${getURL.base_URL}/AppVideo/UpdateVideoViewActivity?VideoId=${route.params.item.Id}&username=${userLoginData.userId}&password=${userLoginData.password}&CrewId=${userLoginData.crewId}&VesselId=${userLoginData.vesselId}`)
            .then((response) => { })
    }

    const onClickPlayVideo = () => {
        axios.get(`${getURL.base_URL}/AppVideo/UpdateCrewActivity?VideoId=${route.params.item.Id}&username=${userLoginData.userId}&password=${userLoginData.password}&CrewId=${userLoginData.crewId}&VesselId=${userLoginData.vesselId}`)
            .then((response) => { })
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
                            style={{ marginHorizontal: 12, justifyContent: "flex-start" }}
                            onPress={() => navigation.replace("Online_Home", { type: route.params.type })}
                        >
                            <Image source={images.left_arrow_icon} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    }
                    title={route.params.item.VideoName}
                />
                {isLoading &&
                    <VideoScreenLoader />
                }
                {!isLoading &&
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            contentInsetAdjustmentBehavior="automatic"
                        >
                            {(videoType == "PROMOKEY" || videoType == "") &&
                                <View style={{ width: Dimensions.get('screen').width, height: orientation === "landscape" ? 280 : 200 }}>
                                    {route.params.item.ModuleType == "Circular"
                                        ? <PDFViewer pdf={route.params.item.VideoPath} pageNo={1} />
                                        : <WebView
                                            source={{ html: htmlContentPromo }}
                                            allowsFullscreenVideo={true}
                                            automaticallyAdjustContentInsets
                                            mediaPlaybackRequiresUserAction={true}
                                            startInLoadingState={<ActivityIndicator />}
                                            minimumFontSize={12} />
                                    }
                                </View>
                            }
                            {videoType == "FULLKEY" &&
                                <View style={{ width: Dimensions.get('screen').width, height: orientation === "landscape" ? 280 : 200 }}>
                                    {route.params.item.ModuleType == "Circular"
                                        ? <PDFViewer pdf={route.params.item.VideoPath} pageNo={1} />
                                        : <WebView
                                            source={{ html: htmlContent }}
                                            allowsFullscreenVideo={true}
                                            automaticallyAdjustContentInsets
                                            mediaPlaybackRequiresUserAction={true}
                                            startInLoadingState={<ActivityIndicator />}
                                            minimumFontSize={12} />
                                    }
                                </View>
                            }
                            <View style={{ margin: 20 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
                                    <Text style={{ fontSize: 20, width: 300, fontWeight: "bold", color: COLORS.darkBlue }}>{route.params.item.VideoName}</Text>
                                    {/* <View style={[styles.icon_container, styles.shadowProp]}><Image style={styles.icon} source={FavouriteIcon} /></View> */}
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 4 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                                        <View style={{ borderRadius: 35, height: 30, width: 30, borderColor: COLORS.lightGray1, borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white2, marginRight: 6 }}>
                                            <Image style={{
                                                height: 16,
                                                width: 16,
                                            }} source={images.calendar_icon} />
                                        </View>
                                        <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.darkBlue }}>{route.params.item.CreatedDate}</Text>
                                    </View>
                                    <View
                                        style={{
                                            alignSelf: "flex-start",
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginVertical: 6,
                                            borderRadius: 20,
                                            paddingHorizontal: 6,
                                            paddingVertical: 6,
                                            // width: "50%",
                                            backgroundColor: `${route.params.item.Category === "OCIMF SIRE VIQ SERIES"
                                                ? "#FFC239" :
                                                route.params.item.Category === "SHIP SPECIFIC SERIES"
                                                    ? "#29ABE2" :
                                                    route.params.item.Category === "ACCIDENT / INCIDENT SERIES"
                                                        ? "#9E005D" :
                                                        route.params.item.Category === "PERSONAL SAFETY"
                                                            ? "#f75a24" :
                                                            route.params.item.Category === "SHIP BOARD OPERATION"
                                                                ? "#22B573" :
                                                                "red"
                                                }`
                                        }}>
                                        <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.white }} numberOfLines={1}>{route.params.item.Category}</Text>
                                    </View>
                                </View>
                                {route.params.item.ModuleType != "Circular" && (
                                    <View style={{ fontSize: 12, flexDirection: "row", marginVertical: 10 }}>
                                        <Text style={{ color: COLORS.darkBlue, fontWeight: "600" }}>Description : </Text>
                                        <TouchableOpacity style={{ borderBottomWidth: 1, maxWidth: "100%", color: COLORS.blue }}
                                            onPress={() => {
                                                CheckConnectivity()
                                                setViewPdf(!viewPdf)
                                                // onSynopsisPress(`https://testtrace.karco.in/Uploads/Synopsis/${route.params.item.SynopsisPath}`)
                                            }}
                                        >
                                            <Text style={{ color: COLORS.blue }}>View Synopsis</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                <View style={{ borderWidth: 1, borderColor: COLORS.darkBlue, width: "100%", marginVertical: 8 }}></View>
                                {route.params.item.ModuleType == "Circular"
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
                                        iconStyle={{ marginRight: 6, tintColor: "white" }} />
                                    :
                                    <CustomIconButton
                                        label={(videoType == "" || videoType == "PROMOKEY") ? "View Full Video" : "View Promo Video"}
                                        icon={images.view_icon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            onClickPlayVideo()
                                            if ((videoType === "PROMOKEY") || (videoType === "")) {
                                                // webViewNext()
                                                setHtmlContent(htmlContentFull)
                                                setVideoType("FULLKEY")
                                                onFullViewVideoClick()
                                            } else {
                                                // webViewgoback()
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
                                        iconStyle={{ marginRight: 6, tintColor: "white" }} />
                                }
                                {route.params.item.AssessmentStatus == "Pending" &&
                                    <CustomIconButton
                                        label={"Take Assessment"}
                                        icon={images.assessment_icon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            if (route.params.item.HavingAssessment == "Y" && videoType != "") {
                                                navigation.replace("AssessmentNew", { Id: route.params.item.Id, videoPassword: route.params.item.Password, ModuleType: route.params.item.ModuleType })
                                            } else {
                                                if (route.params.item.HavingAssessment !== "Y") {
                                                    alert("The video does not have an Assessment")
                                                } else {
                                                    alert(`Please First ${route.params.item.ModuleType == "Circular" ? "View Circular" : "Play Full Video"}`)
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
                                        iconStyle={{ marginRight: 6 }} />
                                }

                                {route.params.item.AssessmentStatus == "Continue" &&
                                    <CustomIconButton
                                        label={"Continue Assessment"}
                                        icon={images.assessment_icon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            navigation.replace("AssessmentNew", { Id: route.params.item.Id, videoPassword: route.params.item.Password, ModuleType: route.params.item.ModuleType })
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.darkBlue,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            borderRadius: 5,
                                        }}
                                        iconStyle={{ marginRight: 6 }} />
                                }

                                {route.params.item.AssessmentStatus == "Feedback" &&
                                    <CustomIconButton
                                        label={"Give Feedback"}
                                        icon={images.assessment_icon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            navigation.replace("Feedback Form", { Id: route.params.item.Id, videoPassword: route.params.item.Password })
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.darkBlue,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            borderRadius: 5,
                                        }}
                                        iconStyle={{ marginRight: 6 }} />
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
                                        backgroundColor: 'transparent',
                                    }}>
                                    <View style={{ justifyContent: "flex-end", position: "absolute", top: 16, left: 16, zIndex: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setViewPdf(false)
                                            }}>
                                            <Image source={images.close_icon} style={{ width: 20, height: 20 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <Pdf
                                        enablePaging={true}
                                        scale={1.0}
                                        minScale={1.0}
                                        trustAllCerts={false}
                                        source={{ uri: `${route.params.item.ModuleType === "Circular" ? `${getURL.view_PDF_URL}/${route.params.item.VideoPath}` : `${getURL.view_Synopsis_URL}/${route.params.item.SynopsisPath}`}` }}
                                        style={[styles.pdf, { position: "relative" }]}
                                        onError={(error) => {
                                            Alert.alert('Oops !!', 'File is not View able or corrupted', [
                                                { text: 'OK', onPress: () => setViewPdf(false) },
                                            ]);
                                        }}
                                        renderActivityIndicator={() =>
                                            <ActivityIndicator color={COLORS.blue} size={"large"} />
                                        }
                                    />
                                </View>
                            </Modal>
                        </ScrollView>
                    </View>
                }
            </ScrollView>
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
