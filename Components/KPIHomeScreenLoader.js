import React from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const KPIHomeScreenLoader = () => {
    return (
        <SkeletonPlaceholder borderRadius={4}>
            <View style={{ padding: 12 }}>
                <View style={style.kpi_card} />
                <View style={style.kpi_card} />
                <View style={style.kpi_card} />
            </View>
        </SkeletonPlaceholder>
    )
}

const style = StyleSheet.create({
    kpi_card: {
        padding: 10,
        borderRadius: 10,
        margin: 10,
        width: Dimensions.get("window").width - 40,
        height: 300
    }
})

export default KPIHomeScreenLoader
