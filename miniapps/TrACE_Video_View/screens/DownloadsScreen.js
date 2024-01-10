import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert, Dimensions, ScrollView } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import Header from '../../../Components/Header';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { COLORS, SIZES } from '../../../Constants/theme';
import NoDataFound from '../../../Components/NoDataFound';
import VideoListView from '../../../Components/VideoListView';
import CustomSearch from '../../../Components/CustomSearch';
import images from '../../../Constants/images';

const DownloadsScreen = (props) => {
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [directory, setDirectory] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [searchedVideoData, setSearchedVideoData] = useState([])
    const [searchedVideo, setSearchedVideo] = useState("")
    const [orientation, setOrientation] = useState(null)

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

    const docPath = ReactNativeBlobUtil.fs.dirs.DownloadDir;
    const getDirectoryList = async () => {
        await ReactNativeBlobUtil.fs
            .lstat(docPath)
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

    const deleteFile = (item, loading) => {
        Alert.alert('Warning', 'Are you sure do you want to delete this video.', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    ReactNativeBlobUtil.fs.unlink(item.path)
                    setIsLoading(loading)
                    getDirectoryList()
                }
            }
        ]);
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
                        onPress={() => navigation.replace("Video_Home")}
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
                <View style={{ flex: 1, marginBottom: 70 }}>
                    {directory.length > 0 &&
                        <View style={{ margin: 8, padding: 8 }}>
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
                        <View style={{ flex: 1, marginBottom: props.ScreenName === "Downloads" ? (orientation === "landscape" ? 50 : 80) : 0 }}>
                            {!searchedVideo && directory.length > 0 &&
                                <View style={{ margin: 6, padding: 6 }}>
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
                                </View>
                            }

                            {!searchedVideo && directory.length === 0 &&
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <NoDataFound title={"No Data Available"} desc="Please Download Videos to view Downloaded Videos." imageType="NoData" />
                                </View>
                            }

                            {searchedVideo && searchedVideoData && searchedVideoData.length > 0 &&
                                <View style={{ margin: 6, padding: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
                                            />
                                        )}
                                    />
                                </View>
                            }
                            
                            {searchedVideo && searchedVideoData.length === 0 &&
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginVertical: orientation === "landscape" ? 0 : 110 }}>
                                    <NoDataFound title={"No Data Found"} desc="Try searching for something else or try with a different spelling" imageType="searchData" />
                                </View>
                            }
                        </View>
                    </ScrollView>
                </View>
            }
        </View>
    )
}

export default DownloadsScreen
