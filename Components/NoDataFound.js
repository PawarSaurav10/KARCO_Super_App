import React from 'react'
import { View, Text, Image } from 'react-native'
import NoDataIcon from "../Images/empty.png"
import NoDataIcon1 from "../Images/empty-box.png"
import { COLORS } from '../Constants/theme';

const NoDataFound = ({ desc, imageType, title }) => {
    return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={{ margin: 8 }}>
                <Image source={imageType === "searchData" ? NoDataIcon : NoDataIcon1} style={{ width: 200, height: 200 }} />
            </View>
            <Text style={{ fontSize: 26, color: COLORS.primary, fontWeight: "bold", marginBottom: 12 }}>{title}</Text>
            <Text style={{ fontSize: 18, textAlign: "center", color: COLORS.darkBlue, fontWeight: "600" }}>
                {desc}
            </Text>
        </View>
    )
}

export default NoDataFound
