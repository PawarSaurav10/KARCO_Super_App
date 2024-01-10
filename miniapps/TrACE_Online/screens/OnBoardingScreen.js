import React, { useRef, useState, useEffect } from 'react'
import { View, Text, Image, Animated, TouchableOpacity } from 'react-native'
import { COLORS, SIZES } from '../../../Constants/theme';
import CustomButton from '../../../Components/CustomButton';
import BackIcon from "../../../Images/arrow.png"
import { setAppLaunced, setOnlineScreenVisited } from "../../../Utils/getScreenVisisted"
import _ from "lodash"
import images from '../../../Constants/images';

const OnBoardingScreen = ({ navigation }) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const onViewChangeRef = useRef(({ viewableItems, changed }) => {
        setCurrentIndex(viewableItems[0].index);
    });

    const onboarding_screens = [
        {
            id: 1,
            bannerImage: images.onBoardingImage_1_icon,
            title: "Online Learning Platform",
            description:
                "Choose from 100 online video courses with new additions published every month.",
        },
        {
            id: 2,
            bannerImage: images.onBoardingImage_2_icon,
            title: "Learn on your Schedule",
            description:
                "Anywhere,Anytime. Start Learning Today!",
        },
        {
            id: 3,
            bannerImage: images.onBoardingImage_3_icon,
            title: "Ready to find a course?",
            description: "Discover the online learning experience",
        },
    ];

    const ImageDescComponent = ({ item, index }) => {
        return (
            <View
                style={{
                    width: SIZES.width,
                    marginBottom: 20
                }}
            >
                {/* Header */}
                <View
                    style={{
                        flex: 3,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "flex-end",
                            height: index == 1 ? "86%" : "100%",
                            width: "100%",
                        }}
                    >
                        <Image
                            source={item.bannerImage}
                            resizeMode="contain"
                            style={{
                                width:
                                    SIZES.height > 800
                                        ? SIZES.width * 0.8
                                        : SIZES.width * 0.7,
                                height:
                                    SIZES.height > 800
                                        ? SIZES.width * 0.8
                                        : SIZES.width * 0.7,
                                marginBottom: -SIZES.padding,
                            }}
                        />
                    </View>
                </View>

                {/* Detail */}
                <View
                    style={{
                        flex: 1,
                        marginTop: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: SIZES.radius,
                    }}
                >
                    <Text style={{ fontSize: 24, textAlign: "center", fontWeight: "bold", margin: 10, color: COLORS.primary, maxWidth: 200 }}>
                        {item.title}
                    </Text>
                    <Text style={{
                        fontSize: 14, textAlign: "center", fontWeight: "bold", margin: 8, color: COLORS.darkGray2,
                        textAlign: "center",
                        paddingHorizontal: SIZES.padding,
                        // ...FONTS.body3,
                    }}>
                        {item.description}
                    </Text>
                </View>
            </View>
        )

    }

    const Dots = () => {
        const dotPosition = Animated.divide(scrollX, SIZES.width);
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {onboarding_screens.map((item, index) => {
                    const dotColor = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [
                            COLORS.lightBlue,
                            COLORS.primary,
                            COLORS.lightBlue,
                        ],
                        extrapolate: "clamp",
                    });

                    const dotWidth = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [10, 10, 10],
                        extrapolate: "clamp",
                    });

                    return (
                        <Animated.View
                            key={`dot-${index}`}
                            style={{
                                borderRadius: 5,
                                marginHorizontal: 6,
                                width: dotWidth,
                                height: 10,
                                backgroundColor: dotColor,
                            }}
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white2, padding: 10 }}>
            <View style={{ flex: 0.1 }}>
                <View style={{
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 10
                }}>
                    <View>
                        {currentIndex >= 1 &&
                            <TouchableOpacity
                                onPress={() => {
                                    if (_.inRange(currentIndex, 1, 3)) {
                                        flatListRef.current.scrollToIndex({
                                            index: currentIndex - 1,
                                            Animated: true
                                        })
                                    }
                                }}
                            >
                                <Image source={BackIcon} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>
                        }
                    </View>
                    <View>
                        <CustomButton
                            label="Skip"
                            containerStyle={{
                                borderWidth: 1,
                                borderRadius: 50,
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                borderColor: COLORS.primary
                                // backgroundColor: COLORS.primary,
                            }}
                            labelStyle={{
                                color: COLORS.primary,
                            }}
                            onPress={() => {
                                let data = [];
                                data.push({
                                    code: "ONBOARD",
                                    isVisited: true,
                                    screenName: "OnBoarding",
                                });
                                setOnlineScreenVisited(data);
                                navigation.replace("Login")
                            }}
                        />
                    </View>
                </View>
            </View>
            <View style={{ flex: 0.75 }}>
                <Animated.FlatList
                    ref={flatListRef}
                    horizontal
                    pagingEnabled
                    data={onboarding_screens}
                    scrollEventThrottle={16}
                    snapToAlignment="center"
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onViewableItemsChanged={onViewChangeRef.current}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item, index }) => {
                        return (
                            <ImageDescComponent item={item} index={index} />
                        );
                    }}
                />
            </View>
            <View style={{ flex: 0.15 }}>
                <View
                    style={{
                        height: 100,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: 10,
                            marginVertical: SIZES.padding,
                        }}
                    >
                        <View
                            style={{
                                // flex: 1,
                                justifyContent: "center",
                            }}
                        >
                            <Dots />
                        </View>
                        {currentIndex < onboarding_screens.length - 1 && (
                            <View>
                                <CustomButton
                                    label="Next"
                                    containerStyle={{
                                        height: 50,
                                        width: 140,
                                        borderRadius: 50,
                                        backgroundColor: COLORS.primary
                                    }}
                                    onPress={() => {
                                        flatListRef.current.scrollToIndex({
                                            index: currentIndex + 1,
                                            Animated: true
                                        })
                                    }}
                                />
                            </View>
                        )}
                        {currentIndex == onboarding_screens.length - 1 && (
                            <View>
                                <CustomButton
                                    label="Get Started"
                                    containerStyle={{
                                        height: 50,
                                        width: 140,
                                        borderRadius: 50,
                                        backgroundColor: COLORS.primary
                                    }}
                                    onPress={() => {
                                        navigation.replace("Login")
                                        let data = [];
                                        data.push({
                                            code: "ONBOARD",
                                            isVisited: true,
                                            screenName: "OnBoarding",
                                        });
                                        setOnlineScreenVisited(data);
                                    }}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    )
}

export default OnBoardingScreen
