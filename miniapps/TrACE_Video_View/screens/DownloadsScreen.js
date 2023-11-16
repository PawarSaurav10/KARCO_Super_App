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
                        // console.log(response,"response")
                        setDirectory(response);
                        setIsLoading(false)
                    })
                    .catch(error => console.error(error));
            };
            getDirectoryList();
        }
    }, [isLoading, isFocused]);

    

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
                <ActivityIndicator style={{ flex: 1 }}
                    size="large"
                    color={COLORS.primary}
                />
            }

            {!isLoading &&
                <View style={{ flex: 1, marginBottom: 70 }}>
                    {directory.length > 0 ? (
                        <View style={{ margin: 6, padding: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <FlatList
                                data={directory}
                                keyExtractor={item => item.filename}
                                renderItem={({ item, index }) => (
                                    <VideoListView videoName={item.filename} key={index} createdDate={item.lastModified} listType={"Downloads"} item={item}/>
                                )}
                            />
                        </View>
                    ) : (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <NoDataFound appName={"KARCO Videos"} />
                            </View>
                        )}
                </View>
            }
        </View>
    )
}

export default DownloadsScreen

