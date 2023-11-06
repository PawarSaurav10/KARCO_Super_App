import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native'
import RightArrowIcon from "../Images/right-arrow.png"
import { getURL } from '../baseUrl';
import { COLORS } from '../Constants/theme';

const GridViewCard = ({ VideoName, VideoCategory, CourseNo, onPress, isVideoCompleted, Status, PosterImage, orientationType }) => {
    const [posterImage, setPosterImage] = useState(`${getURL.video_poster_URL}/${PosterImage}`)

    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <View style={[styles.video_card_container, styles.borderRadius, { width: orientationType === "landscape" ? Dimensions.get("screen").width / 4.35 : Dimensions.get('window').width / 2.2, }]}>
                <View style={{ padding: 10, }}>
                    <View>
                        <Image
                            style={{ height: 110, width: "100%", marginBottom: 4, borderRadius: 10, objectFit: "cover" }}
                            source={{ uri: posterImage }}
                            onError={(error) => {
                                setPosterImage("https://testtrace.karco.in/videos/poster/default.jpg")
                            }} />
                    </View>
                    <View style={{ minHeight: 70 }}>
                        <Text style={{ fontSize: 14, fontWeight: "bold", textAlign: "left", color: COLORS.darkBlue, flexWrap: "wrap" }} numberOfLines={4}>{VideoName}</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <View style={{ alignSelf: "baseline" }}>
                            <View style={{
                                alignSelf: "flex-start",
                                justifyContent: "center",
                                alignItems: "center",
                                marginVertical: 6,
                                borderRadius: 20,
                                paddingHorizontal: 4,
                                paddingVertical: 6,
                                // width: "50%",
                                backgroundColor: `${VideoCategory === "OCIMF SIRE VIQ SERIES"
                                    ? "#FFC239" :
                                    VideoCategory === "SHIP SPECIFIC SERIES"
                                        ? "#29ABE2" :
                                        VideoCategory === "ACCIDENT / INCIDENT SERIES"
                                            ? "#9E005D" :
                                            VideoCategory === "PERSONAL SAFETY"
                                                ? "#f75a24" :
                                                VideoCategory === "SHIP BOARD OPERATION"
                                                    ? "#22B573" :
                                                    "red"
                                    }`
                            }}>
                                <Text style={{ fontSize: 10, fontWeight: "bold", color: COLORS.white }} numberOfLines={1}>{VideoCategory}</Text>
                            </View>
                            <Text style={{ fontSize: 12, fontWeight: "bold", color: COLORS.gray }}>{CourseNo}</Text>
                        </View>
                        <Image
                            style={{ width: 12, height: 12 }}
                            source={RightArrowIcon}
                        />
                    </View>
                </View>
                {
                    isVideoCompleted === true && (
                        <View style={{
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                            paddingVertical: 4,
                            backgroundColor: Status === "Expired" ? "#edc700" : Status === "Completed" ? "#00b569" : Status === "Pending" ? "#ff0000" : "", justifyContent: "center", alignItems: "center"
                        }}>
                            <Text style={{ fontSize: 12, fontWeight: 700, color: COLORS.white }}>
                                {Status === "Expired" ? "Expired" : Status === "Completed" ? "Completed" : Status === "Pending" ? "Pending" : ""}
                            </Text>
                        </View>
                    )
                }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    video_card_container: {
        //     backgroundColor: 'white',
        // borderRadius: 8,
        // paddingVertical: 45,
        // paddingHorizontal: 25,
        // // width: '100%',
        // marginVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.lightGray1,
        margin: 6,
        borderRadius: 12,
        backgroundColor: "white",
        flexDirection: "column"
    },
    shadowProp: {
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 8,
        shadowColor: COLORS.lightGray1,
        elevation: 8,
    },
})

export default GridViewCard
