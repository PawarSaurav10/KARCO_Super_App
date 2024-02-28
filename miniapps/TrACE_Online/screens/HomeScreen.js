import React, { useState, useEffect } from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    ScrollView,
    Alert,
    FlatList,
    BackHandler,
    Dimensions,
    Pressable,
    TouchableOpacity,
    AppState,
    Platform,
    RefreshControl,
} from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../../Constants/theme';
import CustomSearch from '../../../Components/CustomSearch';
import axios from 'axios';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import NoDataFound from '../../../Components/NoDataFound';
import GridViewCard from '../../../Components/GridViewCard';
import ListViewCard from '../../../Components/ListViewCard';
import { getURL } from "../../../baseUrl"
import HomePageLoader from '../../../Components/HomePageLoader';
import NetInfo from "@react-native-community/netinfo";
import _ from "lodash"
import images from '../../../Constants/images';
import CustomAlert from '../../../Components/CustomAlert';
import InProgressCard from '../../../Components/InProgressCard';
import RNFetchBlob from "react-native-blob-util"
import { useSelector, useDispatch } from '../../../node_modules/react-redux';
import { fetchVideoData } from '../../../store/actions/videoDtlActions';

const HomePage = (props) => {
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const windowWidth = Dimensions.get('window').width;
    const [videoData, setVideoData] = useState([])
    const [videoType, setVideoType] = useState(props.videoType ? props.videoType : "TODOLIST")
    const [isLoading, setIsLoading] = useState(true)
    const [searchedTodoVideoData, setSearchedTodoVideoData] = useState([])
    const [searchedCompVideoData, setSearchedCompVideoData] = useState([])
    const [searchedTodoVideo, setSearchedTodoVideo] = useState()
    const [searchedCompVideo, setSearchedCompVideo] = useState()
    const [orientation, setOrientation] = useState()
    const [viewAlert, setViewAlert] = useState({
        isShow: false,
        AlertType: ""
    })
    const [assessmentData, setAssessmentData] = useState(null)
    const [otpError, setOtpError] = useState()
    const l_loginReducer = useSelector((state) => state.loginReducer)

    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    useEffect(() => {
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            setOrientation(
                isPortrait() ? 'protrait' : 'landscape'
            );
        });
    }, [orientation])

    const logOut = async () => {
        await AsyncStorage.removeItem("persist:root")
        await AsyncStorage.removeItem("online_screen_visited")
        await AsyncStorage.removeItem("userData")
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        })
    }

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
                    // Alert.alert("You are online!");
                } else {
                    setViewAlert({
                        isShow: true,
                        AlertType: "Internet"
                    })
                    // Alert.alert('Oops !!', 'Your Device is not Connected to Internet, Please Check your Internet Connectivity', [
                    //     {
                    //         text: 'OK', onPress: () => {
                    //             AsyncStorage.removeItem("online_screen_visited")
                    //             AsyncStorage.removeItem("userData")
                    //             navigation.reset({
                    //                 index: 0,
                    //                 routes: [{ name: "Home" }],
                    //             })
                    //         }
                    //     },
                    // ]);
                }
            });
        }
    }

    async function fetchData() {
        if (l_loginReducer) {
            await axios.get(`${getURL.base_URL}/AppVideo/GetVideoList`, {
                params: {
                    companyId: l_loginReducer.userData ?.CompanyId,
                    username: l_loginReducer.userData ?.EmployeeId,
                    password: l_loginReducer.password,
                    CrewId: l_loginReducer.userData ?.CrewListId,
                    VesselId: l_loginReducer.userData ?.VesselId
                }
            })
                .then((res) => {
                    setVideoData(res.data)
                    setIsLoading(false)
                })
                .catch((error) => {
                    throw error
                })
        }
    }

    async function fetchOnlineAssessmentData() {
        if (l_loginReducer) {
            await axios.get(`${getURL.base_URL}/AppAssessment/GetOnlineAssessment`, {
                params: {
                    VideoId: revArray[0].Id,
                    username: l_loginReducer.userData.EmployeeId,
                    password: revArray[0].Password,
                    CrewId: l_loginReducer.userData.CrewListId,
                    VesselId: l_loginReducer.userData.VesselId
                }
            }).then((res) => {
                setAssessmentData(res.data)
                // setIsLoading(false)
            }).catch((error) => {
                throw error
            })
        }
    }

    const onRefresh = async () => {
        setIsLoading(true);
        fetchData()
    };

    useEffect(() => {
        if (l_loginReducer.error !== null) {
            setOtpError(l_loginReducer.error);
        }
    }, [l_loginReducer]);

    console.log(otpError,"otpError")

    useEffect(() => {
        console.log(l_loginReducer, "l_login");
        if (l_loginReducer.userData !== null) {
            setIsLoading(false)
            let dirs = RNFetchBlob.fs.dirs
            RNFetchBlob.fs.exists(dirs.DownloadDir + "/Documents")
                .then((exist) => {
                    if (exist !== true) {
                        RNFetchBlob.fs.mkdir(dirs.DownloadDir + "/Documents")
                    }
                })
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
            )
            fetchData()
            return () => {
                backHandler.remove();
                setVideoData([])
            }

        } else {
            setIsLoading(false)
            setViewAlert({
                isShow: true,
                AlertType: "Internet"
            })
        }

    }, [l_loginReducer])

    const CompletedList = _.sortBy(videoData && videoData.lstCompleted, ["lstCompleted"])

    useEffect(() => {
        if (searchedTodoVideo) {
            setSearchedTodoVideoData(
                videoData.lstToDo.filter((element) =>
                    element.VideoName.toLowerCase().includes(searchedTodoVideo.toLowerCase())
                )
            );
        } else {
            setSearchedTodoVideoData(videoData);
        }
        return () => {
            setSearchedTodoVideoData([]);
        };
    }, [searchedTodoVideo]);

    useEffect(() => {
        if (searchedCompVideo) {
            setSearchedCompVideoData(
                CompletedList.filter((element) =>
                    element.VideoName.toLowerCase().includes(searchedCompVideo.toLowerCase())
                )
            );
        } else {
            setSearchedCompVideoData(videoData);
        }
        return () => {
            setSearchedCompVideoData([]);
        };
    }, [searchedCompVideo]);

    const ShowContinueAssessmentSection = videoData && videoData.lstToDo && videoData.lstToDo.filter((xx) => xx.AssessmentStatus == "Continue" || xx.AssessmentStatus == "Feedback").length > 0

    let MinimumTimeLeft = videoData && videoData.lstToDo && videoData.lstToDo.filter((xx) => xx.AssessmentStatus == "Continue" || xx.AssessmentStatus == "Feedback")
    let revArray = _.reverse(MinimumTimeLeft);

    useEffect(() => {
        if (ShowContinueAssessmentSection) {
            fetchOnlineAssessmentData()
        }
    }, [revArray])

    let qusetionAnswered = assessmentData && assessmentData ?.QuestionList.length - assessmentData ?.QStatusNCount;
    let totalQuestion = assessmentData && assessmentData ?.QuestionList.length;
    let progress = (qusetionAnswered / totalQuestion)
    let percentage = progress * 100

    return (
        <View style={{ flex: 1 }}>
            {isLoading &&
                <HomePageLoader orientationType={orientation} />
            }

            {isLoading === false && (
                <View style={{ flex: 1 }}>
                    <View style={{ margin: 10, padding: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 0.8 }}>
                            <TouchableOpacity
                                style={{ marginRight: 8, justifyContent: "flex-start" }}
                                onPress={() => navigation.openDrawer()}
                            >
                                <Image source={images.menu_icon} style={{ width: 24, height: 24 }} />
                            </TouchableOpacity>
                            <Image
                                style={{
                                    height: 40,
                                    width: 40,
                                    marginRight: 6
                                }}
                                source={images.profile_icon}
                            />
                            <View style={{ marginLeft: 10, }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    color: COLORS.primary
                                }}
                                    numberOfLines={1}>
                                    Hello {l_loginReducer.userData ?.Name} !
                                        </Text>
                            </View>
                        </View>
                        {/* <View style={[styles.icon_container, styles.shadowProp]}>
                                    <Image style={styles.icon} source={NotificationIcon} />
                                </View> */}
                    </View>

                    {/* Search Input */}
                    <View style={{ margin: 8, padding: 8 }}>
                        <CustomSearch
                            label={"Search Videos"}
                            value={videoType === "TODOLIST" ? searchedTodoVideo : searchedCompVideo}
                            onChangeText={(value) => {
                                if (videoType === "TODOLIST") {
                                    setSearchedTodoVideo(value)
                                } else {
                                    setSearchedCompVideo(value)
                                }
                            }}
                        />
                    </View>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        nestedScrollEnabled={true}
                        refreshControl={
                            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                        }
                    >
                        {assessmentData != null && ShowContinueAssessmentSection && isLoading === false && (
                            <>
                                <View style={[styles.section_header_container, { marginVertical: 8 }]}>
                                    <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.primary }}>Lift-Off ! Submit your work</Text>
                                </View>
                                <InProgressCard
                                    orientationType={orientation}
                                    data={revArray[0]}
                                    VideoCategory={revArray[0].Category}
                                    VideoName={revArray[0].VideoName}
                                    remainingTime={revArray[0].TimeLeft}
                                    NoOfQuestionAnswered={qusetionAnswered}
                                    OnPress={() => {
                                        dispatch(fetchVideoData(revArray[0], revArray[0].Id, revArray[0].Password))
                                        if (revArray[0].AssessmentStatus === "Feedback") {
                                            navigation.replace("Feedback Form")
                                        } else {
                                            navigation.replace("AssessmentNew")
                                        }
                                    }}
                                    Percentage={percentage}
                                    TotalQuestion={totalQuestion}
                                />
                            </>
                        )}

                        <View style={{ margin: 4, padding: 8, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Pressable
                                style={[videoType == "TODOLIST" ? styles.active_circle_button : styles.circle_button, {
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 6,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 6,
                                    elevation: 5,
                                }]}
                                onPress={() => {
                                    setVideoType("TODOLIST")
                                    setSearchedCompVideo("")
                                }}>
                                <View style={{ marginRight: 4 }}>
                                    <Image source={images.to_do_list_icon} style={{ height: 22, width: 22, }} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>To Do List</Text>
                                </View>
                            </Pressable>
                            <Pressable
                                style={[videoType == "COMPLIST" ? styles.active_circle_button : styles.circle_button, {
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 6,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 6,
                                    elevation: 5,
                                }]}
                                onPress={() => {
                                    setVideoType("COMPLIST")
                                    setSearchedTodoVideo("")
                                }}>
                                <Image source={images.completed_icon} style={{ height: 22, width: 22, marginRight: 4 }} />
                                <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>Completed List</Text>
                            </Pressable>
                        </View>

                        <View>
                            {videoType == "TODOLIST" &&
                                <View style={styles.section_header_container}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.darkBlue }}>New Added</Text>
                                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => {
                                        navigation.navigate("View All", { data: videoData && videoData.lstToDo, listType: "Todo", orientationType: orientation })
                                    }}>
                                        <Text style={{ fontSize: 14, marginRight: 4, color: COLORS.primary, fontWeight: "600" }}>View All</Text>
                                    </TouchableOpacity>
                                </View>
                            }

                            {videoType == "TODOLIST" &&
                                <ScrollView
                                    nestedScrollEnabled={true}
                                    horizontal={ShowContinueAssessmentSection ? true : false}
                                    contentInsetAdjustmentBehavior="automatic"
                                    showsHorizontalScrollIndicator={false}
                                    style={{ flex: 1, width: windowWidth }}
                                >
                                    <View>
                                        {!searchedTodoVideo &&
                                            <FlatList
                                                key={orientation === "landscape" ? 4 : 2}
                                                nestedScrollEnabled={true}
                                                scrollEnabled={false}
                                                horizontal={ShowContinueAssessmentSection ? true : false}
                                                numColumns={ShowContinueAssessmentSection ? 0 : (orientation === "landscape" ? 4 : 2)}
                                                data={videoType == "TODOLIST" || videoType == "" ? videoData && videoData.lstToDo : videoData && videoData.lstCompleted}
                                                renderItem={({ item, index }) => (
                                                    <View key={index}>
                                                        <GridViewCard
                                                            VideoCategory={item.Category}
                                                            CourseNo={item.CourseNo}
                                                            VideoName={item.VideoName}
                                                            onPress={() => {
                                                                navigation.navigate("Video Detail", { type: "TODOLIST" })
                                                                dispatch(fetchVideoData(item, item.Id, item.Password))
                                                            }}
                                                            Status={item.AssessmentStatus}
                                                            PosterImage={item.PosterPath}
                                                            orientationType={orientation}
                                                        />
                                                    </View>
                                                )}
                                                keyExtractor={item => item.Id}
                                                style={{ margin: 4, padding: 4, flexDirection: "row" }}
                                                showsHorizontalScrollIndicator={false}
                                            // extraData={videoType}
                                            />
                                        }

                                        {videoType == "TODOLIST" && searchedTodoVideo && searchedTodoVideoData && searchedTodoVideoData.length > 0 &&
                                            <FlatList
                                                key={orientation === "landscape" ? 4 : 2}
                                                nestedScrollEnabled={true}
                                                scrollEnabled={false}
                                                horizontal={ShowContinueAssessmentSection ? true : false}
                                                numColumns={ShowContinueAssessmentSection ? 0 : (orientation === "landscape" ? 4 : 2)}
                                                data={searchedTodoVideoData}
                                                renderItem={({ item, index }) => (
                                                    <View key={index}>
                                                        <GridViewCard
                                                            VideoCategory={item.Category}
                                                            CourseNo={item.CourseNo}
                                                            VideoName={item.VideoName}
                                                            onPress={() => {
                                                                navigation.navigate("Video Detail", { type: "TODOLIST" })
                                                                dispatch(fetchVideoData(item, item.Id, item.Password))
                                                            }}
                                                            Status={item.AssessmentStatus}
                                                            PosterImage={item.PosterPath}
                                                            orientationType={orientation}
                                                        />
                                                    </View>
                                                )}
                                                keyExtractor={item => item.Id}
                                                style={{ margin: 4, padding: 4, flexDirection: "row" }}
                                                showsHorizontalScrollIndicator={false}
                                            />
                                        }

                                        {videoType == "TODOLIST" && searchedTodoVideo && searchedTodoVideoData && searchedTodoVideoData.length == 0 &&
                                            <View style={{ width: windowWidth, margin: 4, padding: 8 }}>
                                                <NoDataFound title={"No Data Found"} desc="Try searching for something else or try with a different spelling" imageType="searchData" />
                                            </View>
                                        }

                                        {videoType == "TODOLIST" && videoData && videoData.lstToDo && videoData.lstToDo.length == 0 &&
                                            <View style={{ width: windowWidth, margin: 4, padding: 8 }}>
                                                <NoDataFound title={"No Data Available"} desc="No videos have assissgned for you or you have completed all assessment." imageType="NoData" />
                                            </View>
                                        }
                                    </View>
                                </ScrollView>
                            }

                            {videoType == "COMPLIST" &&
                                // <ScrollView
                                //     nestedScrollEnabled={true}
                                //     contentInsetAdjustmentBehavior="automatic"
                                //     showsHorizontalScrollIndicator={false}
                                //     style={{ flex: 1, width: windowWidth, flexDirection: "row" }}>
                                <View style={{ flex: 1 }}>
                                    {!searchedCompVideo &&
                                        <FlatList
                                            key={orientation === "landscape" ? 4 : 2}
                                            nestedScrollEnabled={true}
                                            scrollEnabled={false}
                                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                                            numColumns={orientation === "landscape" ? 4 : 2}
                                            data={CompletedList}
                                            renderItem={({ item, index }) => (
                                                <View key={index}>
                                                    <GridViewCard
                                                        isVideoCompleted={true}
                                                        Status={item.AssessmentStatus}
                                                        VideoCategory={item.Category}
                                                        CourseNo={item.CourseNo}
                                                        VideoName={item.VideoName}
                                                        onPress={() => {
                                                            navigation.navigate("Video Detail", { type: "COMPLIST" })
                                                            dispatch(fetchVideoData(item, item.Id, item.Password))
                                                        }}
                                                        orientationType={orientation}
                                                        PosterImage={item.PosterPath}
                                                    />
                                                </View>
                                            )}
                                            keyExtractor={item => item.Id}
                                            style={{ margin: 4, padding: 4, flexDirection: "row" }}
                                        // extraData={videoType}
                                        />
                                    }

                                    {videoType == "COMPLIST" && searchedCompVideo && searchedCompVideoData && searchedCompVideoData.length > 0 &&
                                        <FlatList
                                            key={orientation === "landscape" ? 4 : 2}
                                            nestedScrollEnabled={true}
                                            scrollEnabled={false}
                                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                                            numColumns={orientation === "landscape" ? 4 : 2}
                                            data={searchedCompVideoData}
                                            renderItem={({ item, index }) => (
                                                <View key={index}>
                                                    <GridViewCard
                                                        isVideoCompleted={true}
                                                        Status={item.AssessmentStatus}
                                                        VideoCategory={item.Category}
                                                        CourseNo={item.CourseNo}
                                                        VideoName={item.VideoName}
                                                        onPress={() => {
                                                            navigation.navigate("Video Detail", { type: "COMPLIST" })
                                                            dispatch(fetchVideoData(item, item.Id, item.Password))
                                                        }}
                                                        orientationType={orientation}
                                                        PosterImage={item.PosterPath}
                                                    />
                                                </View>
                                            )}
                                            keyExtractor={item => item.Id}
                                            style={{ margin: 4, padding: 4, flexDirection: "row" }}
                                        />
                                    }

                                    {videoType == "COMPLIST" && searchedCompVideo && searchedCompVideoData && searchedCompVideoData.length == 0 &&
                                        <View style={{ width: windowWidth, margin: 4, padding: 8 }}>
                                            <NoDataFound title={"No Data Found"} desc="Try searching for something else or try with a different spelling" imageType="searchData" />
                                        </View>
                                    }

                                    {videoType == "COMPLIST" && CompletedList && CompletedList.length == 0 &&
                                        <View style={{ width: windowWidth, margin: 4, padding: 8 }}>
                                            <NoDataFound title={"No Data Available"} desc="You had not completed any videos yet." imageType="NoData" />
                                        </View>
                                    }
                                </View>
                                // </ScrollView>
                            }

                            {videoType == "TODOLIST" && (
                                <>
                                    {ShowContinueAssessmentSection && (
                                        <View style={styles.section_header_container}>
                                            <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.darkBlue }}>Continue Assessment</Text>
                                            <TouchableOpacity
                                                style={{ flexDirection: "row", alignItems: "center" }}
                                                onPress={() => {
                                                    navigation.navigate("View All", { data: videoData && videoData.lstToDo && videoData.lstToDo.filter((xx) => xx.AssessmentStatus == "Continue" || xx.AssessmentStatus == "Feedback"), listType: "Cont" })
                                                }}>
                                                <Text style={{ fontSize: 14, marginRight: 4, color: COLORS.primary, fontWeight: "600" }}>View All</Text>
                                                {/* <Image style={{ height: 12, width: 12 }} source={ForwardArrowIcon} /> */}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    <View style={{ margin: 4, padding: 8, }}>
                                        {videoData && videoData.lstToDo && videoData.lstToDo.filter((xx) => xx.AssessmentStatus == "Continue" || xx.AssessmentStatus == "Feedback").map((xx, idx) => {
                                            return (
                                                <View key={idx}>
                                                    <ListViewCard
                                                        VideoCategory={xx.Category}
                                                        VideoName={xx.VideoName}
                                                        TimeLeft={xx.TimeLeft}
                                                        CourseNo={xx.CourseNo}
                                                        PosterImage={xx.PosterPath}
                                                        onPress={() => {
                                                            navigation.navigate("Video Detail")
                                                            dispatch(fetchVideoData(xx, xx.Id, xx.Password))
                                                        }} />
                                                </View>
                                            )
                                        })}
                                    </View>
                                </>
                            )}

                        </View>
                    </ScrollView>
                    {viewAlert.isShow && (
                        <CustomAlert
                            isView={viewAlert.isShow}
                            Title={viewAlert.AlertType === "Internet" ? "Oops !!" : "Hold on!"}
                            Content={viewAlert.AlertType === "Internet" ? "Your Device is not Connected to Internet, Please Check your Internet Connectivity" : "Are you sure you want to exit App you will get logout of the App?"}
                            buttonContainerStyle={{
                                flexDirection: "row",
                                justifyContent: "flex-end"
                            }}
                            ButtonsToShow={[
                                {
                                    text: "CANCEL",
                                    onPress: () => {
                                        setViewAlert({
                                            isShow: false,
                                            AlertType: ""
                                        })
                                    },
                                    toShow: viewAlert.AlertType !== "Internet" ? true : false
                                },
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        if (viewAlert.AlertType === "Internet") {
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: "Login" }],
                                            })
                                        } else {
                                            logOut()
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
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    video_card_container: {
        margin: 6,
        padding: 10,
        borderRadius: 12,
        backgroundColor: COLORS.white2,
        width: Dimensions.get('window').width / 2.2,
        display: 'flex',
        flexDirection: "column"
    },
    circle_button: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderColor: COLORS.lightGray1,
        borderWidth: 1,
        backgroundColor: COLORS.white2,
        margin: 4,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    active_circle_button: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderColor: COLORS.lightBlue,
        borderWidth: 1,
        backgroundColor: COLORS.lightBlue2,
        margin: 4,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    section_header_container: {
        marginHorizontal: 10,
        paddingHorizontal: 8,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
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

    //  Tour guide changes in style.js of tourgide node module
    tooltipText: {
        textAlign: 'center',
        fontWeight: "600",
        fontSize: 14,
        color: "#004C6B"
    },
    tooltipContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '80%',
    },
    button: {
        backgroundColor: "#004C6B",
        paddingHorizontal: 14,
        paddingVertical: 10,
        margin: 10,
        borderRadius: 6
    },
    buttonText: {
        color: 'white',
        fontWeight: "700"
    },
})

export default HomePage
