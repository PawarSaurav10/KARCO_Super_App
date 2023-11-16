import React, { useEffect, useRef, useState } from "react";

import { Animated, Button, Image, Text, View } from "react-native";

// const getRandomMessage = () => {
//   const number = Math.trunc(Math.random() * 10000);
//   return "Random message " + number;
// };

const CustomToast = (props) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.delay(3000),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start(() => {
            props.onHide()
        });
    }, []);

    return (
        <Animated.View
            style={{
                opacity,
                transform: [
                    {
                        translateY: opacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, props.ViewPoint],
                        }),
                    },
                ],
                margin: 10,
                marginBottom: 5,
                padding: 10,
                borderRadius: 4,
                shadowColor: "black",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.15,
                shadowRadius: 5,
                elevation: 6,
                ...props.containerStyle,
            }}
        >
            <View style={{ flexDirection: "row" }}>
                <Image
                    source={props.icon}
                    style={{
                        width: 20,
                        height: 20,
                        ...props.iconStyle,
                    }}
                />
                <Text style={{ ...props.labelStyle }}>{props.message}</Text>
            </View>
        </Animated.View>
    );
};
export default CustomToast;