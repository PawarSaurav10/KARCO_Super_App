import React, { useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import { useTourGuideController, TourGuideZone } from 'rn-tourguide';
import { getScreenVisited, setScreenVisited } from '../Utils/getOnBoardingScreenVisited';
import { COLORS } from '../Constants/theme';
import images from '../Constants/images';
import KPIIcon from "../Images/screen.png"
import ShoreOnlineIcon from "../Images/check-list-1.png"
import VideoIcon from "../Images/video-marketing.png"
import CustomButton from '../Components/CustomButton';
import { useDispatch } from '../node_modules/react-redux';
import { fetchKARCOVideoData } from '../store/actions/videoDtlActions';

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const {
        canStart, // a boolean indicate if you can start tour guide
        start, // a function to start the tourguide
        stop, // a function  to stopping it
        eventEmitter, // an object for listening some events
    } = useTourGuideController()

    useEffect(() => {
        if (canStart) {
            getScreenVisited().then((res) => {
                if (res === null) {
                    start() // test if you can start otherwise nothing will happen
                }
            })
        }
    }, [canStart]) // don't miss it!

    const handleOnStart = () => { }
    const handleOnStop = () => { }
    const handleOnStepChange = () => { }

    useEffect(() => {
        eventEmitter.on('start', handleOnStart)
        eventEmitter.on('stop', () => {
            setScreenVisited("Yes");
        })
        eventEmitter.on('stepChange', handleOnStepChange)

        return () => {
            eventEmitter.off('start', handleOnStart)
            eventEmitter.off('stop', handleOnStop)
            eventEmitter.off('stepChange', handleOnStepChange)
        }
    }, [])

    const LIST_APPS = [
        {
            appName: 'TrACE KPI',
            path: "KPI_Navigation",
            tourguide_desc: "TrACE KPI :- This App shows the overview of the company's data in Graphical Representation",
            desc: "This App shows the overview of the company's data in Graphical Representation.",
            zone: 1,
            img: KPIIcon,
        },
        {
            appName: 'TrACE Online',
            path: "Online_Navigation",
            tourguide_desc: "TrACE Online :- This App is used by crew of the company to view video and for giving assessment.",
            desc: "This App is used by crew of the company to view video and for giving assessment on that video.",
            zone: 2,
            img: ShoreOnlineIcon,
        },
        {
            appName: 'KARCO Videos',
            path: "VideoNav_Navigation",
            tourguide_desc: "KARCO Videos :- This App includes all 3D Animation videos made by our team.",
            desc: "This App includes all 3D Animation videos made by our team.",
            zone: 3,
            img: VideoIcon,
        },
    ];

    return (
        <ScrollView>
            <View style={{
                marginVertical: 14,
                flex: 1,
                padding: 10
            }}>

                <View style={{
                    justifyContent: 'center',
                    alignItems: "center",
                    marginBottom: 10
                }}>
                    <View style={styles.logo_container}>
                        <Image
                            source={images.karco_logo}
                            style={{
                                width: 120,
                                height: 120
                            }}
                        />
                    </View>
                </View>

                <View>
                    {LIST_APPS.map((app, idx) => (
                        <TourGuideZone
                            text={app.tourguide_desc}
                            children={{ color: COLORS.primary }}
                            zone={app.zone}
                            // tooltipBottomOffset={-20}
                            // maskOffset={20}
                            borderRadius={4}
                            key={idx}
                            style={{ color: COLORS.primary }}
                        >
                            <TouchableOpacity
                                style={styles.card_container}
                                onPress={() => {
                                    navigation.navigate(app.path, app.appName)
                                    if (app.appName === "KARCO Videos") {
                                        dispatch(fetchKARCOVideoData())
                                    }
                                }}
                            >
                                <View style={styles.app_logo_container}>
                                    <Image source={images.trace_logo} style={{ width: 48, height: 48, borderRadius: 40 }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.appName}>{app && app.appName}</Text>
                                    <Text style={styles.app_desc}>{app && app.desc}</Text>
                                    <View style={{ marginTop: 6 }}>
                                        <CustomButton
                                            label={"Explore Now"}
                                            containerStyle={{
                                                backgroundColor: "transparent",
                                                alignSelf: "flex-start"
                                            }}
                                            onPress={() => {
                                                navigation.navigate(app.path, app.appName)
                                                if (app.appName === "KARCO Videos") {
                                                    dispatch(fetchKARCOVideoData())
                                                }
                                            }}
                                            labelStyle={{
                                                color: COLORS.primary,
                                                fontSize: 14,
                                                textTransform: "uppercase",
                                                borderBottomWidth: 2,
                                                borderBottomColor: COLORS.primary
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </TourGuideZone>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    tourguide: {
        color: COLORS.primary
    },
    appName: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.darkBlue,
        marginBottom: 8
    },
    app_desc: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.gray,
        marginBottom: 10
    },
    app_logo_container: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
        marginRight: 16,
        maxHeight: 60,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 60
    },
    card_container: {
        flexDirection: "row",
        backgroundColor: COLORS.white2,
        padding: 20,
        borderRadius: 16,
        margin: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 16,
    },
    logo_container: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 16,
        backgroundColor: COLORS.white2,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        padding: 6
    }
});

export default HomeScreen
