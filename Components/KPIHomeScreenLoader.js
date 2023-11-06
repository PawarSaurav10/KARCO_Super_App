import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const KPIHomeScreenLoader = () => {
    return (
        <View style={{ flex: 1 }}>
            <SkeletonPlaceholder borderRadius={4}>
                <View style={{
                    flex: 1, padding: 12
                }}>
                    <View style={{ padding: 10, borderRadius: 10, margin: 10, width: Dimensions.get("window").width - 40, height: 300 }} />

                    <View style={{ padding: 10, borderRadius: 10, margin: 10, width: Dimensions.get("window").width - 40, height: 300 }} />

                    <View style={{ padding: 10, borderRadius: 10, margin: 10, width: Dimensions.get("window").width - 40, height: 300 }} />
                </View>
            </SkeletonPlaceholder>
        </View>
    )
}

export default KPIHomeScreenLoader
