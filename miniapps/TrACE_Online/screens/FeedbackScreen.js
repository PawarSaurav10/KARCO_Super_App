import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, Alert, BackHandler, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import CheckBox from '@react-native-community/checkbox';
import { Rating } from 'react-native-ratings';
import CustomInput from "../../../Components/CustomInput"
import CustomIconButton from '../../../Components/CustomIconButton';
import { COLORS, SIZES } from '../../../Constants/theme';
import Rater1 from "../../../Images/raters.png"
import Rater3 from "../../../Images/raters2.png"
import Rater2 from "../../../Images/raters3.png"
import axios from 'axios';
import { getUserData, getUserData_1, getAppLaunched, setAppLaunched } from "../../../Utils/getScreenVisisted"
import { useIsFocused } from '@react-navigation/native';
import { CheckConnectivity } from "../../../Utils/isInternetConnected"
import Header from '../../../Components/Header';
import CloseIcon from "../../../Images/close.png"
import BackIcon from "../../../Images/left-arrow.png"
import { getURL } from "../../../baseUrl"
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SubmitIcon from "../../../Images/submit.png"
import CustomButton from '../../../Components/CustomButton';
// import { TourGuideZone, useTourGuideController } from 'rn-tourguide';

const FeedbackScreen = ({ navigation, route }) => {
    // const { start, canStart, stop, eventEmitter } = useTourGuideController()
    const isFocused = useIsFocused();
    const presentationData = [
        {
            key: 1,
            title: "CBT Assessment",
            isNA: false,
            isUnacceptable: false,
            isPoor: false,
            isGood: false,
            isExcellent: false,
        },
        {
            key: 2,
            title: "Video Quality",
            isNA: false,
            isUnacceptable: false,
            isPoor: false,
            isGood: false,
            isExcellent: false,
        },
        {
            key: 3,
            title: "CBT Presentation",
            isNA: false,
            isUnacceptable: false,
            isPoor: false,
            isGood: false,
            isExcellent: false,
        },
        {
            key: 4,
            title: "CBT Structure / Content",
            isNA: false,
            isUnacceptable: false,
            isPoor: false,
            isGood: false,
            isExcellent: false,
        },
        {
            key: 5,
            title: "Video Objective",
            isNA: false,
            isUnacceptable: false,
            isPoor: false,
            isGood: false,
            isExcellent: false,
        },
    ];
    const courseObjtData = [
        {
            key: 1,
            title: "Were Course objectives visually understood ?",
            No: false,
            Yes: false,
        },
        {
            key: 2,
            title: "In your opinion were the objectives met ?",
            No: false,
            Yes: false,
        },
    ];
    const courseData = [
        {
            key: 1,
            title: "Knowledge Scope",
            isInadequate: false,
            isAdequate: false,
            isExcessive: false,
        },
        {
            key: 2,
            title: "Knowledge Volume",
            isInadequate: false,
            isAdequate: false,
            isExcessive: false,
        },
        {
            key: 3,
            title: "Course Content",
            isInadequate: false,
            isAdequate: false,
            isExcessive: false,
        },
    ];
    const initialfeedbackData = {
        CBT_Assesment: null,
        Video_qty: null,
        CBT_Presentation: null,
        CBT_Str_Cont: null,
        Video_objt: null,
        isUnderstood: null,
        isObjectiveMet: null,
        Knowledge_Scope: null,
        Knowledge_Volume: null,
        Course_Content: null,
        Relevant_Part_Dtl: "",
        Improvement_Dtl: "",
        ratings: null,
    }
    const [feedbackFormData, setFeedbackFormData] = useState(initialfeedbackData)
    const [presentationFormdata, setPresentationFormData] = useState(presentationData);
    const [courseFormdata, setCourseFormData] = useState(courseData);
    const [courseObjtFormData, setCourseObjtFormData] = useState(courseObjtData);
    const [rating, setRating] = useState("");
    const [userLoginData, setUserLoginData] = useState({
        userId: null,
        password: null,
        crewId: null,
        vesselId: null,
        companyId: null
    })
    const [resultData, setResultData] = useState(null)
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [orientation, setOrientation] = useState()

    // useEffect(() => {
    //     if (canStart) {
    //         getAppLaunched().then((res) => {
    //             console.log(res, "Feedback res")
    //             if (res && res.code === "VIDEODTL" || res.code === "ASSESS") {
    //                 start() // 👈 test if you can start otherwise nothing will happen
    //             }
    //         })
    //     }
    // }, [canStart]) // 👈 don't miss it!

    // const handleOnStart = () => console.log('start feedback')
    // const handleOnStop = () => console.log('stop feedback')
    // const handleOnStepChange = () => console.log(`stepChange feedback`)

    // useEffect(() => {
    //     eventEmitter.on('start', handleOnStart)
    //     eventEmitter.on('stop', () => { // When the tour for that screen ends, replace to the next screen if it exists.
    //         let data = null
    //         data = {
    //             code: "FEEDBACK",
    //             screenVisited: "IsVisited",
    //         }
    //         // console.log(data, "data called")
    //         setAppLaunched(data)
    //     })
    //     eventEmitter.on('stepChange', handleOnStepChange)

    //     return () => {
    //         eventEmitter.off('start', handleOnStart)
    //         eventEmitter.off('stop', handleOnStop)
    //         eventEmitter.off('stepChange', handleOnStepChange)
    //     }
    // }, [])

    /**
    * Returns true if the screen is in portrait mode
    */
    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    /**
     * Returns true of the screen is in landscape mode
     */
    const isLandscape = () => {
        const dim = Dimensions.get('screen');
        return dim.width >= dim.height;
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
        Alert.alert('Hold on!', 'Are you sure you want to go back?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            { text: 'YES', onPress: () => navigation.replace("Online_Home") },
        ]);
        return true;
    };

    async function fetchResultData() {
        CheckConnectivity()
        if (userLoginData.userId !== null) {
            await axios.get(`${getURL.base_URL}/AppFeedback/GetOnlineFeedback`, {
                params: {
                    VideoId: route.params.Id,
                    username: userLoginData.userId,
                    password: route.params.videoPassword,
                    CrewId: userLoginData.crewId,
                    VesselId: userLoginData.vesselId,
                }
            })
                .then((res) => {
                    setResultData(res.data)
                })
                .catch((error) => {
                    console.log(error, "error")
                    throw error
                })
        }
    }

    useEffect(() => {
        const dim = Dimensions.get('screen');
        if (dim.height >= dim.width) {
            setOrientation("protrait")
        } else {
            setOrientation("landscape")
        }
        // getUserData().then((res) => {
        //     setUserLoginData({
        //         userId: res.userId,
        //         password: res.password,
        //         crewId: res.crewId,
        //         vesselId: res.vesselId,
        //     })
        // });
        getUserData_1().then((res) => {
            setUserLoginData({
                userId: res.userData.EmployeeId,
                password: res.userPassword,
                crewId: res.userData.CrewListId,
                vesselId: res.userData.VesselId,
                companyId: res.userData.CompanyId
            })
        });
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove()
    }, [])

    useEffect(() => {
        if (isFocused) {
            fetchResultData()
        }
    }, [userLoginData, isFocused])

    const ratingCompleted = (ratingData) => {
        setRating(ratingData)
    }

    const Percentage = (100 * resultData ?.Scores ?.ObtainedMarks) / resultData ?.Scores ?.TotalMarks;

    const onSubmitClick = () => {
        let data = {
            CBT_Assesment: null,
            Video_qty: null,
            CBT_Presentation: null,
            CBT_Str_Cont: null,
            Video_objt: null,
            isUnderstood: null,
            isObjectiveMet: null,
            Knowledge_Scope: null,
            Knowledge_Volume: null,
            Course_Content: null,
            Relevant_Part_Dtl: feedbackFormData.Relevant_Part_Dtl,
            Improvement_Dtl: feedbackFormData.Improvement_Dtl,
            ratings: rating,
        }
        presentationFormdata.forEach((oo) => {
            data = {
                ...data,
                [oo.title]: oo.isNA
                    ? "0"
                    : oo.isUnacceptable
                        ? "1"
                        : oo.isPoor
                            ? "2"
                            : oo.isGood
                                ? "3" :
                                oo.isExcellent
                                    ? "4"
                                    : null,
            };
        });
        courseFormdata.forEach((oo) => {
            data = {
                ...data,
                [oo.title]: oo.isInadequate
                    ? "1"
                    : oo.isAdequate
                        ? "2"
                        : oo.isExcessive
                            ? "3"
                            : null
            };
        });
        courseObjtFormData.forEach((oo) => {
            data = {
                ...data,
                [oo.title]: oo.No
                    ? "1"
                    : oo.Yes
                        ? "2"
                        : null,
            };
        });
        let tempData = {
            password: route.params.videoPassword,
            CBTOverAll: rating,
            CBTAssessment: data["CBT Assessment"],
            VideoQuality: data["Video Quality"],
            CBTPresentation: data["CBT Presentation"],
            StructureNContent: data["CBT Structure / Content"],
            VideoObjective: data["Video Objective"],
            Understanding: data["Were Course objectives visually understood ?"],
            Opinion: data["In your opinion were the objectives met ?"],
            KnowledgeScope: data["Knowledge Scope"],
            KnowledgeVolume: data["Knowledge Volume"],
            CourseContent: data["Course Content"],
            PartCourse: feedbackFormData.Relevant_Part_Dtl,
            ToBeImproved: feedbackFormData.Improvement_Dtl,
        }
        let tempSaveData = []
        tempSaveData.push({
            password: tempData.password,
            CBTOverAll: tempData.CBTOverAll,
            CBTAssessment: tempData.CBTAssessment,
            VideoQuality: tempData.VideoQuality,
            CBTPresentation: tempData.CBTPresentation,
            StructureNContent: tempData.StructureNContent,
            VideoObjective: tempData.VideoObjective,
            Understanding: tempData.Understanding,
            Opinion: tempData.Opinion,
            KnowledgeScope: tempData.KnowledgeScope,
            KnowledgeVolume: tempData.KnowledgeVolume,
            CourseContent: tempData.CourseContent,
            PartCourse: tempData.PartCourse,
            ToBeImproved: tempData.ToBeImproved
        })
        console.log(getURL.base_URL, JSON.stringify(tempSaveData), route.params.videoPassword, route.params.Id, userLoginData.crewId, userLoginData.companyId, "tempData")
        if (
            (tempData.CBTOverAll != "") &&
            tempData.CBTAssessment != null &&
            tempData.VideoQuality != null &&
            tempData.CBTPresentation != null &&
            tempData.StructureNContent != null &&
            tempData.VideoObjective != null &&
            tempData.Understanding != null &&
            tempData.Opinion != null &&
            tempData.KnowledgeScope != null &&
            tempData.KnowledgeVolume != null &&
            tempData.CourseContent != null
        ) {
            try {
                axios.get(`${getURL.base_URL}/AppFeedback/SaveFeedbackActivity?FeedbackData=${JSON.stringify(tempSaveData)}&VideoId=${route.params.Id}&username=${userLoginData.userId}&password=${route.params.videoPassword}&CrewId=${userLoginData.crewId}&VesselId=${userLoginData.vesselId}&CompanyId=${userLoginData.companyId}`)
                    .then((res) => {
                        console.log(res, "res")
                        if (res.status === 200) {
                            Alert.alert("Success", "Thank You for Your Feedback", [{
                                text: 'OK', onPress: () => navigation.replace("Online_Home")
                            }])
                        }
                    }).catch((error) => {
                        console.log(error);
                    })
            } catch (error) {
                console.error(`Error received ${JSON.stringify(err)}`);
            }
        } else {
            Alert.alert("Warning", "Fields with * mark are Mandatory", [{
                text: 'OK',
            }])
        }
    }

    return (
        <View style={{ flex: 1 }}>
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
                title={"Feedback"}
            />
            <ScrollView>
                <View style={{ padding: 8, display: "flex", justifyContent: "center", backgroundColor: "#004C6B", color: "white" }}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <View style={{ paddingHorizontal: 6, paddingVertical: 4, backgroundColor: "red", marginBottom: 16 }}>
                            <Text style={{ fontSize: 16, color: COLORS.white, textTransform: "uppercase" }}>Feedback Form</Text>
                        </View>
                        <Text style={styles.paragraphText}>In Order to Successfully 'Complete' this assessment, you are required to fill the feedback form.</Text>
                        <Text style={styles.paragraphText}>This form is for you to provide us with an assessment of the course you have attended.</Text>
                        <Text style={styles.paragraphText}>Your feedback regarding the course will assist us in identifying improvement opportunities.</Text>
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={{ textTransform: "uppercase", fontSize: 18, color: "white" }}>Presentation</Text>
                        <Image source={Rater1} style={{ width: 140, height: 60, objectFit: "fill" }} />
                    </View>
                    <View>
                        {presentationFormdata.map((xx, idx) => {
                            return (
                                // <TourGuideZone zone={1}>
                                <View key={idx} style={styles.questionContainer}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ color: "white" }}>{idx + 1}. {xx.title} </Text><Text style={{ color: "red" }}>*</Text>
                                    </View>

                                    <View style={styles.radioButtonContainer}>
                                        <CheckBox
                                            // tintColors={"white"}
                                            disabled={false}
                                            value={xx.isNA}
                                            onValueChange={(e) => {
                                                let tempData = [...presentationFormdata];
                                                let tempIndex = presentationFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isNA = e;
                                                tempData[tempIndex].isUnacceptable = false;
                                                tempData[tempIndex].isPoor = false;
                                                tempData[tempIndex].isGood = false;
                                                tempData[tempIndex].isExcellent = false;
                                                setPresentationFormData(tempData);
                                            }}
                                        />
                                        <CheckBox
                                            // tintColors={"white"}
                                            disabled={false}
                                            value={xx.isUnacceptable}
                                            onValueChange={(e) => {
                                                let tempData = [...presentationFormdata];
                                                let tempIndex = presentationFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isNA = false;
                                                tempData[tempIndex].isUnacceptable = e;
                                                tempData[tempIndex].isPoor = false;
                                                tempData[tempIndex].isGood = false;
                                                tempData[tempIndex].isExcellent = false;
                                                setPresentationFormData(tempData);
                                            }}
                                        />
                                        <CheckBox
                                            // tintColors={"white"}
                                            disabled={false}
                                            value={xx.isPoor}
                                            onValueChange={(e) => {
                                                let tempData = [...presentationFormdata];
                                                let tempIndex = presentationFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isNA = false;
                                                tempData[tempIndex].isUnacceptable = false;
                                                tempData[tempIndex].isPoor = e;
                                                tempData[tempIndex].isGood = false;
                                                tempData[tempIndex].isExcellent = false;
                                                setPresentationFormData(tempData);
                                            }}
                                        />
                                        <CheckBox
                                            // tintColors={"white"}
                                            disabled={false}
                                            value={xx.isGood}
                                            onValueChange={(e) => {
                                                let tempData = [...presentationFormdata];
                                                let tempIndex = presentationFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isNA = false;
                                                tempData[tempIndex].isUnacceptable = false;
                                                tempData[tempIndex].isPoor = false;
                                                tempData[tempIndex].isGood = e;
                                                tempData[tempIndex].isExcellent = false;
                                                setPresentationFormData(tempData);
                                            }}
                                        />
                                        <CheckBox
                                            // tintColors={"white"}
                                            disabled={false}
                                            value={xx.isExcellent}
                                            onValueChange={(e) => {
                                                let tempData = [...presentationFormdata];
                                                let tempIndex = presentationFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isNA = false;
                                                tempData[tempIndex].isUnacceptable = false;
                                                tempData[tempIndex].isPoor = false;
                                                tempData[tempIndex].isGood = false;
                                                tempData[tempIndex].isExcellent = e;
                                                setPresentationFormData(tempData);
                                            }}
                                        />
                                    </View>
                                </View>
                                // {/* </TourGuideZone> */ }
                            )
                        })}
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={{ textTransform: "uppercase", fontSize: 18, color: "white" }}>Course Objective</Text>
                        <Image source={Rater2} style={{ width: 50, height: 30, objectFit: "fill" }} />
                    </View>
                    <View>
                        {courseObjtFormData.map((xx, idx) => {
                            return (
                                // <TourGuideZone zone={2}>
                                <View key={idx} style={styles.questionContainer}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ width: 250, color: "white" }}>{idx + 1}. {xx.title} </Text><Text style={{ color: "red" }}>*</Text>
                                    </View>
                                    <View style={styles.radioButtonContainer}>
                                        <CheckBox
                                            // tintColors={"white"}
                                            // disabled={false}
                                            value={xx.No}
                                            onValueChange={(e) => {
                                                let tempData = [...courseObjtFormData];
                                                let tempIndex = courseObjtFormData.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].No = e;
                                                tempData[tempIndex].Yes = false;
                                                setCourseObjtFormData(tempData);
                                            }}
                                        />
                                        <CheckBox
                                            // tintColors={"white"}
                                            // disabled={false}
                                            value={xx.Yes}
                                            onValueChange={(e) => {
                                                let tempData = [...courseObjtFormData];
                                                let tempIndex = courseObjtFormData.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].No = false;
                                                tempData[tempIndex].Yes = e;
                                                setCourseObjtFormData(tempData);
                                            }}
                                        />
                                    </View>
                                </View>
                                // {/* </TourGuideZone> */ }
                            )
                        })}
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={{ textTransform: "uppercase", fontSize: 18, color: "white" }}>Course Content</Text>
                        <Image source={Rater3} style={{ width: 100, height: 60, objectFit: "fill" }} />
                    </View>
                    <View>
                        {courseFormdata.map((xx, idx) => {
                            return (
                                <View key={idx} style={styles.questionContainer}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ color: "white" }}>{idx + 1}. {xx.title} </Text><Text style={{ color: "red" }}>*</Text>
                                    </View>
                                    <View style={styles.radioButtonContainer}>
                                        <CheckBox
                                            // tintColors={"white"}
                                            disabled={false}
                                            value={xx.isInadequate}
                                            onValueChange={(e) => {
                                                let tempData = [...courseFormdata];
                                                let tempIndex = courseFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isInadequate = e;
                                                tempData[tempIndex].isAdequate = false;
                                                tempData[tempIndex].isExcessive = false;
                                                setCourseFormData(tempData);
                                            }}
                                        />
                                        <CheckBox
                                            // tintColors={"white"}
                                            disabled={false}
                                            value={xx.isAdequate}
                                            onValueChange={(e) => {
                                                let tempData = [...courseFormdata];
                                                let tempIndex = courseFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isInadequate = false;
                                                tempData[tempIndex].isAdequate = e;
                                                tempData[tempIndex].isExcessive = false;
                                                setCourseFormData(tempData);
                                            }}
                                        />
                                        <CheckBox
                                            // tintColors={"white"}
                                            disabled={false}
                                            value={xx.isExcessive}
                                            onValueChange={(e) => {
                                                let tempData = [...courseFormdata];
                                                let tempIndex = courseFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isInadequate = false;
                                                tempData[tempIndex].isAdequate = false;
                                                tempData[tempIndex].isExcessive = e;
                                                setCourseFormData(tempData);
                                            }}
                                        />
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                    <View style={styles.titleContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ textTransform: "uppercase", fontSize: 18, color: "white" }}>Suggestions </Text>
                            <Text style={{ fontSize: 16, color: "white" }}>(Optional)</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{ paddingVertical: 6, paddingHorizontal: 4, marginBottom: 6 }}>
                            <Text style={{ color: "white" }}>1. What was the most relevant part of the course ? </Text>
                            <CustomInput value={feedbackFormData.Relevant_Part_Dtl} textColor={COLORS.white} onChangeText={(value) => {
                                setFeedbackFormData({ ...feedbackFormData, Relevant_Part_Dtl: value === null ? "" : value })
                            }} />
                        </View>
                        <View style={{ paddingVertical: 6, paddingHorizontal: 4, marginBottom: 6, }}>
                            <Text style={{ color: "white" }}>2. Which part might be improved and why ? </Text>
                            <CustomInput value={feedbackFormData.Improvement_Dtl} textColor={COLORS.white} onChangeText={(value) => {
                                setFeedbackFormData({ ...feedbackFormData, Improvement_Dtl: value === null ? "" : value })
                            }} />
                        </View>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={{ textTransform: "uppercase", fontSize: 18, color: "white" }}>Overall Rating</Text>
                    </View>
                    <View>
                        <View style={{ paddingVertical: 6, paddingHorizontal: 4, marginBottom: 6 }}>
                            <Text style={{ color: "white" }}>
                                Please provide an overall rating based on your experience of using and learning this module on this platform.
                            </Text>
                        </View>
                        <View style={{ paddingVertical: 6, paddingHorizontal: 4, marginBottom: 6 }}>
                            <Rating
                                startingValue={0}
                                minValue={0}
                                type='star'
                                ratingCount={5}
                                imageSize={24}
                                tintColor="#004C6B"
                                ratingBackgroundColor="#004C6B"
                                // style={{ paddingVertical: 10, backgroundColor: "#004C6B" }}
                                onFinishRating={(ratingData) => ratingCompleted(ratingData)}
                            />
                        </View>
                    </View>
                    {/* <TourGuideZone zone={3} text="Hello world"> */}
                    <CustomButton
                        label={"View Result Detail"}
                        containerStyle={{
                            backgroundColor: "transparent",
                            width: "100%",
                            padding: 16,
                            alignItems: "center",
                            marginVertical: 12,
                        }}
                        onPress={() => {
                            CheckConnectivity()
                            setIsVisibleModal(true)
                        }}
                        labelStyle={{ color: COLORS.white, fontSize: 14, textTransform: "uppercase", borderBottomWidth: 2, borderBottomColor: COLORS.white }}
                    />
                    {/* </TourGuideZone> */}
                    {/* <TourGuideZone zone={4} text="Hello world"> */}
                    <CustomIconButton
                        label={"SUBMIT"}
                        containerStyle={{
                            backgroundColor: "white",
                            width: "100%",
                            padding: 16,
                            alignItems: "center",
                            marginVertical: 12,
                            borderRadius: 5,
                        }}
                        onPress={() => {
                            CheckConnectivity()
                            onSubmitClick()
                        }}
                        labelStyle={{ color: COLORS.darkBlue }}
                        icon={SubmitIcon}
                        iconStyle={{
                            marginRight: 10
                        }}
                    />
                    {/* </TourGuideZone> */}
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isVisibleModal}
                    onRequestClose={() => {
                        setIsVisibleModal(false)
                    }}
                >
                    <View
                        style={{
                            height: '100%',
                            marginTop: 'auto',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                        }}>
                        <View style={{
                            height: orientation === "landscape" ? "85%" : '40%',
                            marginTop: 'auto',
                        }}>
                            <View style={styles.footer}>
                                <View style={{ flexDirection: "row", paddingHorizontal: 24, paddingTop: 24, paddingBottom: 14, justifyContent: "space-between", alignItems: "center" }}>
                                    <View style={{ flex: 0.9, alignItems: "flex-start" }}>
                                        <Text style={styles.headerText}>{resultData ?.videoInfo ?.VideoName}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{ flex: 0.1, alignItems: "flex-end" }}
                                        onPress={() => {
                                            setIsVisibleModal(!isVisibleModal);
                                        }}>
                                        <Image source={CloseIcon} style={{ width: 16, height: 16 }} />
                                    </TouchableOpacity>
                                </View>

                                {/* Line Divider */}
                                <View
                                    style={{
                                        height: 2,
                                        marginVertical: SIZES.height > 800 ? SIZES.radius : 0,
                                        marginLeft: SIZES.radius,
                                        marginRight: SIZES.radius,
                                        backgroundColor: COLORS.lightGray1,
                                    }}
                                />
                                <View style={{ marginBottom: 14, paddingHorizontal: 14 }}>
                                    <View style={{ justifyContent: "space-between", alignItems: "flex-end", flexDirection: "row", paddingBottom: 10 }}>
                                        <View style={{ margin: 4 }}>
                                            <Text style={{
                                                fontSize: 34,
                                                fontWeight: "bold",
                                                color: Percentage > 70 ? "green"
                                                    : Percentage > 50 ? "#edc700"
                                                        : Percentage < 50 ? "red"
                                                            : "red"
                                            }}>
                                                {parseFloat(Percentage).toFixed(0)}%
                                            </Text>
                                            <Text style={{ fontSize: 22, fontWeight: "600", color: COLORS.darkBlue }}>Total Percentage</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', margin: 6 }}>
                                            <Text style={{ fontSize: 20, fontWeight: "bold", color: COLORS.darkBlue }}>{resultData ?.Scores ?.ObtainedMarks} / {resultData ?.Scores ?.TotalMarks}</Text>
                                            <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.darkBlue }}>Marks Obtained</Text>
                                        </View>
                                    </View>

                                    {/* Line Divider */}
                                    <View
                                        style={{
                                            height: 2,
                                            marginVertical: SIZES.height > 800 ? SIZES.radius : 0,
                                            marginLeft: SIZES.radius,
                                            backgroundColor: COLORS.lightGray1,
                                        }}
                                    />

                                    {/* <View style={{ padding: 8, borderWidth: 2, margin: 4, borderRadius: 6, width: 150, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontSize: 22, fontWeight: "bold", color: COLORS.darkBlue }}>17</Text>
                                            <Text style={{ fontSize: 16, fontWeight: "600", color: COLORS.darkBlue }}>Total Questions</Text>
                                        </View> */}
                                    <View style={{ marginVertical: 20, flexDirection: "row", justifyContent: "center" }}>
                                        <View style={styles.totalAnsweredContainer}>
                                            <View style={{ flexDirection: "row", marginBottom: 6 }}>
                                                <Text style={styles.totalAnswerText}>{resultData ?.Scores ?.WAcorrect}</Text>
                                                <Text style={styles.outOfText}>/ {resultData ?.Scores ?.WA}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 16, color: COLORS.white2, }}>A Weightage</Text>
                                            </View>
                                        </View>
                                        <View style={styles.totalAnsweredContainer}>
                                            <View style={{ flexDirection: "row", marginBottom: 6 }}>
                                                <Text style={styles.totalAnswerText}>{resultData ?.Scores ?.WBcorrect}</Text>
                                                <Text style={styles.outOfText}>/ {resultData ?.Scores ?.WB}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 16, color: COLORS.white2, }}>B Weightage</Text>
                                            </View>
                                        </View>
                                        <View style={styles.totalAnsweredContainer}>
                                            <View style={{ flexDirection: "row", marginBottom: 6 }}>
                                                <Text style={styles.totalAnswerText}>{resultData ?.Scores ?.WCcorrect}</Text>
                                                <Text style={styles.outOfText}>/ {resultData ?.Scores ?.WC}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 16, color: COLORS.white2, }}>C Weightage</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
            {/* </>
            )} */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#98B3B7',
        justifyContent: 'center',

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        color: COLORS.primary,
        fontSize: 20,
        fontWeight: "bold"
    },
    noteHeader: {
        backgroundColor: '#42f5aa',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    footer: {
        flex: 1,
        backgroundColor: Colors.lighter,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    textInput: {
        alignSelf: 'stretch',
        color: 'black',
        padding: 20,
        backgroundColor: '#ddd',
        borderTopWidth: 2,
        borderTopColor: '#ddd',
    },
    paragraphText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 16,
        color: "white"
    },
    radioButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    titleContainer: {
        paddingVertical: 6,
        paddingHorizontal: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
        backgroundColor: "#003A4E"
    },
    questionContainer: {
        paddingVertical: 6,
        paddingHorizontal: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6
    },
    totalAnsweredContainer: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        margin: 4,
        borderRadius: 8,
        borderColor: COLORS.lightGray1,
        backgroundColor: COLORS.primary
    },
    totalAnswerText: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.white2
    },
    outOfText: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.white2,
        alignSelf: "flex-end",
        paddingLeft: 4
    }
});


export default FeedbackScreen;
