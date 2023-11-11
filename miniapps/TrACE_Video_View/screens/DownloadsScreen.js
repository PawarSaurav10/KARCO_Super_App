import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert, BackHandler } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import Header from '../../../Components/Header';
import BackIcon from "../../../Images/left-arrow.png"
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { COLORS, SIZES } from '../../../Constants/theme';
import CalendarIcon from "../../../Images/calendar.png"
import moment from "moment"
import DeleteIcon from "../../../Images/trash.png"
import PlayIcon from "../../../Images/play-button.png"
import NoDataFound from '../../../Components/NoDataFound';
import { setSelectedTab } from '../../../store/actions/tabActions';


const DownloadsScreen = () => {
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [directory, setDirectory] = useState([]);
    const [readFIle, setReadFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (isFocused) {
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

    // function to handle our read file
    const handleReadFile = (item) => {
        navigation.navigate("Video Detail", { data: item, type: "Downloads" })
        setReadFile(item);
    };

    const deleteFile = (item) => {
        Alert.alert('Warning', 'Are you sure do you want to delete this video.', [
            {
                text: 'OK', onPress: () => {
                    ReactNativeBlobUtil.fs.unlink(item.path)
                    setIsLoading(true)
                }
            },
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
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
                                keyExtractor={item => item.name}
                                renderItem={({ item, index }) => (
                                    <View key={index} style={{ flex: 1 }}>
                                        <View style={{ flexDirection: "row", padding: 8, alignItems: "center" }}>
                                            <TouchableOpacity onPress={() => handleReadFile(item)} style={{ marginRight: 6, flex: 0.2 }}>
                                                <Image source={PlayIcon} style={{ height: 60, width: 60, borderRadius: 10, objectFit: "cover" }} />
                                            </TouchableOpacity>
                                            <View style={{ flex: 0.7, marginLeft: 6, }}>
                                                <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.darkBlue }}>{(item.filename).slice(0, -4)}</Text>
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
                                            <TouchableOpacity onPress={() => deleteFile(item)} style={{ marginLeft: 12, flex: 0.1 }}>
                                                <Image source={DeleteIcon} style={{ width: 30, height: 30 }} />
                                            </TouchableOpacity>
                                        </View>
                                        <View
                                            style={{
                                                height: 2,
                                                marginVertical: SIZES.height > 800 ? SIZES.radius : 0,
                                                marginHorizontal: 4,
                                                backgroundColor: COLORS.lightGray1,
                                            }}
                                        />
                                    </View>
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

