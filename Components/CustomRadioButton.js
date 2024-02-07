import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { COLORS } from '../Constants/theme';

const CustomRadioButton = ({ selected, style, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[{
                height: 20,
                width: 20,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: COLORS.lightGray1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: "white",
                margin: 4
            }, style]}>
                {
                    selected ?
                        <View style={{
                            height: 10,
                            width: 10,
                            borderRadius: 6,
                            backgroundColor: COLORS.blue,
                        }} />
                        : null
                }
            </View>
        </TouchableOpacity>
    )
}

export default CustomRadioButton
