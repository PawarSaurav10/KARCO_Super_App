import React from 'react'
import { TouchableOpacity, Text } from 'react-native';

const CustomButton = ({ label, onPress, containerStyle, labelStyle }) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                ...containerStyle,
            }}
            onPress={onPress}
        >
            <Text
                style={{
                    color: "white",
                    fontWeight: "bold",
                    ...labelStyle
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export default CustomButton
