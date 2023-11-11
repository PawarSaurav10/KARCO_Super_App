import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert, BackHandler, Image, ActivityIndicator } from 'react-native'
import { COLORS } from '../../../Constants/theme';
import axios from 'axios';
import { getUserData, getUserData_1, getAppLaunched, setAppLaunched } from "../../../Utils/getScreenVisisted"
import { WebView } from 'react-native-webview';
import PDFViewer from '../../../Components/PDFViewer';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../../Components/Header';
import BackIcon from "../../../Images/left-arrow.png"
import { getURL } from "../../../baseUrl"
import AssessmentScreenLoader from '../../../Components/AssessmentScreenLoader';
import NetInfo from "@react-native-community/netinfo";


const AssessmentScreen = ({ navigation, route }) => {
    const isFocused = useIsFocused()
    const [playVideo, setPlayVideo] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [userLoginData, setUserLoginData] = useState({
        userId: null,
        password: null,
        crewId: null,
        vesselId: null,
    })
    const [assessmentData, setAssessmentData] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [orientation, setOrientation] = useState()

    useEffect(() => {
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            setOrientation(
                isPortrait() ? 'portrait' : 'landscape'
            );
        });
    }, [orientation])

    const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to leave Assessment ?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            { text: 'YES', onPress: () => navigation.replace("Online_Home") },
        ]);
        return true;
    };

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

    async function fetchOnlineAssessmentData() {
        CheckConnectivity()
        if (userLoginData.userId !== null) {
            await axios.get(`${getURL.base_URL}/AppAssessment/GetOnlineAssessment`, {
                params: {
                    VideoId: route.params.Id,
                    username: userLoginData.userId,
                    password: route.params.videoPassword,
                    CrewId: userLoginData.crewId,
                    VesselId: userLoginData.vesselId
                }
            }).then((res) => {
                setAssessmentData(res.data)
                setIsLoading(false)
            }).catch((error) => {
                console.log(error, "error")
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
            getUserData_1().then((res) => {
                setUserLoginData({
                    userId: res.userData.EmployeeId,
                    password: res.userPassword,
                    crewId: res.userData.CrewListId,
                    vesselId: res.userData.VesselId,
                })
            });
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
        axios.get(`${getURL.base_URL}/AppAssessment/GetOnlineAssessment?VideoId=${route.params.Id}&username=${userLoginData.userId}&password=${route.params.videoPassword}&CrewId=${userLoginData.crewId}&VesselId=${userLoginData.vesselId}`)
            .then((res) => console.log(res.status, "get online assessment called"))
    }

    const onCorrectOptionClick = () => {
        if (assessmentData.QuestionList.length === (questioncountIndex + currentQuestion + 1)) {
            setIsLoading(true)
            Alert.alert("Congratulations!", "You Have Answered All The Questions, To Complete The Assessment & Generate Certificate. Click on Proceed To Feedback", [{
                text: 'Proceed',
                onPress: () => {
                    callGetOnlineAssessmentApi()
                    setIsLoading(false)
                    navigation.replace("Feedback Form", { Id: route.params.Id, videoPassword: route.params.videoPassword })
                },
            }])
        } else {
            Alert.alert("Well Done!", "You Have Answered Right Answer, Click on Proceed for Next Question", [{
                text: 'Proceed',
                onPress: () => {
                    callGetOnlineAssessmentApi()
                    setSelectedOptions("")
                    setCurrentQuestion(currentQuestion + 1)
                    setIsLoading(false)
                }
            }])
        }
    }

    const onWrongOptionClick = () => {
        setIsLoading(false)
        Alert.alert("Warning", "This is not a correct option, please see the video & try again", [{
            text: 'Proceed',
            onPress: () => onProceedClick(),
        }])
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
                username: userLoginData.userId,
                password: userLoginData.password,
                CrewId: userLoginData.crewId,
                VesselId: userLoginData.vesselId
            }
        })
    }

    const onProceedClick = () => {
        setPlayVideo(true)
        setSelectedOptions("")
    }

    useEffect(() => {
        if (isFocused) {
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
    }, [userLoginData.userId, isFocused])

    const questionToShow = assessmentData && assessmentData.QuestionList.filter((xx) => xx.Status === "N")[currentQuestion]
    const questioncountIndex = assessmentData && assessmentData.QuestionList.length - assessmentData.QStatusNCount

    const QuestionCard = ({ initialData, questionIndex }) => {
        return (
            <View style={{ padding: 6 }}>
                {initialData !== null &&
                    <>
                        <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "left", marginBottom: 20, color: COLORS.darkBlue }}>{initialData ?.Question}</Text>
                        <TouchableOpacity style={[styles.options_container, { backgroundColor: selectedOptions == "A" ? COLORS.primary : COLORS.white2 }]}
                            onPress={() => {
                                onOptionClick("A", initialData, questionIndex)
                            }}>
                            <Text style={[styles.options_text, { color: selectedOptions == "A" ? COLORS.white2 : COLORS.primary }]}>{initialData ?.OptionA}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.options_container, { backgroundColor: selectedOptions == "B" ? COLORS.primary : COLORS.white2 }]}
                            onPress={() => {
                                onOptionClick("B", initialData, questionIndex)
                            }}>
                            <Text style={[styles.options_text, { color: selectedOptions == "B" ? COLORS.white2 : COLORS.primary }]}>{initialData ?.OptionB}</Text>
                        </TouchableOpacity>
                        {((initialData ?.OptionC !== "NA") && (initialData ?.OptionC !== "N A") && (initialData ?.OptionC !== "")) && (
                            <TouchableOpacity style={[styles.options_container, { backgroundColor: selectedOptions == "C" ? COLORS.primary : COLORS.white2 }]}
                                onPress={() => {
                                    onOptionClick("C", initialData, questionIndex)
                                }}>
                                <Text style={[styles.options_text, { color: selectedOptions == "C" ? COLORS.white2 : COLORS.primary }]}>{initialData ?.OptionC}</Text>
                            </TouchableOpacity>)}
                        {((initialData ?.OptionD !== "NA") && (initialData ?.OptionD !== "N A") && (initialData ?.OptionD !== "")) && (
                            <TouchableOpacity style={[styles.options_container, { backgroundColor: selectedOptions == "D" ? COLORS.primary : COLORS.white2 }]}
                                onPress={() => {
                                    onOptionClick("D", initialData, questionIndex)
                                }}>
                                <Text style={[styles.options_text, { color: selectedOptions == "D" ? COLORS.white2 : COLORS.primary }]}>{initialData ?.OptionD}</Text>
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
                            style={{ marginHorizontal: 12, justifyContent: "flex-start" }}
                            onPress={() => backAction()}
                        >
                            <Image source={BackIcon} style={{ width: 20, height: 20 }} />
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
                                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: COLORS.blue }}>
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ color: COLORS.darkBlue, fontSize: 14, fontWeight: "bold" }}>{assessmentData ?.videoDetail ?.VideoCode}</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
                                        </View>
                                    </View>
                                    <QuestionCard initialData={questionToShow} questionIndex={currentQuestion + 1} />
                                </View>
                                {playVideo == true &&
                                    <View style={{ width: Dimensions.get('screen').width, height: orientation === "landscape" ? 280 : 200, marginBottom: 40 }}>
                                        {route.params.ModuleType == "Circular" ?
                                            <PDFViewer pdf={assessmentData.videoDetail.VideoPath} pageNo={questionToShow ?.ClipTimingFrom} />
                                            :
                                            <WebView
                                                source={{
                                                    html: `
                                                    <div width="100%" height="auto" *ngIf="MainVideoPreview">
                                                        <iframe src="${getURL.play_video_URL}/${assessmentData ?.videoDetail ?.Videokey}?start=${questionToShow ?.ClipTimingFrom}&end=${questionToShow ?.ClipTimingTo}" allow="autoplay; encrypted-media" width="100%" height="100%" allowtransparency="true" data-tap-disabled="true" />
                                                    </div>
                                            `}}
                                                allowsFullscreenVideo={true}
                                            />
                                        }
                                    </View>
                                }
                            </ScrollView>
                        }
                    </View>
                }
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    options_container: {
        borderColor: "#004C6B",
        borderWidth: 1,
        margin: 4,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8
    },
    options_text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#004C6B",
        textAlign: "left"
    }
})

export default AssessmentScreen
