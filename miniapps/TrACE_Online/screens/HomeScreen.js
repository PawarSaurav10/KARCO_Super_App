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
import { getUserData, getScreenVisited, getUserData_1, getAppLaunched, setAppLaunched } from "../../../Utils/getScreenVisisted"
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

const HomePage = (props) => {
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
    const [userLoginData, setUserLoginData] = useState({
        userId: null,
        password: null,
        crewId: null,
        vesselId: null,
        companyId: null
    })
    const [userData, setUserData] = useState()
    const [orientation, setOrientation] = useState()

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

    const logOut = async () => {
        await AsyncStorage.removeItem("online_screen_visited")
        await AsyncStorage.removeItem("userData")
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        })
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

    const CheckConnectivity = () => {
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.fetch().then(xx => {
                if (xx.isConnected) {
                    // Alert.alert("You are online!");
                } else {
                    Alert.alert('Oops !!', 'Your Device is not Connected to Internet, Please Check your Internet Connectivity', [
                        {
                            text: 'OK', onPress: () => {
                                AsyncStorage.removeItem("online_screen_visited")
                                AsyncStorage.removeItem("userData")
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: "Home" }],
                                })
                            }
                        },
                    ]);
                }
            });
        }
    }

    async function fetchData() {
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
                    throw error
                })
        }
    }

    const onRefresh = async () => {
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
                setIsLoading(false)
            }
        }
    }, [userLoginData, isFocused])

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
                                    Hello {userData.Name} !
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
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        nestedScrollEnabled={true}
                        refreshControl={
                            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                        }
                    >
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
                                                            onPress={() => navigation.navigate("Video Detail", { item: item, type: "TODOLIST" })}
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
                                                            onPress={() => navigation.navigate("Video Detail", { item: item, type: "TODOLIST" })}
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
                                                data={CompletedList}
                                                renderItem={({ item, index }) => (
                                                    <View key={index}>
                                                        <GridViewCard
                                                            isVideoCompleted={true}
                                                            Status={item.AssessmentStatus}
                                                            VideoCategory={item.Category}
                                                            CourseNo={item.CourseNo}
                                                            VideoName={item.VideoName}
                                                            onPress={() => navigation.navigate("Video Detail", { item: item, type: "COMPLIST" })}
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
                                                            onPress={() => navigation.navigate("Video Detail", { item: item, type: "COMPLIST" })}
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
                                                        PosterImage={xx.PosterPath}
                                                        onPress={() => {
                                                            navigation.navigate("Video Detail", { item: xx })
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
