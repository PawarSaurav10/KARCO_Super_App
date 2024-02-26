import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, BackHandler, Image, ActivityIndicator, Modal } from 'react-native'
import { COLORS } from '../../../Constants/theme';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../../Components/Header';
import { getURL } from "../../../baseUrl"
import AssessmentScreenLoader from '../../../Components/AssessmentScreenLoader';
import NetInfo from "@react-native-community/netinfo";
import { Colors } from '../../../node_modules/react-native/Libraries/NewAppScreen';
import {
    Canvas,
    Fill,
    BackdropBlur,
    ColorMatrix,
    useImage,
} from "@shopify/react-native-skia";
import { BlurView } from '@react-native-community/blur';
import Pdf from 'react-native-pdf';
import images from '../../../Constants/images';
import CustomAlert from '../../../Components/CustomAlert';
import * as Progress from 'react-native-progress';
import CustomRadioButton from '../../../Components/CustomRadioButton';
import { useSelector } from '../../../node_modules/react-redux';

const AssessmentScreen = ({ navigation, route }) => {
    const isFocused = useIsFocused()
    const [playVideo, setPlayVideo] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [assessmentData, setAssessmentData] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [orientation, setOrientation] = useState()
    const [showBlur, setShowBlur] = useState(true);
    const [viewRef, setViewRef] = useState(null);
    const [blurType, setBlurType] = useState('light');
    const [viewAlert, setViewAlert] = useState({
        isShow: false,
        AlertType: ""
    })
    const l_loginReducer = useSelector((state) => state.loginReducer)

    const tintColor = ['#ffffff', '#000000'];
    if (blurType === 'xlight') {
        tintColor.reverse();
    }

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

    const backAction = () => {
        setViewAlert({
            isShow: true,
            AlertType: "onBack"
        })
        return true;
    };

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

    async function fetchOnlineAssessmentData() {
        CheckConnectivity()
        if (l_loginReducer.userData.EmployeeId) {
            await axios.get(`${getURL.base_URL}/AppAssessment/GetOnlineAssessment`, {
                params: {
                    VideoId: route.params.Id,
                    username: l_loginReducer.userData.EmployeeId,
                    password: route.params.videoPassword,
                    CrewId: l_loginReducer.userData.CrewListId,
                    VesselId: l_loginReducer.userData.VesselId,
                }
            }).then((res) => {
                if (res.data.QuestionList.length === 0) {
                    setIsLoading(true)
                    setViewAlert({
                        isShow: true,
                        AlertType: "Success"
                    })
                } else {
                    setAssessmentData(res.data)
                }
                setIsLoading(false)
            }).catch((error) => {
                throw error
            })
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
            CheckConnectivity()
            setIsLoading(true)
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            fetchOnlineAssessmentData()
            return () => {
                backHandler.remove();
                setAssessmentData(null)
                setIsLoading(false)
            }
        }
    }, [isFocused])

    const onOptionClick = (selectedOptions, initialData, questionIndex) => {
        CheckConnectivity()
        setPlayVideo(false)
        setIsLoading(true)
        setSelectedOptions(selectedOptions)
        callUpdateCrewActivityAPI(initialData, JSON.stringify(questionIndex), selectedOptions)
        if (selectedOptions === initialData ?.AnswerOption) {
            onCorrectOptionClick()
        } else {
            onWrongOptionClick()
        }
    }

    const callGetOnlineAssessmentApi = () => {
        axios.get(`${getURL.base_URL}/AppAssessment/GetOnlineAssessment?VideoId=${route.params.Id}&username=${l_loginReducer.userData.EmployeeId}&password=${route.params.videoPassword}&CrewId=${l_loginReducer.userData.CrewListId}&VesselId=${l_loginReducer.userData.VesselId}`)
            .then((res) => { })
    }

    const onCorrectOptionClick = () => {
        if (assessmentData.QuestionList.length === (questioncountIndex + currentQuestion + 1)) {
            setIsLoading(true)
            setViewAlert({
                isShow: true,
                AlertType: "Success"
            })
        } else {
            setIsLoading(true)
            setViewAlert({
                isShow: true,
                AlertType: "Correct"
            })
        }
    }

    const onWrongOptionClick = () => {
        setIsLoading(false)
        setViewAlert({
            isShow: true,
            AlertType: "Wrong"
        })
    }

    const callFeedbackAPI = (Id, videoPassword) => {
        let tempData = []
        tempData.push({
            CBTAssessment: 0,
            CBTOverAll: 0,
            CBTPresentation: 0,
            CourseContent: 0,
            KnowledgeScope: 0,
            KnowledgeVolume: 0,
            Opinion: 0,
            PartCourse: "",
            StructureNContent: 0,
            ToBeImproved: "",
            Understanding: 0,
            VideoObjective: 0,
            VideoQuality: 0,
            password: videoPassword
        })
        axios.get(`${getURL.base_URL}/AppFeedback/SaveFeedbackActivity`, {
            params: {
                FeedbackData: JSON.stringify(tempData),
                VideoId: Id,
                username: l_loginReducer.userData.EmployeeId,
                password: videoPassword,
                CrewId: l_loginReducer.userData.CrewListId,
                VesselId: l_loginReducer.userData.VesselId,
                CompanyId: l_loginReducer.userData.CompanyId
            }
        })
    }

    const callUpdateCrewActivityAPI = (data, questionIndex, selected) => {
        setIsLoading(true)
        axios.get(`${getURL.base_URL}/AppAssessment/UpdateAssessmentActivity`, {
            params: {
                assess_Id: data.AssessmentId,
                marks: data.Totalmarks,
                selected: selected,
                answer: data.AnswerOption,
                QueIndex: questionIndex,
                VideoId: route.params.Id,
                username: l_loginReducer.userData.EmployeeId,
                password: l_loginReducer.password,
                CrewId: l_loginReducer.userData.CrewListId,
                VesselId: l_loginReducer.userData.VesselId
            }
        })
    }

    const questionToShow = assessmentData && assessmentData.QuestionList.filter((xx) => xx.Status === "N")[currentQuestion]
    const questioncountIndex = assessmentData && assessmentData.QuestionList.length - assessmentData.QStatusNCount

    const htmlContent = `
        <div width="100%" height="auto" allowfullscreen="true">
            <iframe id="iframe" src="${getURL.play_video_URL}/${assessmentData ?.videoDetail ?.Videokey}?start=${questionToShow ?.ClipTimingFrom}&end=${questionToShow ?.ClipTimingTo}" allow="autoplay" width="100%" height="100%" allowtransparency="true" data-tap-disabled="false" />
        </div>
    `

    let progress = (currentQuestion === 0 ? (questioncountIndex === 0 ? 1 : questioncountIndex + (currentQuestion === 0 ? 1 : currentQuestion)) : (questioncountIndex === 0 ? currentQuestion + 1 : questioncountIndex + (currentQuestion === 0 ? 1 : currentQuestion) + 1)) / (assessmentData && assessmentData.QuestionList.length)

    const QuestionCard = ({ initialData, questionIndex }) => {
        return (
            <View style={{ padding: 6 }}>
                {initialData !== null &&
                    <>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <Text style={{ fontSize: 16, color: COLORS.gray, fontWeight: "500" }}>QUESTION {currentQuestion === 0 ?
                                (questioncountIndex === 0 ? 1 : questioncountIndex + (currentQuestion === 0 ? 1 : currentQuestion))
                                : (questioncountIndex === 0 ? currentQuestion + 1 : questioncountIndex + (currentQuestion === 0 ? 1 : currentQuestion) + 1)
                            } OF {assessmentData && assessmentData.QuestionList.length}</Text>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <View style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 20,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: `${questionToShow ?.Weightage === "A" ?
                                        "#ee3024"
                                        : questionToShow ?.Weightage === "B" ?
                                            "#ea7d22"
                                            : questionToShow ?.Weightage === "C" ?
                                                "#fbb03b" : ""}`
                                }}>
                                    <Text style={{ color: "white" }}>{questionToShow ?.Weightage}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ width: Dimensions.get("window").width, marginBottom: 10 }}>
                            <Progress.Bar progress={progress} animationType="timing" width={Dimensions.get("window").width - 40} height={6} color="green" borderWidth={1} />
                        </View>
                        <View style={styles.question_container}>
                            <Text style={styles.question_text}>{initialData ?.Question}</Text>
                        </View>
                        <View style={{
                            marginBottom: 20, marginTop: -1, marginHorizontal: 6, borderRadius: 6
                        }}>
                            <View style={styles.triangle}></View>
                        </View>
                        <TouchableOpacity style={[styles.options_container, { backgroundColor: selectedOptions == "A" ? COLORS.primary : COLORS.white2 }]}
                            onPress={() => {
                                onOptionClick("A", initialData, questionIndex)

                            }}>
                            <View style={{ marginRight: 2 }}>
                                <CustomRadioButton selected={selectedOptions === "A" ? true : false} onPress={() => {
                                    onOptionClick("A", initialData, questionIndex)
                                }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.options_text, { color: selectedOptions == "A" ? COLORS.white2 : COLORS.primary }]}>{initialData ?.OptionA}</Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.options_container, { backgroundColor: selectedOptions == "B" ? COLORS.primary : COLORS.white2 }]}
                            onPress={() => {
                                onOptionClick("B", initialData, questionIndex)
                            }}>
                            <View style={{ marginRight: 2 }}>
                                <CustomRadioButton selected={selectedOptions === "B" ? true : false} onPress={() => {
                                    onOptionClick("B", initialData, questionIndex)
                                }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.options_text, { color: selectedOptions == "B" ? COLORS.white2 : COLORS.primary }]}>{initialData ?.OptionB}</Text>
                            </View>
                        </TouchableOpacity>
                        {((initialData ?.OptionC !== "NA") && (initialData ?.OptionC !== "N A") && (initialData ?.OptionC !== "") && (initialData ?.OptionC !== "NA.")) && (
                            <TouchableOpacity style={[styles.options_container, { backgroundColor: selectedOptions == "C" ? COLORS.primary : COLORS.white2 }]}
                                onPress={() => {
                                    onOptionClick("C", initialData, questionIndex)
                                }}>
                                <View style={{ marginRight: 2 }}>
                                    <CustomRadioButton selected={selectedOptions === "C" ? true : false} onPress={() => {
                                        onOptionClick("C", initialData, questionIndex)
                                    }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.options_text, { color: selectedOptions == "C" ? COLORS.white2 : COLORS.primary }]}>{initialData ?.OptionC}</Text>
                                </View>
                            </TouchableOpacity>)}
                        {((initialData ?.OptionD !== "NA") && (initialData ?.OptionD !== "N A") && (initialData ?.OptionD !== "") && (initialData ?.OptionD !== "NA.")) && (
                            <TouchableOpacity style={[styles.options_container, { backgroundColor: selectedOptions == "D" ? COLORS.primary : COLORS.white2 }]}
                                onPress={() => {
                                    onOptionClick("D", initialData, questionIndex)
                                }}>
                                <View style={{ marginRight: 2 }}>
                                    <CustomRadioButton selected={selectedOptions === "D" ? true : false} onPress={() => {
                                        onOptionClick("D", initialData, questionIndex)
                                    }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.options_text, { color: selectedOptions == "D" ? COLORS.white2 : COLORS.primary }]}>{initialData ?.OptionD}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </>
                }
                {initialData === null && (<View></View>)}
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <Header
                    titleStyle={{
                        fontSize: 16, fontWeight: "bold"
                    }}
                    leftComponent={
                        <TouchableOpacity
                            style={{ justifyContent: "flex-start", padding: 6, marginHorizontal: 12 }}
                            onPress={() => backAction()}
                        >
                            <Image source={images.left_arrow_icon} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    }
                    title={assessmentData ?.videoDetail ?.VideoName}
                />

                {isLoading &&
                    <AssessmentScreenLoader />
                }

                {!isLoading &&
                    <View style={{ flex: 1 }}>
                        {questionToShow !== null &&
                            <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior="automatic">
                                <View style={{ backgroundColor: "white", padding: 14 }}>
                                    {/* <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: COLORS.blue }}> */}
                                    {/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ color: COLORS.darkBlue, fontSize: 14, fontWeight: "bold" }}>{assessmentData ?.videoDetail ?.VideoCode}</Text>
                                        </View> */}
                                    {/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ textTransform: "uppercase", fontSize: 16, color: COLORS.darkBlue }}>
                                                {currentQuestion === 0 ?
                                                    (questioncountIndex === 0 ? 1 : questioncountIndex + (currentQuestion === 0 ? 1 : currentQuestion))
                                                    : (questioncountIndex === 0 ? currentQuestion + 1 : questioncountIndex + (currentQuestion === 0 ? 1 : currentQuestion) + 1)
                                                } of {assessmentData && assessmentData.QuestionList.length}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                            <View style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 20,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: `${questionToShow ?.Weightage === "A" ?
                                                    "#ee3024"
                                                    : questionToShow ?.Weightage === "B" ?
                                                        "#ea7d22"
                                                        : questionToShow ?.Weightage === "C" ?
                                                            "#fbb03b" : ""}`
                                            }}>
                                                <Text style={{ color: "white" }}>{questionToShow ?.Weightage}</Text>
                                            </View>
                                        </View> */}
                                    {/* </View> */}
                                    {assessmentData.QuestionList.length >= (questioncountIndex + currentQuestion + 1) &&
                                        <QuestionCard initialData={questionToShow} questionIndex={currentQuestion + 1} />
                                    }
                                </View>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={playVideo}
                                    onRequestClose={() => {
                                        setPlayVideo(false)
                                    }}
                                >
                                    {assessmentData.videoDetail.ModuleType !== "Company Content" &&
                                        <View
                                            style={{
                                                width: "100%",
                                                height: '100%',
                                                marginTop: 'auto',
                                                backgroundColor: 'rgba(0,0,0,0.6)',
                                            }}
                                        >
                                            {showBlur &&
                                                <BlurView
                                                    viewRef={viewRef}
                                                    style={{
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 0,
                                                        bottom: 0,
                                                        right: 0,
                                                    }}
                                                    blurType={"light"}
                                                    blurAmount={1}
                                                    overlayColor={'rgba(0,0,0,0.6)'}
                                                />
                                            }
                                            <View style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: orientation === "landscape" ? 0 : 10,
                                                // right: 0,
                                                bottom: 0,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: Dimensions.get('screen').width - 20,
                                                shadowColor: '#000',
                                                shadowOffset: {
                                                    width: 10,
                                                    height: 10,
                                                },
                                                shadowOpacity: 0.50,
                                                shadowRadius: 6,
                                                elevation: 5,
                                            }}>
                                                <TouchableOpacity
                                                    style={{ flex: orientation === "landscape" ? 0.6 : 0.07, marginLeft: "auto", padding: 4 }}
                                                    onPress={() => {
                                                        setPlayVideo(!playVideo);
                                                    }}>
                                                    <View style={{ backgroundColor: "white", width: 24, height: 24, alignItems: 'center', justifyContent: "center", borderRadius: 20 }}>
                                                        <Image source={images.close_icon} style={{ width: 16, height: 16 }} />
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={{ width: Dimensions.get('window').width - (orientation === "landscape" ? 40 : 20), height: orientation === "landscape" ? 280 : 200 }}>
                                                    <WebView
                                                        source={{ html: htmlContent }}
                                                        allowsFullscreenVideo={true}
                                                        mediaPlaybackRequiresUserAction={true}
                                                        allowsInlineMediaPlayback={true}
                                                        domStorageEnabled={true}
                                                        allowFileAccess={false}
                                                        startInLoadingState={<ActivityIndicator />}
                                                        automaticallyAdjustContentInsets
                                                        minimumFontSize={18}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    }
                                    {assessmentData.videoDetail.ModuleType == "Company Content" &&
                                        <View
                                            style={{
                                                width: "100%",
                                                height: '100%',
                                                marginTop: 'auto',
                                                backgroundColor: Colors.lighter,
                                                position: "relative",
                                            }}>
                                            <View style={{ flex: 0.03, padding: 10 }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setPlayVideo(false)
                                                    }}>
                                                    <Image source={images.close_icon} style={{ width: 20, height: 20 }} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flex: 0.97 }}>
                                                <Pdf
                                                    enablePaging={true}
                                                    scale={1.0}
                                                    minScale={1.0}
                                                    trustAllCerts={false}
                                                    source={{ uri: `${getURL.view_PDF_URL}/${assessmentData.videoDetail.VideoPath}` }}
                                                    style={{ flex: 1, position: "relative" }}
                                                    onError={(error) => {
                                                        setViewAlert({
                                                            isShow: true,
                                                            AlertType: "PDF"
                                                        })
                                                    }}
                                                    page={questionToShow ?.ClipTimingFrom}
                                                    renderActivityIndicator={() =>
                                                        <ActivityIndicator color={COLORS.blue} size={"large"} />
                                                    }
                                                />
                                            </View>
                                        </View>
                                    }
                                </Modal>
                            </ScrollView>
                        }
                    </View>
                }
                {viewAlert.isShow && (
                    <CustomAlert
                        isView={viewAlert.isShow}
                        Title={viewAlert.AlertType === "Internet" ? "Oops !!" : viewAlert.AlertType === "onBack" ? "Hold on!" : viewAlert.AlertType === "Success" ? "Congratulations!" : viewAlert.AlertType === "Correct" ? "Well Done!" : viewAlert.AlertType === "Wrong" ? "Warning!" : "Oops !!"}
                        Content={viewAlert.AlertType === "Internet" ?
                            "Your Device is not Connected to Internet, Please Check your Internet Connectivity"
                            : viewAlert.AlertType === "onBack" ? "Are you sure you want to leave Assessment ?"
                                : viewAlert.AlertType === "Success" ? "You have completed the assessment. To generate your certificate, proceed to feedback."
                                    : viewAlert.AlertType === "Correct" ? "You have provided the correct answer"
                                        : viewAlert.AlertType === "Wrong" ? "This is not a correct option, please watch the video & try again"
                                            : viewAlert.AlertType === "PDF" ? "File is not View able or corrupted" : ""}
                        buttonContainerStyle={{
                            flexDirection: viewAlert.AlertType === "Success" ? "column" : "row",
                            justifyContent: "flex-end"
                        }}
                        ButtonsToShow={[
                            {
                                text: 'CANCEL',
                                onPress: () => {
                                    setViewAlert({
                                        isShow: false,
                                        AlertType: ""
                                    })
                                },
                                toShow: viewAlert.AlertType === "onBack" ? true : false,
                            },
                            {
                                text: viewAlert.AlertType === "onBack" ? 'YES' : 'OK',
                                onPress: () => {
                                    if (viewAlert.AlertType === "Internet") {
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: "Home" }],
                                        })
                                    } else if (viewAlert.AlertType === "onBack") {
                                        navigation.replace("Online_Home")
                                    } else if (viewAlert.AlertType === "PDF") {
                                        setPlayVideo(false)
                                    }
                                    setViewAlert({
                                        isShow: false,
                                        AlertType: ""
                                    })
                                },
                                toShow: (viewAlert.AlertType === "Internet" || viewAlert.AlertType === "onBack" || viewAlert.AlertType === "PDF") && true,
                            },
                            {
                                text: 'Proceed',
                                onPress: () => {
                                    if (viewAlert.AlertType === "Correct") {
                                        setIsLoading(false)
                                        callGetOnlineAssessmentApi()
                                        setSelectedOptions("")
                                        setCurrentQuestion(currentQuestion + 1)
                                    } else if (viewAlert.AlertType === "Wrong") {
                                        setPlayVideo(true)
                                        setSelectedOptions("")
                                        setShowBlur(true)
                                        setViewRef(true)
                                        setIsLoading(false)
                                    }
                                    setViewAlert({
                                        isShow: false,
                                        AlertType: ""
                                    })
                                },
                                toShow: (viewAlert.AlertType === "Correct" || viewAlert.AlertType === "Wrong") && true,
                            },
                            {
                                text: 'Proceed To Feedback',
                                onPress: () => {
                                    setIsLoading(false)
                                    callGetOnlineAssessmentApi()
                                    navigation.replace("Feedback Form", { Id: route.params.Id, videoPassword: route.params.videoPassword })
                                    setViewAlert({
                                        isShow: false,
                                        AlertType: ""
                                    })
                                },
                                toShow: viewAlert.AlertType === "Success" ? true : false,
                            },
                            {
                                text: 'Continue Without Feedback',
                                onPress: () => {
                                    setIsLoading(false)
                                    callGetOnlineAssessmentApi()
                                    callFeedbackAPI(route.params.Id, route.params.videoPassword)
                                    navigation.replace("Online_Home")
                                    setViewAlert({
                                        isShow: false,
                                        AlertType: ""
                                    })
                                },
                                toShow: viewAlert.AlertType === "Success" ? true : false,
                            },
                        ]}
                    />
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    question_container: {
        marginTop: 10,
        marginHorizontal: 6,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 22,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
    question_text: {
        fontFamily: "Segoe UI Bold",
        fontSize: 21,
        fontWeight: "600",
        textAlign: "center",
        color: COLORS.white2
    },
    options_container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderColor: COLORS.primary,
        borderWidth: 1.2,
        marginHorizontal: 4,
        marginVertical: 6,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
    options_text: {
        fontFamily: "Segoe UI semibold",
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.primary,
        textAlign: "left"
    },
    triangle: {
        backgroundColor: "transparent",
        borderRightWidth: Dimensions.get("window").width - 60,
        // borderBottomWidth: 80,
        borderTopWidth: 36,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: COLORS.primary,
    },
})

export default AssessmentScreen
