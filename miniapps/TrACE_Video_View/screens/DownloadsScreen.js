import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, FlatList, Image, ActivityIndicator, Dimensions, ScrollView, BackHandler } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import Header from '../../../Components/Header';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { COLORS } from '../../../Constants/theme';
import NoDataFound from '../../../Components/NoDataFound';
import VideoListView from '../../../Components/VideoListView';
import CustomSearch from '../../../Components/CustomSearch';
import images from '../../../Constants/images';
import CustomAlert from '../../../Components/CustomAlert';

const DownloadsScreen = (props) => {
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [directory, setDirectory] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [searchedVideoData, setSearchedVideoData] = useState([])
    const [searchedVideo, setSearchedVideo] = useState("")
    const [orientation, setOrientation] = useState(null)
    const [viewAlert, setViewAlert] = useState(false)
    const [videoItem, setVideoItem] = useState()

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
        navigation.replace("Video_Home")
        return true;
    };

    const docPath = ReactNativeBlobUtil.fs.dirs.DownloadDir;
    const getDirectoryList = async () => {
        await ReactNativeBlobUtil.fs
            .lstat(docPath + "/Videos")
            .then(response => {
                setDirectory(response);
                setIsLoading(false)
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        if (isFocused) {
            const dim = Dimensions.get('screen');
            if (dim.height >= dim.width) {
                setOrientation("protrait")
            } else {
                setOrientation("landscape")
            }
            setIsLoading(true)
            getDirectoryList();
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            return () => backHandler.remove();
        }
    }, [isFocused]);

    useEffect(() => {
        if (searchedVideo) {
            setSearchedVideoData(
                directory.filter((element) =>
                    element.filename.toLowerCase().includes(searchedVideo.toLowerCase())
                )
            );
        } else {
            setSearchedVideoData(directory);
        }
        return () => {
            setSearchedVideoData([]);
        };
    }, [searchedVideo]);

    const deleteFile = (item) => {
        setViewAlert(true)
        setVideoItem(item)
    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                titleStyle={{
                    fontSize: 16, fontWeight: "bold"
                }}
                leftComponent={
                    <TouchableOpacity
                        style={{ marginHorizontal: 12, justifyContent: "flex-start", padding: 6 }}
                        onPress={() => backAction()}
                    >
                        <Image source={images.left_arrow_icon} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                }
                title={"Downloads"}
            />

            {isLoading &&
                <ActivityIndicator
                    style={{ flex: 1 }}
                    size="large"
                    color={COLORS.primary}
                />
            }

            {!isLoading &&
                <View style={{ flex: 1, marginBottom: props.ScreenName === "Downloads" ? Dimensions.get("window").height - (Dimensions.get("window").height - (orientation === "landscape" ? 110 : 60)) : 0 }}>
                    {directory.length > 0 &&
                        <View style={{ margin: 6, padding: 8 }}>
                            <CustomSearch
                                label={"Search Videos"}
                                style={{ fontSize: 20 }}
                                value={searchedVideo}
                                onChangeText={(value) => {
                                    setSearchedVideo(value)
                                }}
                            />
                        </View>
                    }
                    <ScrollView contentContainerStyle={{ flex: orientation === "landscape" ? 0 : 1 }}>
                        {/* <View style={{ flex: 1 }}> */}
                        <View style={{ flex: 1, marginHorizontal: 6, padding: 6 }}>
                            {!searchedVideo && directory.length > 0 &&
                                <FlatList
                                    data={directory}
                                    keyExtractor={item => item.filename}
                                    renderItem={({ item, index }) => (
                                        <VideoListView
                                            videoName={item.filename}
                                            createdDate={item.lastModified}
                                            listType={"Downloads"}
                                            item={item}
                                            onDelete={deleteFile}
                                            orientationType={orientation}
                                        />
                                    )}
                                />
                            }

                            {!searchedVideo && directory.length === 0 &&
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <NoDataFound title={"No Data Available"} desc="Please Download Videos to view Downloaded Videos." imageType="NoData" />
                                </View>
                            }

                            {searchedVideo && searchedVideoData && searchedVideoData.length > 0 &&
                                <FlatList
                                    data={searchedVideoData}
                                    keyExtractor={item => item.filename}
                                    renderItem={({ item, index }) => (
                                        <VideoListView
                                            videoName={item.filename}
                                            createdDate={item.lastModified}
                                            listType={"Downloads"}
                                            item={item}
                                            onDelete={deleteFile}
                                        />
                                    )}
                                />
                            }

                            {searchedVideo && searchedVideoData.length === 0 &&
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginVertical: orientation === "landscape" ? 0 : 110 }}>
                                    <NoDataFound title={"No Data Found"} desc="Try searching for something else or try with a different spelling" imageType="searchData" />
                                </View>
                            }
                        </View>
                        {/* </View> */}
                    </ScrollView>
                </View>
            }

            {viewAlert && (
                <CustomAlert
                    isView={viewAlert}
                    Title="Warning!"
                    Content="Are you sure do you want to delete this video."
                    buttonContainerStyle={{
                        flexDirection: "row"
                    }}
                    ButtonsToShow={[
                        {
                            text: 'Cancel',
                            onPress: () => {
                                setViewAlert(false)
                            },
                            toShow: true,
                        },
                        {
                            text: 'OK',
                            onPress: () => {
                                ReactNativeBlobUtil.fs.unlink(videoItem.path)
                                setIsLoading(true)
                                getDirectoryList()
                                setViewAlert(false)
                            },
                            toShow: true,
                        }
                    ]}
                />
            )}
        </View>
    )
}

export default DownloadsScreen
