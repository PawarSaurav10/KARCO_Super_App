import React from 'react'
import { View, Text } from 'react-native'
import CustomButton from './CustomButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../Constants/theme';

const NoInternetComponent = () => {
    const navigation = useNavigation()
    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: COLORS.white2, padding: 12, margin: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: COLORS.black, marginBottom: 6 }}>You're Offline</Text>
                <Text style={{ fontSize: 16, color: COLORS.black, marginBottom: 4 }}>Watch downloaded videos or find new videos to download in your library.</Text>
                <CustomButton
                    label="Go To Downloads"
                    containerStyle={{
                        backgroundColor: COLORS.primary,
                        width: "100%",
                        padding: 10,
                        alignItems: "center",
                        marginVertical: 8,
                    }}
                    onPress={() => {
                        navigation.replace("Downloads")
                    }}
                    labelStyle={{ color: COLORS.white, fontSize: 12, textTransform: "uppercase" }} />
            </View>
        </View>
    )
}

export default NoInternetComponent
