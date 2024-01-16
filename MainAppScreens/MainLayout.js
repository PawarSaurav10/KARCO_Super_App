import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Image,
    FlatList,
    ActivityIndicator,
    Dimensions,
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
import DownloadsScreen from "../miniapps/TrACE_Video_View/screens/DownloadsScreen";
import { getDownloaded } from "../Utils/getScreenVisisted";
import CustomToast from "../Components/CustomToast";
import { useIsFocused } from "../node_modules/@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import images from "../Constants/images";

const TabButton = ({
    label,
    icon,
    isFocused,
    outerContainerStyle,
    innerContainerStyle,
    onPress,
    textContainerStyle
}) => {
    console.log(textContainerStyle, "textContainerStyle")
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
                            flexDirection: isFocused ? "row" : "column",
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
                        <Animated.Text
                            numberOfLines={1}
                            style={[
                                { marginLeft: SIZES.base },
                                textContainerStyle,
                                // ...FONTS.h3,
                            ]}
                        >
                            {label}
                        </Animated.Text>
                    )}

                    {!isFocused && (
                        <Animated.Text
                            numberOfLines={1}
                            style={[
                                { fontSize: 14 },
                                textContainerStyle,
                                // ...FONTS.h3,
                            ]}
                        >
                            {label}
                        </Animated.Text>
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
    const homeTextColor = useSharedValue(COLORS.primary)
    const searchTabFlex = useSharedValue(1);
    const searchTabColor = useSharedValue(COLORS.white);
    const searchTextColor = useSharedValue(COLORS.primary)
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

    const homeTextStyle = useAnimatedStyle(() => {
        return {
            color: homeTextColor.value,
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

    const searchTextStyle = useAnimatedStyle(() => {
        return {
            color: searchTextColor.value,
        };
    });

    const [orientation, setOrientation] = useState()

    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    useEffect(() => {
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            setOrientation(
                isPortrait() ? 'portrait' : 'landscape'
            );
        });
    }, [orientation])

    useEffect(() => {
        if (isFocused) {
            const dim = Dimensions.get('screen');
            if (dim.height >= dim.width) {
                setOrientation("protrait")
            } else {
                setOrientation("landscape")
            }
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
            homeTabFlex.value = withTiming(2, { duration: 500 });
            homeTabColor.value = withTiming(COLORS.primary, { duration: 500 });
            homeTextColor.value = withTiming(COLORS.white, { duration: 500 });
        } else {
            homeTabFlex.value = withTiming(1, { duration: 500 });
            homeTabColor.value = withTiming(COLORS.white, { duration: 500 });
            homeTextColor.value = withTiming(COLORS.primary, { duration: 500 });
        }

        if (selectedTab == "Downloads") {
            flatListRef && flatListRef.current && flatListRef.current.scrollToIndex({
                index: 1,
                animated: false,
            });
            searchTabFlex.value = withTiming(2, { duration: 500 });
            searchTabColor.value = withTiming(COLORS.primary, { duration: 500 });
            searchTextColor.value = withTiming(COLORS.white, { duration: 500 });
        } else {
            searchTabFlex.value = withTiming(1, { duration: 500 });
            searchTabColor.value = withTiming(COLORS.white, { duration: 500 });
            searchTextColor.value = withTiming(COLORS.primary, { duration: 500 });
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
                            <>
                                <FlatList
                                    ref={flatListRef}
                                    horizontal={orientation === "landscape" ? false : true}
                                    scrollEnabled={false}
                                    extraData={selectedTab}
                                    showsHorizontalScrollIndicator={false}
                                    data={TabsData}
                                    keyExtractor={(item) => `${item}`}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View
                                                key={index}
                                                style={{
                                                    height: orientation === "landscape" ? Dimensions.get("screen").height : SIZES.height,
                                                    width: orientation === "landscape" ? Dimensions.get("window").width : SIZES.width,
                                                }}
                                            >
                                                {selectedTab == "Home" && <Video_HomeScreen ScreenName={screenVisisted} />}
                                                {selectedTab == "Downloads" && <DownloadsScreen ScreenName={screenVisisted} />}
                                            </View>
                                        );
                                    }}
                                />
                                <View
                                    style={{
                                        height: 60,
                                        justifyContent: "flex-end",
                                        zIndex: 50
                                    }}
                                >
                                    {/* Shadow */}
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        colors={[COLORS.transparent, COLORS.transparentBlack7]}
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
                                            borderWidth: 1,
                                            borderColor: COLORS.gray
                                        }}
                                    >
                                        <TabButton
                                            label={"Home"}
                                            icon={images.home_icon}
                                            isFocused={selectedTab == "Home"}
                                            outerContainerStyle={homeFlexStyle}
                                            innerContainerStyle={homeColorStyle}
                                            textContainerStyle={homeTextStyle}
                                            onPress={() => {
                                                setSelectedTab("Home")
                                                setScreenVisisted("Home")
                                                // navigation.navigate("Video_Home")
                                            }}
                                        />

                                        <TabButton
                                            label={"Downloads"}
                                            icon={images.file_icon}
                                            isFocused={selectedTab == "Downloads"}
                                            outerContainerStyle={searchFlexStyle}
                                            innerContainerStyle={searchColorStyle}
                                            textContainerStyle={searchTextStyle}
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
                                                icon={images.downloaded_icon}
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
                            </>
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