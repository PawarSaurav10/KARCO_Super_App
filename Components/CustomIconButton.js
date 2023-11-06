import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'

const CustomIconButton = ({ containerStyle, icon, iconStyle, onPress, label, labelStyle }) => {
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
            <Image
                source={icon}
                style={{
                    width: 20,
                    height: 20,
                    ...iconStyle,
                }}
            />

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

export default CustomIconButton
