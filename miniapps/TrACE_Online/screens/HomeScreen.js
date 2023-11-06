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
import AvatarImg from "../../../Images/profile.png"
import NotificationIcon from "../../../Images/notification.png"
import { COLORS } from '../../../Constants/theme';
import CustomSearch from '../../../Components/CustomSearch';
import ToDoIcon from "../../../Images/to-do-list.png"
import CompletedIcon from "../../../Images/done.png"
import { getUserData, getScreenVisited, getUserData_1, getAppLaunched, setAppLaunched } from "../../../Utils/getScreenVisisted"
import axios from 'axios';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import NoDataFound from '../../../Components/NoDataFound';
import GridViewCard from '../../../Components/GridViewCard';
import ListViewCard from '../../../Components/ListViewCard';
import MenuIcon from "../../../Images/menu.png"
import { getURL } from "../../../baseUrl"
import HomePageLoader from '../../../Components/HomePageLoader';
import { CheckConnectivity } from "../../../Utils/isInternetConnected"
// import { TourGuideZone, useTourGuideController } from 'rn-tourguide';

const HomePage = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const windowWidth = Dimensions.get('window').width;
    const [videoData, setVideoData] = useState([])
    const [videoType, setVideoType] = useState("TODOLIST")
    const [isLoading, setIsLoading] = useState(true)
    const [searchedTodoVideoData, setSearchedTodoVideoData] = useState([])
    const [searchedCompVideoData, setSearchedCompVideoData] = useState([])
    const [searchedTodoVideo, setSearchedTodoVideo] = useState()
    const [searchedCompVideo, setSearchedCompVideo] = useState()
    const [userLoginData, setUserLoginData] = useState({
        userId: null,
        password: null,
        crewId: null,
        vesselId: null,
        companyId: null
    })
    const [userData, setUserData] = useState()
    const [appLaunchedTime, setAppLaunchedTime] = useState()
    const [orientation, setOrientation] = useState()
    // const {
    //     canStart, // a boolean indicate if you can start tour guide
    //     start, // a function to start the tourguide
    //     stop, // a function  to stopping it
    //     eventEmitter, // an object for listening some events
    // } = useTourGuideController()

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

    // const onvideoSwitch

    // Can start at mount 🎉
    // you need to wait until everything is registered 😁
    // useEffect(() => {
    //     if (canStart) {
    //         getAppLaunched().then((res) => {
    //             console.log(res, "home res")
    //             if (res === null) {
    //                 start() // 👈 test if you can start otherwise nothing will happen
    //             }
    //         })
    //     }
    // }, [canStart]) // 👈 don't miss it!

    // const handleOnStart = () => console.log('start')
    // const handleOnStop = () => console.log('stop')
    // const handleOnStepChange = () => console.log(`stepChange`)

    // useEffect(() => {
    //     eventEmitter.on('start', handleOnStart)
    //     eventEmitter.on('stop', () => { // When the tour for that screen ends, navigate to the next screen if it exists.
    //         let data = null
    //         data = {
    //             code: "HOME",
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

    useEffect(() => {
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            setOrientation(
                isPortrait() ? 'portrait' : 'landscape'
            );
        });
    }, [orientation])



    const logOut = async () => {
        // await AsyncStorage.removeItem("online_screen_visited")
        await AsyncStorage.removeItem("userData")
        navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
        });
        // RNExitApp.exitApp()
    }

    const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit App you will get logout of the App?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            { text: 'YES', onPress: () => logOut() },
        ]);
        return true;
    };

    async function fetchData() {
        CheckConnectivity()
        if (userLoginData.userId !== null) {
            await axios.get(`${getURL.base_URL}/AppVideo/GetVideoList`, {
                params: {
                    companyId: userLoginData.companyId,
                    username: userLoginData.userId,
                    password: userLoginData.password,
                    CrewId: userLoginData.crewId,
                    VesselId: userLoginData.vesselId
                }
            })
                .then((res) => {
                    setVideoData(res.data)
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.log(error, "error")
                    throw error
                })
        }
    }

    const onRefresh = async () => {
        // console.log("third");
        setIsLoading(true);
        fetchData()
    };

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
                setUserData(res.userData)
                setUserLoginData({
                    userId: res.userData.EmployeeId,
                    password: res.userPassword,
                    crewId: res.userData.CrewListId,
                    vesselId: res.userData.VesselId,
                    companyId: res.userData.CompanyId
                })
            });
        }
    }, [])


    useEffect(() => {
        if (isFocused) {
            setIsLoading(true)
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            )
            fetchData()
            return () => {
                backHandler.remove();
                setVideoData([])
                setIsLoading(false)
            }
        }
    }, [userLoginData, isFocused])

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
                videoData.lstCompleted.filter((element) =>
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

    return (
        <View style={{ flex: 1 }}>
            {isLoading &&
                <HomePageLoader orientationType={orientation} />
            }

            {isLoading === false && (
                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        nestedScrollEnabled={true}
                        refreshControl={
                            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                        }
                    >
                        <View>
                            <View style={{ margin: 10, padding: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", flex: 0.8 }}>
                                    <TouchableOpacity
                                        style={{ marginRight: 8, justifyContent: "flex-start" }}
                                        onPress={() => navigation.openDrawer()}
                                    >
                                        <Image source={MenuIcon} style={{ width: 24, height: 24 }} />
                                    </TouchableOpacity>
                                    <Image
                                        style={{
                                            height: 40,
                                            width: 40,
                                            marginRight: 6
                                        }}
                                        source={AvatarImg}
                                    />
                                    <View style={{ marginLeft: 10, }}>
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: "bold",
                                            color: COLORS.primary
                                        }}
                                            numberOfLines={1}>
                                            Hello {userData.Name} !
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.icon_container, styles.shadowProp]}>
                                    <Image style={styles.icon} source={NotificationIcon} />
                                </View>
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

                            <View style={{ margin: 4, padding: 8, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                {/* <TourGuideZone text="This Button shows the list of videos todo" zone={1} maskOffset={2} borderRadius={4} style={{ flex: 1 }}> */}
                                <Pressable style={videoType == "TODOLIST" ? styles.active_circle_button : styles.circle_button}
                                    onPress={() => {
                                        setVideoType("TODOLIST")
                                        setSearchedCompVideo("")
                                    }}>
                                    <View style={{ marginRight: 4 }}>
                                        <Image source={ToDoIcon} style={{ height: 22, width: 22, }} />
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>To Do List</Text>
                                    </View>
                                </Pressable>
                                {/* </TourGuideZone> */}
                                {/* <TourGuideZone text="This Button shows the list of Completed or Expired Videos and Assessment" zone={2} maskOffset={2} borderRadius={4} style={{ flex: 1 }}> */}
                                <Pressable style={videoType == "COMPLIST" ? styles.active_circle_button : styles.circle_button}
                                    onPress={() => {
                                        setVideoType("COMPLIST")
                                        setSearchedTodoVideo("")
                                    }}>
                                    <Image source={CompletedIcon} style={{ height: 22, width: 22, marginRight: 4 }} />
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>Completed List</Text>
                                </Pressable>
                                {/* </TourGuideZone> */}
                            </View>

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
                                                    // <TourGuideZone isTourGuide={index === 0 ? true : false} text="Click on this cards to view video and take Assessment of that particular video." zone={3} maskOffset={2} borderRadius={4} tooltipBottomOffset={30}>
                                                    <View>
                                                        <GridViewCard
                                                            VideoCategory={item.Category}
                                                            CourseNo={item.CourseNo}
                                                            VideoName={item.VideoName}
                                                            onPress={() => navigation.navigate("Video Detail", item)}
                                                            Status={item.AssessmentStatus}
                                                            PosterImage={item.PosterPath}
                                                            orientationType={orientation}
                                                        />
                                                    </View>
                                                    // </TourGuideZone>

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
                                                    <GridViewCard
                                                        VideoCategory={item.Category}
                                                        CourseNo={item.CourseNo}
                                                        VideoName={item.VideoName}
                                                        onPress={() => navigation.navigate("Video Detail", item)}
                                                        Status={item.AssessmentStatus}
                                                        orientationType={orientation}
                                                    />
                                                )}
                                                keyExtractor={item => item.Id}
                                                style={{ margin: 4, padding: 4, flexDirection: "row" }}
                                                showsHorizontalScrollIndicator={false}
                                            />
                                        }
                                        {videoType == "TODOLIST" && searchedTodoVideo && searchedTodoVideoData && searchedTodoVideoData.length == 0 &&
                                            <View style={{ width: windowWidth, margin: 4, padding: 8 }}>
                                                <NoDataFound />
                                            </View>
                                        }
                                    </View>
                                </ScrollView>
                            }

                            {videoType == "COMPLIST" &&
                                <ScrollView
                                    nestedScrollEnabled={true}
                                    contentInsetAdjustmentBehavior="automatic"
                                    showsHorizontalScrollIndicator={false}
                                    style={{ flex: 1, width: windowWidth, flexDirection: "row" }}>
                                    <View style={{ flex: 1 }}>
                                        {!searchedCompVideo &&
                                            <FlatList
                                                key={orientation === "landscape" ? 4 : 2}
                                                nestedScrollEnabled={true}
                                                scrollEnabled={false}
                                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                                numColumns={orientation === "landscape" ? 4 : 2}
                                                data={videoType == "COMPLIST" ? videoData && videoData.lstCompleted : videoData && videoData.lstToDo}
                                                renderItem={({ item, index }) => (
                                                    <GridViewCard
                                                        isVideoCompleted={true}
                                                        Status={item.AssessmentStatus}
                                                        VideoCategory={item.Category}
                                                        CourseNo={item.CourseNo}
                                                        VideoName={item.VideoName}
                                                        onPress={() => navigation.navigate("Video Detail", item)}
                                                        orientationType={orientation}
                                                    />
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
                                                    <GridViewCard
                                                        isVideoCompleted={true}
                                                        Status={item.AssessmentStatus}
                                                        VideoCategory={item.Category}
                                                        CourseNo={item.CourseNo}
                                                        VideoName={item.VideoName}
                                                        onPress={() => navigation.navigate("Video Detail", item)}
                                                        orientationType={orientation}
                                                    />
                                                )}
                                                keyExtractor={item => item.Id}
                                                style={{ margin: 4, padding: 4, flexDirection: "row" }}
                                            />
                                        }
                                        {videoType == "COMPLIST" && searchedCompVideo && searchedCompVideoData && searchedCompVideoData.length == 0 &&
                                            <View style={{ width: windowWidth, margin: 4, padding: 8 }}>
                                                <NoDataFound />
                                            </View>
                                        }
                                    </View>
                                </ScrollView>
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
                                                        onPress={() => {
                                                            navigation.navigate("Video Detail", xx)
                                                        }} />
                                                </View>
                                            )
                                        })}
                                    </View>
                                </>
                            )}
                        </View>
                    </ScrollView>
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
    rowContainer: {
        flex: 1,
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    rowTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        padding: 10,
        backgroundColor: '#f2f2f2',
        marginRight: 10,
        borderRadius: 5,
    },
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
})

export default HomePage
