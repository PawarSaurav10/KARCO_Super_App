import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { COLORS } from '../Constants/theme';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import moment from "moment"
import { getURL } from '../baseUrl';

const ListViewCard = ({ VideoName, VideoCategory, CourseNo, TimeLeft, onPress, PosterImage }) => {
    let remainingSeconds = moment(TimeLeft, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds')
    const [posterImage, setPosterImage] = useState(`${getURL.video_poster_URL}/${PosterImage}`)

    return (
        <TouchableOpacity
            style={{
                padding: 8, marginVertical: 6, borderWidth: 1, borderRadius: 10, borderColor: COLORS.lightGray1, backgroundColor: "white", shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 0.25,
                shadowRadius: 6,
                elevation: 4,
            }}
            onPress={onPress}
        >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 0.78 }}>
                    <View style={{ marginRight: 8 }}>
                        <Image style={{ height: 70, width: 70, borderRadius: 10, objectFit: "cover" }}
                            // defaultSource={{ uri: "https://testtrace.karco.in/videos/poster/default.jpg" }}
                            source={{ uri: posterImage }}
                            onError={(error) => {
                                setPosterImage("https://testtrace.karco.in/videos/poster/default.jpg")
                            }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ alignSelf: "flex-start", marginBottom: 6 }}>
                            <View style={{ justifyContent: "center", alignItems: "center", borderColor: COLORS.lightBlue, borderWidth: 1, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 20, }}>
                                <Text style={{ fontSize: 12, fontWeight: "bold", color: COLORS.lightBlue1 }}>{CourseNo}</Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "left", color: COLORS.darkBlue, flexWrap: 'wrap' }}>{VideoName}</Text>
                        </View>
                        <View style={{ alignSelf: "flex-start" }}>
                            <View style={{
                                // justifyContent: "center",
                                alignItems: "center",
                                paddingVertical: 4,
                                paddingHorizontal: 8,
                                borderRadius: 20,
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
                                                    "#ee3024"
                                    }`
                            }}>
                                <Text style={{ fontSize: 13, fontWeight: "bold", color: COLORS.white }}>{VideoCategory}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ alignItems: "center", justifyContent: "flex-end", flex: 0.22 }}>
                    <CountdownCircleTimer
                        size={70}
                        rotation={"counterclockwise"}
                        isPlaying
                        strokeWidth={6}
                        trailStrokeWidth={4}
                        isGrowing={true}
                        duration={86400}
                        initialRemainingTime={remainingSeconds}
                        colors={"#ee3024"}
                    >
                        {({ remainingTime }) => {
                            const hours = Math.floor(remainingTime / 3600).toLocaleString("en-US", {
                                minimumIntegerDigits: 2,
                                useGrouping: false
                            })
                            const minutes = Math.floor((remainingTime % 3600) / 60).toLocaleString("en-US", {
                                minimumIntegerDigits: 2,
                                useGrouping: false
                            })
                            const seconds = (remainingTime % 60).toLocaleString("en-US", {
                                minimumIntegerDigits: 2,
                                useGrouping: false
                            })
                            return (
                                <View style={{ padding: 4 }}>
                                    <Text style={{ color: "black", fontSize: 12, fontWeight: "bold" }}>{hours}:{minutes}:{seconds}</Text>
                                </View>
                            )
                        }}
                    </CountdownCircleTimer>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ListViewCard
