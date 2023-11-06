import React, { useState, useEffect } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native'
import CalendarIcon from "../../../Images/calendar.png"
import { COLORS, SIZES } from '../../../Constants/theme';
import axios from 'axios';
import moment from "moment"
import CustomSearch from '../../../Components/CustomSearch';
import MenuIcon from "../../../Images/menu.png"
import AvatarImg from "../../../Images/profile.png"
import NotificationIcon from "../../../Images/notification.png"
import { useNavigation, useIsFocused } from '@react-navigation/native';
import NoInternetComponent from '../../../Components/NoInternetComponent';
import NetInfo from "@react-native-community/netinfo";
import { getURL } from "../../../baseUrl"

const HomeScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused()
    const [videoList, setVideoList] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [isView, setIsView] = useState(false)
    const [searchedVideoData, setSearchedVideoData] = useState([])
    const [searchedVideo, setSearchedVideo] = useState("")

    function CheckConnectivity() {
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.fetch().then(xx => {
                if (xx.isConnected) {
                    // Alert.alert("You are online!");
                } else {
                    setIsLoading(false)
                    setIsView(true)
                }
            });
        } else {
            // For iOS devices
            NetInfo.isConnected.addEventListener(
                "connectionChange",
                this.handleFirstConnectivityChange
            );
        }
    };

    handleFirstConnectivityChange = isConnected => {
        NetInfo.isConnected.removeEventListener(
            "connectionChange",
            this.handleFirstConnectivityChange
        );
        if (isConnected === false) {
            setIsLoading(false)
            setIsView(true)
        } else {
            Alert.alert("You are online!");
        }
    };



    useEffect(() => {
        if (isFocused) {
            CheckConnectivity()
            axios.get(`${getURL.VideoView_baseURL}?vooKey=${getURL.vooKey}`)
                .then((res) => {
                    setVideoList(res.data.videos.data)
                    setIsLoading(false)
                })
        }
    }, [isFocused])

    useEffect(() => {
        if (searchedVideo) {
            setSearchedVideoData(
                videoList.filter((element) =>
                    element.name.toLowerCase().includes(searchedVideo.toLowerCase())
                )
            );
        } else {
            setSearchedVideoData(videoList);
        }
        return () => {
            setSearchedVideoData([]);
        };
    }, [searchedVideo]);

    return (
        <View style={{ flex: 1 }}>
            {isLoading &&
                <ActivityIndicator
                    style={{ flex: 1 }}
                    size="large"
                    color={COLORS.primary}
                />
            }
            {!isLoading &&
                <View>
                    <View style={{ margin: 10, padding: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 0.8 }}>
                            <TouchableOpacity
                                style={{ marginRight: 8, justifyContent: "flex-start" }}
                                onPress={() => console.log("object")}
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
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                        color: COLORS.primary
                                    }}
                                    numberOfLines={1}
                                >
                                    KARCO
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.icon_container, styles.shadowProp]}>
                            <Image style={styles.icon} source={NotificationIcon} />
                        </View>
                    </View>

                    {/* Search Input */}
                    {!isView &&
                        < View >
                            <View style={{ margin: 8, padding: 8, }}>
                                <CustomSearch
                                    label={"Search Videos"}
                                    style={{ fontSize: 20 }}
                                    value={searchedVideo}
                                    onChangeText={(value) => {
                                        setSearchedVideo(value)
                                    }}
                                />
                            </View >
                        </View>
                    }
                    {!isView &&
                        <ScrollView
                            contentInsetAdjustmentBehavior="automatic"
                            nestedScrollEnabled={true}
                        >
                            <View style={{ marginHorizontal: 6 }}>
                                <FlatList
                                    data={searchedVideo !== "" ? searchedVideoData : videoList}
                                    keyExtractor={item => item.id}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                navigation.navigate("Video Detail", item.id)
                                                CheckConnectivity()
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
                                                <View style={{ flex: 0.28 }}>
                                                    <Image source={{ uri: item.thumbnail }} style={{ height: 80, width: 80, borderRadius: 10, objectFit: "cover" }} />
                                                </View>
                                                <View style={{ flex: 0.72 }}>
                                                    <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.darkBlue }}>{item.name}</Text>
                                                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}>
                                                        <View style={{ borderRadius: 35, height: 30, width: 30, borderColor: COLORS.lightGray1, borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white2, marginRight: 6 }}>
                                                            <Image style={{
                                                                height: 16,
                                                                width: 16,
                                                            }} source={CalendarIcon} />
                                                        </View>
                                                        <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.darkBlue }}>{moment(item.created).format("DD MMM YYYY")}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    height: 2,
                                                    marginVertical: SIZES.height > 800 ? SIZES.radius : 0,
                                                    marginHorizontal: SIZES.radius,
                                                    backgroundColor: COLORS.lightGray1,
                                                }}
                                            />
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </ScrollView>}

                </View>
            }
            {isView === true && (
                <NoInternetComponent />
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

export default HomeScreen
