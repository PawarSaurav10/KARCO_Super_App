import React from 'react'
import { View, Text } from 'react-native'
import { COLORS } from '../Constants/theme';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const AssessmentScreenLoader = () => {
    return (
        <SkeletonPlaceholder borderRadius={6}>
            <View style={{ padding: 14 }}>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 6, borderBottomWidth: 1, }}>
                    <Text style={{ fontSize: 14, width: 40 }} />
                    <Text style={{ fontSize: 16, width: 100 }} />
                    <View style={{
                        width: 28,
                        height: 28,
                        borderRadius: 20,
                    }} />
                </View>
                <View style={{ padding: 6 }}>
                    <Text style={{ fontSize: 24, fontWeight: "600", textAlign: "left", marginBottom: 6, width: 320 }}></Text>
                    <Text style={{ fontSize: 24, fontWeight: "600", textAlign: "left", marginBottom: 20, width: 200 }}></Text>
                    <View style={{ width: "100%", height: 80, margin: 6 }} />
                    <View style={{ width: "100%", height: 80, margin: 6 }} />
                    <View style={{ width: "100%", height: 80, margin: 6 }} />
                    <View style={{ width: "100%", height: 80, margin: 6 }} />
                </View>
            </View>
        </SkeletonPlaceholder>
    )
}

export default AssessmentScreenLoader
