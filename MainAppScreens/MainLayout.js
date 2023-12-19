import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Image,
    FlatList,
    ActivityIndicator,
} from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { connect } from "react-redux";
import { setSelectedTab } from "../store/actions/tabActions"
import { COLORS, SIZES } from "../Constants/theme";
import Online_Home from "../miniapps/TrACE_Online/screens/HomeScreen";
import HomeScreen from "../miniapps/TrACE_KPI/screens/HomeScreen";
import Video_HomeScreen from "../miniapps/TrACE_Video_View/screens/HomeScreen";
import LinearGradient from "react-native-linear-gradient";
import HomeIcon from "../Images/home.png"
import DonloadIcon from "../Images/file.png"
import DownloadsScreen from "../miniapps/TrACE_Video_View/screens/DownloadsScreen";
import { getDownloaded, setDownloaded } from "../Utils/getScreenVisisted";
import CustomToast from "../Components/CustomToast";
import DownloadedIcon from "../Images/checkmark.png"
import { useIsFocused } from "../node_modules/@react-navigation/core";
import { async } from "../node_modules/fast-glob";
import AsyncStorage from "@react-native-async-storage/async-storage";


const TabButton = ({
    label,
    icon,
    isFocused,
    outerContainerStyle,
    innerContainerStyle,
    onPress,
}) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Animated.View
                style={[
                    {
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    },
                    outerContainerStyle,
                ]}
            >
                <Animated.View
                    style={[
                        {
                            flexDirection: "row",
                            width: "75%",
                            height: 40,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 25,
                        },
                        innerContainerStyle,
                    ]}
                >
                    <Image
                        source={icon}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: isFocused ? COLORS.white : COLORS.primary,
                        }}
                    />

                    {isFocused && (
                        <Text
                            numberOfLines={1}
                            style={{
                                marginLeft: SIZES.base,
                                color: COLORS.white,
                                // ...FONTS.h3,
                            }}
                        >
                            {label}
                        </Text>
                    )}
                </Animated.View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};



