import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import Header from '../../../Components/Header';
import BackIcon from "../../../Images/left-arrow.png"
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { COLORS, SIZES } from '../../../Constants/theme';
import NoDataFound from '../../../Components/NoDataFound';
import VideoListView from '../../../Components/VideoListView';

const DownloadsScreen = () => {
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [directory, setDirectory] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (isFocused) {
            // setIsLoading(true)
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
            getDirectoryList();
        }
    }, [isLoading, isFocused]);

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
                        <Image source={BackIcon} style={{ width: 20, height: 20 }} />
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
                    {directory.length > 0 ? (
                        <View style={{ margin: 6, padding: 6 }}>
                            <FlatList
                                data={directory}
                                keyExtractor={item => item.filename}
                                renderItem={({ item, index }) => (
                                    <View style={{ flex: 1 }}>
                                        <VideoListView videoName={item.filename} createdDate={item.lastModified} listType={"Downloads"} item={item} onDelete={deleteFile} />
                                    </View>
                                )}
                            />
                        </View>
                    ) : (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <NoDataFound title={"No Data Available"} desc="Please Download Videos to view Downloaded Videos." imageType="NoData" />
                            </View>
                        )}
                </View>
            }
        </View>
    )
}

export default DownloadsScreen
