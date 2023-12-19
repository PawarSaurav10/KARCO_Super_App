import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native'
import moment from "moment"
import { SIZES, COLORS } from '../Constants/theme';
import CalendarIcon from "../Images/calendar.png"
import ReactNativeBlobUtil from 'react-native-blob-util'
import DownloadedIcon from "../Images/checkmark.png"
import DeleteIcon from "../Images/trash.png"
import PlayIcon from "../Images/play-button.png"
import { useNavigation } from '../node_modules/@react-navigation/core';

const VideoListView = ({ videoName, createdDate, thumbnail, OnPress, listType, item, onDelete }) => {
    const navigation = useNavigation()
    const [viewDownloadIcon, setViewDownloadIcon] = useState(false)
    const [readFIle, setReadFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    // const [videoExpired, setVideoExpired] = useState(false)
    const crt_Date = moment.unix(createdDate / 1000).format("YYYYMMDD")
    // const IsExpired = moment.utc(crt_Date).local().startOf('seconds').fromNow(true)
    // const todayDate = moment()
    // let date = todayDate.diff(crt_Date, "days")

    useEffect(() => {
        // if (listType === "Downloads") {
        //     if (date > 2) {
        //         setVideoExpired(true)
        //     } else {
        //         setVideoExpired(false)
        //     }
        // }

        if (listType !== "Downloads") {
            const docPath = ReactNativeBlobUtil.fs.dirs.DownloadDir;
            ReactNativeBlobUtil.fs.exists(`${docPath}/${videoName}.bin`)
                .then((res) => {
                    if (res === true) {
                        // ReactNativeBlobUtil.fs.stat(`${docPath}/${videoName}.bin`)
                        //     .then((stats) => {
                        //         let crt_Date = moment.unix(stats.lastModified / 1000).format("YYYYMMDD")
                        //         let IsExpired = moment.utc(crt_Date).local().startOf('hours').fromNow()
                        //         const todayDate = moment()
                        //         let date = todayDate.diff(crt_Date, "days")
                        //         if (date > 2) {
                        //             setVideoExpired(true)
                        //         } else {
                        //             setVideoExpired(false)
                        //         }
                        //     })
                        setViewDownloadIcon(true)
                    } else {
                        setViewDownloadIcon(false)
                    }
                })
        }
    }, [])

    // function to handle our read file
    const handleReadFile = (item) => {
            navigation.navigate("Video Detail", { data: item, type: "Downloads" })
            setReadFile(item);
    };

    return (
        <>
            {listType === "Downloads" ?
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", padding: 8, alignItems: "center" }}>
                        <TouchableOpacity onPress={() => handleReadFile(item)} style={{ marginRight: 6, flex: 0.2 }}>
                            <Image source={PlayIcon} style={{ height: 60, width: 60, borderRadius: 10, objectFit: "cover" }} />
                        </TouchableOpacity>
                        <View style={{ flex: 0.7, marginLeft: 6, }}>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.darkBlue }}>{((videoName).slice(0, -8)).replace(/[^a-zA-Z0-9 ]+/g, " ")}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}>
                                <View style={{ borderRadius: 35, height: 30, width: 30, borderColor: COLORS.lightGray1, borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white2, marginRight: 6 }}>
                                    <Image style={{
                                        height: 16,
                                        width: 16,
                                    }} source={CalendarIcon}

                                    />
                                </View>
                                <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.darkBlue }}>{moment(crt_Date).format("DD MMM YYYY")}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => onDelete(item, true)} style={{ marginLeft: 12, flex: 0.1 }}>
                            <Image source={DeleteIcon} style={{ width: 28, height: 28 }} />
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
                :
                <TouchableOpacity onPress={OnPress}>
                    <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
                        <View style={[styles.shadowProp, styles.elevation, { flex: 0.28 }]}>
                            <Image source={{ uri: thumbnail }} style={[{ height: 80, width: 80, borderRadius: 10, objectFit: "cover" }]} />
                        </View>
                        <View style={{ flex: 0.72 }}>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.darkBlue }}>{((videoName).slice(0, -4)).replace(/[^a-zA-Z0-9 ]+/g, " ")}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}>
                                <View style={{ borderRadius: 35, height: 30, width: 30, borderColor: COLORS.lightGray1, borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white2, marginRight: 6 }}>
                                    <Image style={{
                                        height: 16,
                                        width: 16,
                                    }} source={CalendarIcon} />
                                </View>
                                <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.darkBlue }}>{moment(createdDate).format("DD MMM YYYY")}</Text>
                            </View>
                        </View>
                        {viewDownloadIcon &&
                            <View style={{ alignSelf: "flex-end" }}>
                                <Image source={DownloadedIcon} tintColor={"green"} style={{ width: 24, height: 24 }}/>
                            </View>
                        }
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
            }
        </>
    )
}

const styles = StyleSheet.create({
    shadowProp: {
        shadowColor: 'red',
        shadowOffset: { width: 10, height: 40 },
        shadowOpacity: 1,
        shadowRadius: 3,
    },
    elevation: {
        elevation: 20,
        shadowColor: '#52006A',
    },
})

export default VideoListView
