import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../Constants/theme';

const AlertButtons = () => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity
            onPress={() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }]
                })
            }}>
            <Text style={{ color: COLORS.primary, fontSize: 20 }}>OK</Text>
        </TouchableOpacity>
    )
}

export default AlertButtons
