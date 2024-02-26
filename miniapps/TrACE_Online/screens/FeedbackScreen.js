import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, ScrollView, Image, Alert, BackHandler, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
// import CheckBox from '@react-native-community/checkbox';
import { Rating } from 'react-native-ratings';
import CustomInput from "../../../Components/CustomInput"
import CustomIconButton from '../../../Components/CustomIconButton';
import { COLORS, SIZES } from '../../../Constants/theme';
import axios from 'axios';
import { getUserData_1 } from "../../../Utils/getScreenVisisted"
import { useIsFocused } from '@react-navigation/native';
import { getURL } from "../../../baseUrl"
import { Colors } from 'react-native/Libraries/NewAppScreen';
import CustomButton from '../../../Components/CustomButton';
import NetInfo from "@react-native-community/netinfo";
import images from '../../../Constants/images';
import CustomAlert from '../../../Components/CustomAlert';
import CustomRadioButton from '../../../Components/CustomRadioButton';

const FeedbackScreen = ({ navigation, route }) => {
    const isFocused = useIsFocused();
    const [viewWarnings, setViewWarnings] = useState(false)
    const [viewWarningsImp, setViewWarningsImp] = useState(false)
    const [viewAlert, setViewAlert] = useState({
        isShow: false,
        AlertType: ""
    })
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
    const [resultData, setResultData] = useState(null)
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [orientation, setOrientation] = useState()
    const [viewRef, setViewRef] = useState(null);
    const [percentage, setPercentage] = useState(0)
    const l_loginReducer = useSelector(state => state.loginReducer)

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

    async function fetchResultData() {
        CheckConnectivity()
        if (l_loginReducer.userData.EmployeeId) {
            await axios.get(`${getURL.base_URL}/AppFeedback/GetOnlineFeedback`, {
                params: {
                    VideoId: route.params.Id,
                    username: l_loginReducer.userData.EmployeeId,
                    password: route.params.videoPassword,
                    CrewId: l_loginReducer.userData.CrewListId,
                    VesselId: l_loginReducer.userData.VesselId,
                }
            })
                .then((res) => {
                    setResultData(res.data)
                    setPercentage(100 * res.data ?.Scores ?.ObtainedMarks) / res.data ?.Scores ?.TotalMarks;
                })
                .catch((error) => {
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
    }, [l_loginReducer, isFocused])

    function validateString(string) {
        let strRegex = new RegExp(/^[a-zA-Z0-9\(\)\-\]\[\?\.\,\!\s*]*$/);
        let result = strRegex.test(string);
        if (result === true) {
            setViewWarnings(false)
        } else {
            setViewWarnings(true)
        }
    }

    function validateString1(string) {
        let strRegex = new RegExp(/^[a-zA-Z0-9\(\)\-\]\[\?\.\,\!\s*]*$/);
        let result = strRegex.test(string);
        if (result) {
            setViewWarningsImp(false)
        } else {
            setViewWarningsImp(true)
        }
    }

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
            CBTOverAll: tempData.CBTOverAll === "" ? 4 : tempData.CBTOverAll,
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
        if (
            (viewWarningsImp === false && viewWarnings === false) &&
            // (tempData.CBTOverAll != "") &&
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
                axios.get(`${getURL.base_URL}/AppFeedback/SaveFeedbackActivity?FeedbackData=${JSON.stringify(tempSaveData)}&VideoId=${route.params.Id}&username=${l_loginReducer.userData.EmployeeId}&password=${route.params.videoPassword}&CrewId=${l_loginReducer.userData.CrewListId}&VesselId=${l_loginReducer.userData.VesselId}&CompanyId=${l_loginReducer.userData.CompanyId}`)
                    .then((res) => {
                        if (res.status === 200) {
                            setViewAlert({
                                isShow: true,
                                AlertType: "Success"
                            })
                        }
                    }).catch((error) => {
                        throw error
                    })
            } catch (error) {
                console.error(`Error received ${JSON.stringify(err)}`);
            }
        } else {
            if (viewWarningsImp === false && viewWarnings === false) {
                setViewAlert({
                    isShow: true,
                    AlertType: "Mandatory"
                })
            } else {
                setViewAlert({
                    isShow: true,
                    AlertType: "Characters"
                })
            }
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ padding: 8, justifyContent: "center", backgroundColor: COLORS.white2 }}>
                    <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, flex: 1 }}>
                            <TouchableOpacity
                                style={{ justifyContent: "flex-start", padding: 6, marginHorizontal: 12, flex: 0.04 }}
                                onPress={() => backAction()}
                            >
                                <Image source={images.left_arrow_icon} style={{ width: 20, height: 20 }} tintColor="black" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.9, justifyContent: "center", alignItems: "center" }}>
                                <View style={{ paddingHorizontal: 6, paddingVertical: 4, backgroundColor: "red" }}>
                                    <Text style={{ fontSize: 16, color: COLORS.white, textTransform: "uppercase" }}>Feedback Form</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.paragraphText}>In Order to Successfully 'Complete' this assessment, you are required to fill the feedback form.</Text>
                        <Text style={styles.paragraphText}>This form is for you to provide us with an assessment of the course you have attended.</Text>
                        <Text style={styles.paragraphText}>Your feedback regarding the course will assist us in identifying improvement opportunities.</Text>
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={{ textTransform: "uppercase", fontSize: 18, color: COLORS.white, fontWeight: "700" }}>Presentation</Text>
                        <Image source={images.raters_icon} style={{ width: 140, height: 60, objectFit: "fill" }} />
                        {/* <View style={{ flexDirection: "row" }}>
                            <Text style={{ color: "#ff0000", fontWeight: "700", margin: 4, fontSize: 12 }}>NA</Text>
                            <Text style={{ color: "#ff8f00", fontWeight: "700", margin: 4, fontSize: 12  }}>Un-acc</Text>
                            <Text style={{ color: "#edc900", fontWeight: "700", margin: 4, fontSize: 12  }}>Poor</Text>
                            <Text style={{ color: "#489b00", fontWeight: "700", margin: 4, fontSize: 12  }}>Good</Text>
                            <Text style={{ color: "#00b569", fontWeight: "700", margin: 4, fontSize: 12  }}>Exce</Text>
                        </View> */}
                    </View>
                    <View>
                        {presentationFormdata.map((xx, idx) => {
                            return (
                                <View key={idx} style={styles.questionContainer}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ color: COLORS.primary, fontWeight: "700" }}>{idx + 1}. {xx.title} </Text><Text style={{ color: "red" }}>*</Text>
                                    </View>

                                    <View style={styles.radioButtonContainer}>

                                        <CustomRadioButton
                                            selected={xx.isNA}
                                            onPress={() => {
                                                let tempData = [...presentationFormdata];
                                                let tempIndex = presentationFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isNA = true;
                                                tempData[tempIndex].isUnacceptable = false;
                                                tempData[tempIndex].isPoor = false;
                                                tempData[tempIndex].isGood = false;
                                                tempData[tempIndex].isExcellent = false;
                                                setPresentationFormData(tempData);
                                            }}
                                        />

                                        <CustomRadioButton
                                            selected={xx.isUnacceptable}
                                            onPress={() => {
                                                let tempData = [...presentationFormdata];
                                                let tempIndex = presentationFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isNA = false;
                                                tempData[tempIndex].isUnacceptable = true;
                                                tempData[tempIndex].isPoor = false;
                                                tempData[tempIndex].isGood = false;
                                                tempData[tempIndex].isExcellent = false;
                                                setPresentationFormData(tempData);
                                            }}
                                        />
                                        <CustomRadioButton
                                            selected={xx.isPoor}
                                            onPress={() => {
                                                let tempData = [...presentationFormdata];
                                                let tempIndex = presentationFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isNA = false;
                                                tempData[tempIndex].isUnacceptable = false;
                                                tempData[tempIndex].isPoor = true;
                                                tempData[tempIndex].isGood = false;
                                                tempData[tempIndex].isExcellent = false;
                                                setPresentationFormData(tempData);
                                            }}
                                        />
                                        <CustomRadioButton
                                            selected={xx.isGood}
                                            onPress={() => {
                                                let tempData = [...presentationFormdata];
                                                let tempIndex = presentationFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isNA = false;
                                                tempData[tempIndex].isUnacceptable = false;
                                                tempData[tempIndex].isPoor = false;
                                                tempData[tempIndex].isGood = true;
                                                tempData[tempIndex].isExcellent = false;
                                                setPresentationFormData(tempData);
                                            }}
                                        />
                                        <CustomRadioButton
                                            selected={xx.isExcellent}
                                            onPress={() => {
                                                let tempData = [...presentationFormdata];
                                                let tempIndex = presentationFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isNA = false;
                                                tempData[tempIndex].isUnacceptable = false;
                                                tempData[tempIndex].isPoor = false;
                                                tempData[tempIndex].isGood = false;
                                                tempData[tempIndex].isExcellent = true;
                                                setPresentationFormData(tempData);
                                            }}
                                        />
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={{ textTransform: "uppercase", fontSize: 18, color: COLORS.white, fontWeight: "700" }}>Course Objective</Text>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ color: "#ff0000", margin: 6, fontWeight: "700", fontSize: 12 }}>No</Text>
                            <Text style={{ color: "#00b569", margin: 6, fontWeight: "700", fontSize: 12 }}>Yes</Text>
                            {/* <Image source={images.raters3_icon} style={{ width: 50, height: 30, objectFit: "fill" }} /> */}
                        </View>
                    </View>
                    <View>
                        {courseObjtFormData.map((xx, idx) => {
                            return (
                                <View key={idx} style={styles.questionContainer}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ width: 220, color: COLORS.primary, fontWeight: "700" }}>{idx + 1}. {xx.title} </Text><Text style={{ color: "red" }}>*</Text>
                                    </View>
                                    <View style={styles.radioButtonContainer}>
                                        <CustomRadioButton
                                            selected={xx.No}
                                            onPress={() => {
                                                let tempData = [...courseObjtFormData];
                                                let tempIndex = courseObjtFormData.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].No = true;
                                                tempData[tempIndex].Yes = false;
                                                setCourseObjtFormData(tempData);
                                            }}
                                        />
                                        <CustomRadioButton
                                            selected={xx.Yes}
                                            onPress={() => {
                                                let tempData = [...courseObjtFormData];
                                                let tempIndex = courseObjtFormData.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].No = false;
                                                tempData[tempIndex].Yes = true;
                                                setCourseObjtFormData(tempData);
                                            }}
                                        />
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={{ textTransform: "uppercase", fontSize: 18, color: COLORS.white, fontWeight: "700" }}>Course Content</Text>
                        <Image source={images.raters2_icon} style={{ width: 100, height: 60, objectFit: "fill" }} />
                        {/* <View style={{ flexDirection: "row" }}>
                            <Text style={{ color: "#ff0000", fontWeight: "700", margin: 4, fontSize: 12 }}>In-ad</Text>
                            <Text style={{ color: "#edc900", fontWeight: "700", margin: 4, fontSize: 12  }}>Adeq</Text>
                            <Text style={{ color: "#00b569", fontWeight: "700", margin: 4, fontSize: 12  }}>Exce</Text>
                        </View> */}
                    </View>
                    <View>
                        {courseFormdata.map((xx, idx) => {
                            return (
                                <View key={idx} style={styles.questionContainer}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ color: COLORS.primary, fontWeight: "700" }}>{idx + 1}. {xx.title} </Text><Text style={{ color: "red" }}>*</Text>
                                    </View>
                                    <View style={styles.radioButtonContainer}>
                                        <CustomRadioButton
                                            selected={xx.isInadequate}
                                            onPress={() => {
                                                let tempData = [...courseFormdata];
                                                let tempIndex = courseFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isInadequate = true;
                                                tempData[tempIndex].isAdequate = false;
                                                tempData[tempIndex].isExcessive = false;
                                                setCourseFormData(tempData);
                                            }}
                                        />
                                        <CustomRadioButton
                                            selected={xx.isAdequate}
                                            onPress={() => {
                                                let tempData = [...courseFormdata];
                                                let tempIndex = courseFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isInadequate = false;
                                                tempData[tempIndex].isAdequate = true;
                                                tempData[tempIndex].isExcessive = false;
                                                setCourseFormData(tempData);
                                            }}
                                        />
                                        <CustomRadioButton
                                            selected={xx.isExcessive}
                                            onPress={() => {
                                                let tempData = [...courseFormdata];
                                                let tempIndex = courseFormdata.findIndex(
                                                    (aa) => aa.key === xx.key
                                                );
                                                tempData[tempIndex].isInadequate = false;
                                                tempData[tempIndex].isAdequate = false;
                                                tempData[tempIndex].isExcessive = true;
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
                            <Text style={{ textTransform: "uppercase", fontSize: 18, color: COLORS.white, fontWeight: "700" }}>Suggestions </Text>
                            <Text style={{ fontSize: 16, color: COLORS.white, }}>(Optional)</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{ paddingVertical: 6, paddingHorizontal: 4, marginBottom: 6 }}>
                            <Text style={{ color: COLORS.primary, fontWeight: "700" }}>1. What was the most relevant part of the course ? </Text>
                            <CustomInput inputType={"Feedback"} value={feedbackFormData.Relevant_Part_Dtl} textColor={COLORS.primary} onChangeText={(value) => {
                                validateString(value);
                                setFeedbackFormData({ ...feedbackFormData, Relevant_Part_Dtl: value === null ? "" : value })
                                // setViewWarnings(false) 
                            }} />
                            {
                                feedbackFormData.Relevant_Part_Dtl !== "" && viewWarnings === true &&
                                <Text style={{ color: "red", fontSize: 12, fontWeight: "bold" }}>Must Contains Aplhanumeric charcters eg:a-z A-Z 0-9 () - ? . , ! * []</Text>
                            }
                        </View>
                        <View style={{ paddingVertical: 6, paddingHorizontal: 4, marginBottom: 6, }}>
                            <Text style={{ color: COLORS.primary, fontWeight: "700" }}>2. Which part might be improved and why ? </Text>
                            <CustomInput inputType={"Feedback"} inputMode={"text"} value={feedbackFormData.Improvement_Dtl} textColor={COLORS.primary} onChangeText={(value) => {
                                validateString1(value);
                                setFeedbackFormData({ ...feedbackFormData, Improvement_Dtl: value === null ? "" : value })
                                setViewWarningsImp(false)
                            }} />
                            {
                                feedbackFormData.Improvement_Dtl !== "" && viewWarningsImp === true &&
                                <Text style={{ color: "#c43a31", fontSize: 12, fontWeight: "bold" }}>Must Contains Aplhanumeric charcters eg:a-z A-Z 0-9 () - ? . , ! * []</Text>
                            }
                        </View>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={{ textTransform: "uppercase", fontSize: 18, color: COLORS.white, fontWeight: "700" }}>Overall Rating</Text>
                    </View>
                    <View>
                        <View style={{ paddingVertical: 6, paddingHorizontal: 4, marginBottom: 6 }}>
                            <Text style={{ color: COLORS.primary, fontWeight: "700" }}>
                                Please provide an overall rating based on your experience of using and learning this module on this platform.
                                {/* <Text style={{ color: "red" }}>*</Text> */}
                            </Text>
                        </View>
                        <View style={{ paddingVertical: 6, paddingHorizontal: 4, marginBottom: 6 }}>
                            <Rating
                                startingValue={4}
                                minValue={0}
                                type='star'
                                ratingCount={5}
                                imageSize={24}
                                // tintColor="#004C6B"
                                // style={{ paddingVertical: 10, backgroundColor: "#004C6B" }}
                                onFinishRating={(ratingData) => setRating(ratingData)}
                            />
                        </View>
                    </View>
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
                            setViewRef(true)
                        }}
                        labelStyle={{ color: COLORS.primary, fontSize: 14, textTransform: "uppercase", borderBottomWidth: 2, borderBottomColor: COLORS.primary }}
                    />
                    <CustomIconButton
                        label={"SUBMIT"}
                        containerStyle={{
                            backgroundColor: COLORS.primary,
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
                        labelStyle={{ color: COLORS.white2 }}
                        icon={images.submit_icon}
                        iconStyle={{
                            marginRight: 10
                        }}
                    />
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
                        {/* <BlurView
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
                            blurRadius={1}
                            overlayColor={'rgba(0,0,0,0.6)'}
                        /> */}
                        <View style={{
                            maxHeight: "85%",
                            // height: orientation === "landscape" ? "85%" : '40%',
                            marginTop: 'auto',
                        }}>
                            <ScrollView>
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
                                            <Image source={images.close_icon} style={{ width: 16, height: 16 }} />
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
                                                    color: percentage > 70 ? "green"
                                                        : percentage > 50 ? "#edc700"
                                                            : percentage < 50 ? "red"
                                                                : "red"
                                                }}>
                                                    {parseFloat(percentage).toFixed(0)}%
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
                                        <View style={{ marginVertical: 20, flexDirection: "row", justifyContent: "center" }}>
                                            <View style={[styles.totalAnsweredContainer, { backgroundColor: "#ff0000" }]}>
                                                <View style={{ flexDirection: "row", marginBottom: 6 }}>
                                                    <Text style={styles.totalAnswerText}>{resultData ?.Scores ?.WAcorrect}</Text>
                                                    <Text style={styles.outOfText}>/ {resultData ?.Scores ?.WA}</Text>
                                                </View>
                                                <View>
                                                    <Text style={{ fontSize: 16, color: COLORS.white2, }}>A Weightage</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.totalAnsweredContainer, { backgroundColor: "#ff8f00" }]}>
                                                <View style={{ flexDirection: "row", marginBottom: 6 }}>
                                                    <Text style={styles.totalAnswerText}>{resultData ?.Scores ?.WBcorrect}</Text>
                                                    <Text style={styles.outOfText}>/ {resultData ?.Scores ?.WB}</Text>
                                                </View>
                                                <View>
                                                    <Text style={{ fontSize: 16, color: COLORS.white2, }}>B Weightage</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.totalAnsweredContainer, { backgroundColor: "#ffd500" }]}>
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
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                {viewAlert.isShow && (
                    <CustomAlert
                        isView={viewAlert.isShow}
                        Title={viewAlert.AlertType === "Internet" ? "Oops !!" : viewAlert.AlertType === "onBack" ? "Hold on!" : viewAlert.AlertType === "Success" ? "Success!" : "Warning!"}
                        Content={viewAlert.AlertType === "Internet" ?
                            "Your Device is not Connected to Internet, Please Check your Internet Connectivity"
                            : viewAlert.AlertType === "onBack" ? "Are you sure you want to go back?"
                                : viewAlert.AlertType === "Success" ? "Thank you for providing your feedback"
                                    : viewAlert.AlertType === "Mandatory" ? "Fields with * mark are Mandatory"
                                        : viewAlert.AlertType === "Characters" ? "Text Field must not Contains Special Characters"
                                            : ""}
                        buttonContainerStyle={{
                            flexDirection: "row",
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
                                    } else if (viewAlert.AlertType === "onBack" || viewAlert.AlertType === "Success") {
                                        navigation.replace("Online_Home")
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
    )
}

const styles = StyleSheet.create({
    headerText: {
        color: COLORS.primary,
        fontSize: 20,
        fontWeight: "bold"
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
        color: COLORS.primary,
        fontWeight: "700"
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
        backgroundColor: "#003A4E",
        borderRadius: 4
        // backgroundColor: "#f5f5f5"
        // backgroundColor: COLORS.lightGray1
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
        // backgroundColor: COLORS.primary
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