const MainLayout = ({
    drawerAnimationStyle,
    navigation,
    selectedTab,
    setSelectedTab,
    appName,
    videoType
}) => {
    const isFocused = useIsFocused()
    const flatListRef = useRef();
    const homeTabFlex = useSharedValue(1);
    const homeTabColor = useSharedValue(COLORS.white);
    const searchTabFlex = useSharedValue(1);
    const searchTabColor = useSharedValue(COLORS.white);
    const [isLoading, setIsLoading] = useState(true);
    const [viewToast, setViewToast] = useState(false);
    const [screenVisisted, setScreenVisisted] = useState("Home")

    const TabsData = ["Home", "Downloads"]
    const homeFlexStyle = useAnimatedStyle(() => {
        return {
            flex: homeTabFlex.value,
        };
    });

    const homeColorStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: homeTabColor.value,
        };
    });

    const searchFlexStyle = useAnimatedStyle(() => {
        return {
            flex: searchTabFlex.value,
        };
    });

    const searchColorStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: searchTabColor.value,
        };
    });

    useEffect(() => {
        if (isFocused) {
            setTimeout(() => {
                getDownloaded().then((res) => {
                    if (res === "Yes") {
                        setViewToast(true)
                    } else {
                        setViewToast(false)
                    }
                })
            }, 5000);
        }
    }, [isFocused])

    useEffect(() => {
        if (selectedTab == "Home") {
            flatListRef && flatListRef.current && flatListRef.current.scrollToIndex({
                index: 0,
                animated: false,
            });

            homeTabFlex.value = withTiming(4, { duration: 500 });
            homeTabColor.value = withTiming(COLORS.primary, { duration: 500 });
        } else {
            homeTabFlex.value = withTiming(1, { duration: 500 });
            homeTabColor.value = withTiming(COLORS.white, { duration: 500 });
        }

        if (selectedTab == "Downloads") {
            flatListRef && flatListRef.current && flatListRef.current.scrollToIndex({
                index: 1,
                animated: false,
            });

            searchTabFlex.value = withTiming(4, { duration: 500 });
            searchTabColor.value = withTiming(COLORS.primary, { duration: 500 });
        } else {
            searchTabFlex.value = withTiming(1, { duration: 500 });
            searchTabColor.value = withTiming(COLORS.white, { duration: 500 });
        }
    }, [selectedTab]);

    useEffect(() => {
        setIsLoading(false);
        setSelectedTab("Home");
    }, []);


    return (
        <View style={{ flex: 1 }}>
            {isLoading && (
                <ActivityIndicator
                    style={{ flex: 1, backgroundColor: COLORS.white }}
                    size="large"
                    color={COLORS.primary}
                />
            )}
            {!isLoading && (
                <View style={{ flex: 1 }}>
                    <Animated.View
                        style={{
                            flex: 1,
                            overflow: "hidden",
                            ...drawerAnimationStyle,
                        }}
                    >
                        {appName !== "KARCO Videos" &&
                            <View style={{ flex: 1 }}>
                                {appName === "TrACE Online" ? <Online_Home videoType={videoType} /> : appName === "TrACE KPI" ? <HomeScreen /> : <Video_HomeScreen />}
                            </View>
                        }

                        {/* Footer */}
                        {appName === "KARCO Videos" &&
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        ref={flatListRef}
                                        horizontal
                                        scrollEnabled={false}
                                        pagingEnabled
                                        snapToAlignment="center"
                                        snapToInterval={SIZES.width}
                                        showsHorizontalScrollIndicator={false}
                                        data={TabsData}
                                        keyExtractor={(item) => `${item}`}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <View
                                                    key={index}
                                                    style={{
                                                        height: SIZES.height,
                                                        width: SIZES.width,
                                                    }}
                                                >
                                                    {item == "Home" && <Video_HomeScreen ScreenName={screenVisisted} />}
                                                    {item == "Downloads" && <DownloadsScreen ScreenName={screenVisisted} />}
                                                </View>
                                            );
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        height: 60,
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    {/* Shadow */}
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={[COLORS.transparent, COLORS.lightGray1]}
                                        style={{
                                            position: "absolute",
                                            top: -15,
                                            left: 0,
                                            right: 0,
                                            height: 100,
                                            borderTopLeftRadius: 15,
                                            borderTopRightRadius: 15,
                                        }}
                                    />

                                    {/* Tabs */}
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "row",
                                            paddingHorizontal: SIZES.radius,
                                            // paddingBottom: 8,
                                            borderTopLeftRadius: 20,
                                            borderTopRightRadius: 20,
                                            backgroundColor: COLORS.white,
                                        }}
                                    >
                                        <TabButton
                                            label={"Home"}
                                            icon={HomeIcon}
                                            isFocused={selectedTab == "Home"}
                                            outerContainerStyle={homeFlexStyle}
                                            innerContainerStyle={homeColorStyle}
                                            onPress={() => {
                                                setSelectedTab("Home")
                                                setScreenVisisted("Home")
                                                // navigation.navigate("Video_Home")
                                            }}
                                        />

                                        <TabButton
                                            label={"Downloads"}
                                            icon={DonloadIcon}
                                            isFocused={selectedTab == "Downloads"}
                                            outerContainerStyle={searchFlexStyle}
                                            innerContainerStyle={searchColorStyle}
                                            onPress={() => {
                                                setSelectedTab("Downloads")
                                                setScreenVisisted("Downloads")
                                                // navigation.navigate("Downloads")
                                            }}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: -15,
                                            left: 0,
                                            right: 0,
                                        }}>
                                        {viewToast === true &&
                                            <CustomToast
                                                icon={DownloadedIcon}
                                                iconStyle={{
                                                    tintColor: COLORS.white,
                                                    marginRight: 10,
                                                }}
                                                containerStyle={{
                                                    backgroundColor: COLORS.primary,
                                                }}
                                                labelStyle={{
                                                    color: COLORS.white,
                                                    fontWeight: "bold",
                                                }}
                                                message={"Your Video is Downloaded"}
                                                onHide={async () => {
                                                    await AsyncStorage.removeItem("downloaded")
                                                    setViewToast(!viewToast)
                                                }}
                                                ViewPoint={-100}
                                            />}
                                    </View>
                                </View>
                            </View>
                        }
                    </Animated.View>
                </View>
            )}
        </View>
    );
};

function mapStateToProps(state) {
    return {
        selectedTab: state.tabReducer.selectedTab,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setSelectedTab: (selectedTab) => {
            return dispatch(setSelectedTab(selectedTab));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);