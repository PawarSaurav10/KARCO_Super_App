import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView, BackHandler, PermissionsAndroid } from 'react-native'
import { WebView } from 'react-native-webview';
import { COLORS } from '../../../Constants/theme';
import FavouriteIcon from "../../../Images/heart.png"
import CalendarIcon from "../../../Images/calendar.png"
import CustomIconButton from '../../../Components/CustomIconButton';
import ViewIcon from "../../../Images/show.png"
import AssesmentIcon from "../../../Images/check-list.png"
import Header from '../../../Components/Header';
import axios from 'axios';
import { getUserData, getUserData_1, getAppLaunched, setAppLaunched } from '../../../Utils/getScreenVisisted';
import PDFViewer from '../../../Components/PDFViewer';
import { useIsFocused } from '@react-navigation/native';
import BackIcon from "../../../Images/left-arrow.png"
import VideoScreenLoader from '../../../Components/VideoScreenLoader';
import Pdf from 'react-native-pdf';
import CloseIcon from "../../../Images/close.png"
import { getURL } from "../../../baseUrl"
import { CheckConnectivity } from "../../../Utils/isInternetConnected"
// import { useTourGuideController, TourGuideZone } from 'rn-tourguide';

const VideoDetailScreen = ({ navigation, route }) => {
    // const {
    //     canStart, // a boolean indicate if you can start tour guide
    //     start, // a function to start the tourguide
    //     stop, // a function  to stopping it
    //     eventEmitter, // an object for listening some events
    // } = useTourGuideController()
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

    const [orientation, setOrientation] = useState()

    const backAction = () => {
        navigation.replace("Online_Home")
        return true;
    };

    // useEffect(() => {
    //     if (canStart) {
    //         getAppLaunched().then((res) => {
    //             if (res && res.code === "HOME") {
    //                 console.log("this start")
    //                 start() // 👈 test if you can start otherwise nothing will happen
    //             }
    //         })
    //     }
    // }, [canStart])

    // const handleOnStart = () => console.log('video start')
    // const handleOnStop = () => console.log('video stop')
    // const handleOnStepChange = () => console.log(`video stepChange`)

    // useEffect(() => {
    //     eventEmitter.on('start', handleOnStart)
    //     eventEmitter.on('stop', () => { // When the tour for that screen ends, replace to the next screen if it exists.
    //         let data = null
    //         data = {
    //             code: "VIDEODTL",
    //             screenVisited: "IsVisited",
    //         }
    //         setAppLaunched(data)
    //     })
    //     eventEmitter.on('stepChange', handleOnStepChange)

    //     return () => {
    //         eventEmitter.off('start', handleOnStart)
    //         eventEmitter.off('stop', handleOnStop)
    //         eventEmitter.off('stepChange', handleOnStepChange)
    //     }
    // }, [canStart])

    /**
    * Returns true if the screen is in portrait mode
    */
    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    // /**
    //  * Returns true of the screen is in landscape mode
    //  */
    // const isLandscape = () => {
    //     const dim = Dimensions.get('screen');
    //     return dim.width >= dim.height;
    // };

    useEffect(() => {
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            setOrientation(
                isPortrait() ? 'portrait' : 'landscape'
            );
        });
    }, [orientation])

    useEffect(() => {
        if (isFocused) {
            const dim = Dimensions.get('screen');
            if (dim.height >= dim.width) {
                setOrientation("protrait")
            } else {
                setOrientation("landscape")
            }
            CheckConnectivity()
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

    const htmlContentPromo = `
        <div width="100%" height="auto" allowFullScreen = "true">
            <iframe src="${getURL.play_video_URL}/${route.params.videokeypromo}" frameborder="0" allowFullscreen="true"  width="100%" height="100%" allowtransparency="true" />
        </div>
      `;
    const htmlContent = `
        <div width="100%" height="auto" allowfullscreen="true">
            <iframe src="${getURL.play_video_URL}/${route.params.videokey}" frameborder="0" allowfullscreen="true" watch-type="" url-params="" height="100%" name="videoPlayerframe"  scrolling="no" width="100%" allowtransparency="true" />
        </div>
      `;

    const onPromoViewVideoClick = () => {
        axios.get(`${getURL.base_URL}/AppVideo/UpdateVideoPreViewActivity?VideoId=${route.params.Id}&username=${userLoginData.userId}&password=${userLoginData.password}&CrewId=${userLoginData.crewId}&VesselId=${userLoginData.vesselId}`)
            .then((response) => console.log(response.status, "onPromoViewVideoClick"))
    }

    const onFullViewVideoClick = () => {
        axios.get(`${getURL.base_URL}/AppVideo/UpdateVideoViewActivity?VideoId=${route.params.Id}&username=${userLoginData.userId}&password=${userLoginData.password}&CrewId=${userLoginData.crewId}&VesselId=${userLoginData.vesselId}`)
            .then((response) => console.log(response.status, "onFullViewVideoClick"))
    }

    const onClickPlayVideo = () => {
        axios.get(`${getURL.base_URL}/AppVideo/UpdateCrewActivity?VideoId=${route.params.Id}&username=${userLoginData.userId}&password=${userLoginData.password}&CrewId=${userLoginData.crewId}&VesselId=${userLoginData.vesselId}`)
            .then((response) => console.log(response.status, "onClickPlayVideo"))
    }

    // const onSynopsisPress = useCallback(async (url) => {
    //     await Linking.openURL(url);
    // }, []);

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
                            onPress={() => navigation.replace("Online_Home")}
                        >
                            <Image source={BackIcon} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    }
                    title={route.params.VideoName}
                />
                {isLoading &&
                    <VideoScreenLoader />
                }
                {!isLoading &&
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            contentInsetAdjustmentBehavior="automatic"
                        >
                            <View style={{ width: Dimensions.get('screen').width, height: orientation === "landscape" ? 280 : 200 }}>
                                {route.params.ModuleType == "Circular"
                                    ? <PDFViewer pdf={route.params.VideoPath} pageNo={1} />
                                    : <WebView source={{ html: (videoType == "PROMOKEY" || videoType == "") ? htmlContentPromo : htmlContent }} allowsFullscreenVideo={true} automaticallyAdjustContentInsets minimumFontSize={12} />
                                }
                            </View>
                            <View style={{ margin: 20 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Text style={{ fontSize: 20, width: 300, fontWeight: "bold", color: COLORS.darkBlue }}>{route.params.VideoName}</Text>
                                    <View style={[styles.icon_container, styles.shadowProp]}><Image style={styles.icon} source={FavouriteIcon} /></View>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 4 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                                        <View style={{ borderRadius: 35, height: 30, width: 30, borderColor: COLORS.lightGray1, borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white2, marginRight: 6 }}>
                                            <Image style={{
                                                height: 16,
                                                width: 16,
                                            }} source={CalendarIcon} />
                                        </View>
                                        <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.darkBlue }}>{route.params.CreatedDate}</Text>
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
                                            backgroundColor: `${route.params.Category === "OCIMF SIRE VIQ SERIES"
                                                ? "#FFC239" :
                                                route.params.Category === "SHIP SPECIFIC SERIES"
                                                    ? "#29ABE2" :
                                                    route.params.Category === "ACCIDENT / INCIDENT SERIES"
                                                        ? "#9E005D" :
                                                        route.params.Category === "PERSONAL SAFETY"
                                                            ? "#f75a24" :
                                                            route.params.Category === "SHIP BOARD OPERATION"
                                                                ? "#22B573" :
                                                                "red"
                                                }`
                                        }}>
                                        <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.white }} numberOfLines={1}>{route.params.Category}</Text>
                                    </View>
                                </View>
                                {route.params.ModuleType != "Circular" && (
                                    <View style={{ fontSize: 12, flexDirection: "row", marginVertical: 10 }}>
                                        <Text style={{ color: COLORS.darkBlue, fontWeight: "600" }}>Description : </Text>
                                        <TouchableOpacity style={{ borderBottomWidth: 1, maxWidth: "100%", color: COLORS.blue }}
                                            onPress={() => {
                                                CheckConnectivity()
                                                setViewPdf(!viewPdf)
                                                // onSynopsisPress(`https://testtrace.karco.in/Uploads/Synopsis/${route.params.SynopsisPath}`)
                                            }}
                                        >
                                            <Text style={{ color: COLORS.blue }}>View Synopsis</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                <View style={{ borderWidth: 1, borderColor: COLORS.darkBlue, width: "100%", marginVertical: 8 }}></View>
                                {route.params.ModuleType == "Circular"
                                    ?
                                    // <TourGuideZone text="Click on this Button to view PDF" zone={1} maskOffset={1} >
                                    <CustomIconButton
                                        label={"View PDF"}
                                        icon={ViewIcon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            setViewPdf(!viewPdf)
                                            setVideoType("PDF")
                                            onFullViewVideoClick()
                                            onClickPlayVideo()
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.blue,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            marginVertical: 6,
                                            borderRadius: 5,
                                        }}
                                        iconStyle={{ marginRight: 6 }} />
                                    // </TourGuideZone>
                                    :
                                    // <TourGuideZone text="Click on this Button to view full video" zone={1} maskOffset={1} >
                                    <CustomIconButton
                                        label={(videoType == "" || videoType == "PROMOKEY") ? "View Full Video" : "View Promo Video"}
                                        icon={ViewIcon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            onClickPlayVideo()
                                            if ((videoType === "PROMOKEY") || (videoType === "")) {
                                                setVideoType("FULLKEY")
                                                onFullViewVideoClick()
                                            } else {
                                                setVideoType("PROMOKEY")
                                                onPromoViewVideoClick()
                                            }
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.blue,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            marginVertical: 6,
                                            borderRadius: 5,
                                        }}
                                        iconStyle={{ marginRight: 6 }} />
                                    // </TourGuideZone>
                                }
                                {route.params.AssessmentStatus == "Pending" &&
                                    // <TourGuideZone text="This Button shows the list of videos todo" zone={2} maskOffset={1} >
                                    <CustomIconButton
                                        label={"Take Assessment"}
                                        icon={AssesmentIcon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            if (route.params.HavingAssessment == "Y" && videoType != "") {
                                                navigation.replace("AssessmentNew", { Id: route.params.Id, videoPassword: route.params.Password, ModuleType: route.params.ModuleType })
                                            } else {
                                                if (route.params.HavingAssessment !== "Y") {
                                                    alert("The video does not have an Assessment")
                                                } else {
                                                    alert(`Please First ${route.params.ModuleType == "Circular" ? "View Circular" : "Play Full Video"}`)
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
                                    // </TourGuideZone>
                                }
                        
                                {route.params.AssessmentStatus == "Continue" &&
                                    // <TourGuideZone text="This Button shows the list of videos todo" zone={2} maskOffset={1} >
                                    <CustomIconButton
                                        label={"Continue Assessment"}
                                        icon={AssesmentIcon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            navigation.replace("AssessmentNew", { Id: route.params.Id, videoPassword: route.params.Password, ModuleType: route.params.ModuleType })
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.darkBlue,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            borderRadius: 5,
                                        }}
                                        iconStyle={{ marginRight: 6 }} />
                                    // </TourGuideZone>
                                }

                                {route.params.AssessmentStatus == "Feedback" &&
                                    // <TourGuideZone text="This Button shows the list of videos todo" zone={2} maskOffset={1} >
                                    <CustomIconButton
                                        label={"Give Feedback"}
                                        icon={AssesmentIcon}
                                        onPress={() => {
                                            CheckConnectivity()
                                            navigation.replace("Feedback Form", { Id: route.params.Id, videoPassword: route.params.Password })
                                        }}
                                        containerStyle={{
                                            backgroundColor: COLORS.darkBlue,
                                            width: "100%",
                                            padding: 16,
                                            alignItems: "center",
                                            borderRadius: 5,
                                        }}
                                        iconStyle={{ marginRight: 6 }} />
                                    // </TourGuideZone>
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
                                            <Image source={CloseIcon} style={{ width: 20, height: 20 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <Pdf
                                        enablePaging={true}
                                        scale={1.0}
                                        minScale={1.0}
                                        trustAllCerts={false}
                                        source={{ uri: `${route.params.ModuleType === "Circular" ? `${getURL.view_PDF_URL}/${route.params.VideoPath}` : `${getURL.view_Synopsis_URL}/${route.params.SynopsisPath}`}` }}
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
