import React, { useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import AppIcon from "../Images/icon.png"
import { useTourGuideController, TourGuideZone } from 'rn-tourguide';
import { getScreenVisited, setScreenVisited } from '../Utils/getOnBoardingScreenVisited';
import { COLORS } from '../Constants/theme';

const HomeScreen = ({ navigation }) => {
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

    const handleOnStart = () => console.log('start')
    const handleOnStop = () => console.log('stop')
    const handleOnStepChange = () => console.log(`stepChange`)

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
            tourguide_desc: "TrACE KPI :- This App shows the overview of the company's data in graphical presentation",
            zone: 1
        },
        {
            appName: 'TrACE Online',
            path: "Online_Navigation",
            tourguide_desc: "TrACE Online :- This App is used by crew of the company to view video and for giving assessment on that video.",
            zone: 2
        },
        {
            appName: 'KARCO Videos',
            path: "VideoNav_Navigation",
            tourguide_desc: "KARCO Videos :- This App includes all 3D Animation videos made by our team.",
            zone: 3
        },
    ];
    return (
        <View style={{ flex: 1, backgroundColor: "#004C6B", padding: 10 }}>
            <View style={styles.content}>
                {LIST_APPS.map((app, idx) => (
                    <TourGuideZone text={app.tourguide_desc} zone={app.zone} maskOffset={1} borderRadius={4} key={idx} style={{color: COLORS.primary}}>
                        <TouchableOpacity
                            style={{ justifyContent: "center", alignItems: "center", margin: 8 }}
                            onPress={() => navigation.navigate(app.path, app.appName)}
                        >
                            <Image source={AppIcon} style={{ width: 48, height: 48, borderRadius: 40, marginBottom: 8 }} />
                            <Text style={styles.appName}>{app ?.appName}</Text>
                        </TouchableOpacity>
                    </TourGuideZone>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    content: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flex: 1,
    },
    appName: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#fff',
    },
    input: {
        borderRadius: 4,
        borderWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        padding: 20,
    },
});

export default HomeScreen
