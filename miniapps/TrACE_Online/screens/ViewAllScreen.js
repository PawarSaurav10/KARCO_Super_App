import React, { useState, useEffect } from 'react'
import {
    View,
    Image,
    ScrollView,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from "react-native"
import CustomSearch from '../../../Components/CustomSearch';
import NoDataFound from '../../../Components/NoDataFound';
import Header from '../../../Components/Header';
import BackIcon from "../../../Images/left-arrow.png"
import ListViewCard from '../../../Components/ListViewCard';
import GridViewCard from '../../../Components/GridViewCard';
// import { CheckConnectivity } from "../../../Utils/isInternetConnected"
import NetInfo from "@react-native-community/netinfo";

const ViewAllScreen = ({ navigation, route }) => {
    const [searchedTodoVideoData, setSearchedTodoVideoData] = useState([])
    const [searchedVideo, setSearchedVideo] = useState()
    const windowWidth = Dimensions.get('window').width;
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

    const CheckConnectivity = () => {
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.fetch().then(xx => {
                if (xx.isConnected) {
                    // Alert.alert("You are online!");
                } else {
                    Alert.alert('Oops !!', 'Your Device is not Connected to Internet, Please Check your Internet Connectivity', [
                        { text: 'OK', onPress: () => navigation.replace("Home") },
                    ]);
                }
            });
        }
    }

    useEffect(() => {
        CheckConnectivity()
        const dim = Dimensions.get('screen');
        if (dim.height >= dim.width) {
            setOrientation("protrait")
        } else {
            setOrientation("landscape")
        }
    }, [])

    useEffect(() => {
        if (searchedVideo) {
            setSearchedTodoVideoData(
                route.params.data.filter((element) =>
                    element.VideoName.toLowerCase().includes(searchedVideo.toLowerCase())
                )
            );
        } else {
            setSearchedTodoVideoData(route.params.data);
        }
        return () => {
            setSearchedTodoVideoData([]);
        };
    }, [searchedVideo]);

    return (
        <View style={{ flex: 1 }}>
            <Header
                titleStyle={{
                    fontSize: 16, fontWeight: "bold"
                }}
                leftComponent={
                    <TouchableOpacity
                        style={{ marginHorizontal: 12, justifyContent: "flex-start" }}
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={BackIcon} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                }
                title={route.params.listType === "Todo" ? "New Added Video" : "Continue Assessment"}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                nestedScrollEnabled={true}
            >
                <View style={{ margin: 8, padding: 8 }}>
                    <CustomSearch
                        label={"Search Videos"}
                        value={searchedVideo}
                        onChangeText={(value) => {
                            setSearchedVideo(value)
                        }}
                    />
                </View>
                {route.params.listType === "Todo" &&
                    <View style={{ flex: 1 }}>
                        {!searchedVideo &&
                            <FlatList
                                key={orientation === "landscape" ? 4 : 2}
                                nestedScrollEnabled={true}
                                scrollEnabled={false}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                numColumns={orientation === "landscape" ? 4 : 2}
                                data={route.params.data}
                                renderItem={({ item, index }) => (
                                    <GridViewCard
                                        VideoCategory={item.Category}
                                        CourseNo={item.CourseNo}
                                        VideoName={item.VideoName}
                                        onPress={() => navigation.navigate("Video Detail", item)}
                                        orientationType={orientation}
                                    />
                                )}
                                keyExtractor={item => item.Id}
                                style={{ margin: 4, padding: 4, display: "flex", flexDirection: "row" }}
                            />
                        }
                        {searchedVideo && searchedTodoVideoData && searchedTodoVideoData.length > 0 &&
                            <FlatList
                                key={orientation === "landscape" ? 4 : 2}
                                nestedScrollEnabled={true}
                                scrollEnabled={false}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                numColumns={orientation === "landscape" ? 4 : 2}
                                data={searchedTodoVideoData}
                                renderItem={({ item, index }) => (
                                    <GridViewCard
                                        VideoCategory={item.Category}
                                        CourseNo={item.CourseNo}
                                        VideoName={item.VideoName}
                                        onPress={() => navigation.navigate("Video Detail", item)}
                                        orientationType={orientation}
                                    />
                                )}
                                keyExtractor={item => item.Id}
                                style={{ margin: 4, padding: 4, display: "flex", flexDirection: "row" }}
                            />
                        }
                        {searchedVideo && searchedTodoVideoData && searchedTodoVideoData.length == 0 &&
                            <View style={{ width: windowWidth, margin: 4, padding: 8 }}>
                                <NoDataFound />
                            </View>
                        }
                    </View>
                }
                {route.params.listType === "Cont" &&
                    <View style={{ flex: 1 }}>
                        {!searchedVideo &&
                            <View style={{ margin: 4, padding: 8, }}>
                                {route.params.data.map((xx, idx) => {
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
                        }
                        {searchedVideo && searchedTodoVideoData && searchedTodoVideoData.length > 0 && (
                            <View style={{ margin: 4, padding: 8, }}>
                                {searchedTodoVideoData.filter((xx) => xx.AssessmentStatus == "Continue" || xx.AssessmentStatus == "Feedback").map((xx, idx) => {
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
                        )}
                        {searchedVideo && searchedTodoVideoData && searchedTodoVideoData.length == 0 && (
                            <View style={{ width: windowWidth, margin: 4, padding: 8 }}>
                                <NoDataFound />
                            </View>
                        )}
                    </View>
                }
            </ScrollView>
        </View>
    )
}

export default ViewAllScreen
