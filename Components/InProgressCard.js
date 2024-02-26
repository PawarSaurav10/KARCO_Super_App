import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import { CountdownCircleTimer } from '../node_modules/react-native-countdown-circle-timer/lib';
import images from '../Constants/images';
import * as Progress from 'react-native-progress';
import moment from "moment"
import { COLORS } from '../Constants/theme';

const InProgressCard = ({ VideoName, remainingTime, VideoCategory, Percentage, NoOfQuestionAnswered, TotalQuestion, OnPress, data, orientationType }) => {
    let progress = NoOfQuestionAnswered / TotalQuestion
    let remainingSeconds = moment(remainingTime, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds')

    return (
        <TouchableOpacity onPress={OnPress}>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 14 }}>
                <View style={styles.card1} />
                <View style={styles.card2} />
                <View style={styles.card3}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                        <View style={{ flex: orientationType === "protrait" ? 0.8 : 0.9 }}>
                            <Text style={styles.videoName_text}>{VideoName}</Text>
                            <View style={{
                                alignSelf: "flex-start",
                                justifyContent: "center",
                                alignItems: "center",
                                marginVertical: 6,
                                borderRadius: 20,
                                paddingHorizontal: 8,
                                paddingVertical: 6,
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
                                <Text style={{ fontSize: 10, fontWeight: "bold", color: COLORS.white }} numberOfLines={1}>{VideoCategory}</Text>
                            </View>
                        </View>
                        <View style={{ flex: orientationType === "protrait" ? 0.2 : 0.1 }}>
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
                                            <Text style={{ color: COLORS.white2, fontSize: 12, fontWeight: "bold" }}>{hours}:{minutes}:{seconds}</Text>
                                        </View>
                                    )
                                }}
                            </CountdownCircleTimer>
                        </View>
                    </View>

                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <Text style={{ color: COLORS.white2 }}>Done {NoOfQuestionAnswered}/{TotalQuestion}</Text>
                            <Text style={{ color: COLORS.white2 }}>{(Percentage).toFixed(0)}%</Text>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Progress.Bar
                                progress={progress}
                                animationType="timing"
                                width={Dimensions.get("window").width - 70}
                                height={5}
                                borderColor={"white"}
                                color={Percentage >= 70 ? "green" : Percentage >= 50 ? "yellow" : Percentage <= 50 ? "red" : "red"}
                                borderWidth={0}
                                unfilledColor="white" />
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ color: COLORS.white2 }}>Continue to {data.AssessmentStatus === "Feedback" ? "Feedback" : "Assessment"}</Text>
                        <Image source={images.right_arrow_half_icon} style={{ width: 16, height: 16 }} tintColor={"white"} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card1: {
        backgroundColor: "#ADC8CE",
        paddingHorizontal: 12,
        paddingVertical: 16,
        margin: 4,
        borderRadius: 24,
        transform: [
            { rotate: '3deg' }
        ],
        width: Dimensions.get("window").width - 30,
        minHeight: 180,
        position: "relative"
    },
    card2: {
        backgroundColor: COLORS.lightBlue1,
        paddingHorizontal: 12,
        paddingVertical: 16,
        margin: 4,
        borderRadius: 24,
        transform: [
            { rotate: '-4deg' }
        ],
        width: Dimensions.get("window").width - 50,
        minHeight: 180,
        position: "absolute"
    },
    card3: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 16,
        margin: 4,
        borderRadius: 24,
        position: "absolute",
        width: Dimensions.get("window").width - 40,
        minHeight: 180,
        justifyContent: "space-between"
    },
    videoName_text: {
        color: COLORS.white2,
        fontSize: 16,
        fontWeight: "700"
    }
})

export default InProgressCard
