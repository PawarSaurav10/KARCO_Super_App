import React from 'react'
import { View, Text, Image } from 'react-native'
import { COLORS } from '../Constants/theme';
import images from '../Constants/images';

const NoDataFound = ({ desc, imageType, title }) => {
    return (
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "yellow" }}>
            <View style={{ margin: 8 }}>
                <Image source={imageType === "searchData" ? images.empty_search_icon : images.empty_box_icon} style={{ width: 200, height: 200 }} />
            </View>
            <Text style={{ fontSize: 26, color: COLORS.primary, fontWeight: "bold", marginBottom: 12 }}>{title}</Text>
            <Text style={{ fontSize: 18, textAlign: "center", color: COLORS.darkBlue, fontWeight: "600" }}>
                {desc}
            </Text>
        </View>
    )
}

export default NoDataFound
