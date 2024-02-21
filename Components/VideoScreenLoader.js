import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { COLORS } from '../Constants/theme';

const VideoScreenLoader = () => {
    return (
        <SkeletonPlaceholder borderRadius={6} padding={16}>
            <View style={{ width: Dimensions.get('window').width, height: 200 }} />
            <View style={{ margin: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                        <Text style={{ fontSize: 20, width: 300, marginBottom: 10 }} />
                        <Text style={{ fontSize: 20, width: 200, }} />
                    </View>
                    <View style={{
                        borderRadius: 35,
                        height: 35,
                        width: 35,
                    }} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 4 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                        <View style={{ borderRadius: 35, height: 30, width: 30, marginRight: 6 }} />
                        <Text style={{ fontSize: 14, width: 40 }} />
                    </View>
                    <View
                        style={{
                        
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginVertical: 6,
                            borderRadius: 20,
                            paddingHorizontal: 6,
                            paddingVertical: 6,
                            width: "50%",
                            height: 30
                        }} />
                </View>
            </View>
            <View style={{ borderWidth: 1, borderColor: COLORS.darkBlue, width: "100%", marginVertical: 8 }} />
            <View style={{ margin: 8 }}>
                <View
                    style={{
                        padding: 16,
                        alignItems: "center",
                        margin: 12,
                        borderRadius: 5,
                        height: 45
                    }}
                />
                <View
                    style={{
                        padding: 16,
                        alignItems: "center",
                        margin: 12,
                        borderRadius: 5,
                        height: 45
                    }}
                />
            </View>
        </SkeletonPlaceholder>
    )
}

export default VideoScreenLoader
