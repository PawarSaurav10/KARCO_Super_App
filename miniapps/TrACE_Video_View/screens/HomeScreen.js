import React, { useState, useEffect } from 'react'
import { View, Text, Image, FlatList, ActivityIndicator, BackHandler, } from 'react-native'
import { COLORS } from '../../../Constants/theme';
import axios from 'axios';
import CustomSearch from '../../../Components/CustomSearch';
import AvatarImg from "../../../Images/profile.png"
import { useNavigation, useIsFocused } from '@react-navigation/native';
import NoInternetComponent from '../../../Components/NoInternetComponent';
import NetInfo from "@react-native-community/netinfo";
import { getURL } from "../../../baseUrl"
import VideoListView from '../../../Components/VideoListView';

const HomeScreen = (props) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused()
    const [videoList, setVideoList] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [isView, setIsView] = useState(false)
    const [searchedVideoData, setSearchedVideoData] = useState([])
    const [searchedVideo, setSearchedVideo] = useState("")

    const backAction = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
        });
        return true;
    };

    function CheckConnectivity() {
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.fetch().then(xx => {
                if (xx.isConnected) {
                    setIsView(false)
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
            setIsView(false)
            // Alert.alert("You are online!");
        }
    };

    const onRefresh = async () => {
        setIsLoading(true)
        CheckConnectivity()
        axios.get(`${getURL.VideoView_baseURL}?vooKey=${getURL.vooKey}`)
            .then((res) => {
                setVideoList(res.data.videos.data)
                setIsLoading(false)
            })
    };

    useEffect(() => {
        if (isFocused) {
            setIsLoading(true)
            CheckConnectivity()
            axios.get(`${getURL.VideoView_baseURL}?vooKey=${getURL.vooKey}`)
                .then((res) => {
                    setVideoList(res.data.videos.data)
                    setIsLoading(false)
                })
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            return () => backHandler.remove();
        }
    }, [isFocused, props.ScreenName === "Home"])

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
                        <View style={{ marginHorizontal: 6 }}>
                            <FlatList
                                refreshing={isLoading}
                                onRefresh={onRefresh}
                                data={searchedVideo !== "" ? searchedVideoData : videoList}
                                keyExtractor={item => item.id}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <VideoListView
                                        thumbnail={item.thumbnail}
                                        videoName={item.name}
                                        createdDate={item.created}
                                        OnPress={() => {
                                            CheckConnectivity()
                                            navigation.navigate("Video Detail", item.id)
                                        }}
                                    />
                                )}
                            />
                        </View>
                    }
                    {isView === true && (
                        <NoInternetComponent />
                    )}
                </View>
            }
        </View>
    )
}

export default HomeScreen
