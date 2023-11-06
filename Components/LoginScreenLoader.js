import React from 'react'
import { View, StyleSheet } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const LoginScreenLoader = () => {
    return (
        <SkeletonPlaceholder borderRadius={6}>
            <View style={{ justifyContent: "center" }}>
                <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: 200, marginBottom: 8, height: 100 }} />
                    <View style={{ width: 160, height: 90 }} />
                    <View style={{ padding: 10, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ height: 40, width: 200, marginVertical: 4 }} />
                        <View style={{ height: 30, width: 350, marginVertical: 4 }} />
                    </View>
                </View>
                <View style={{ padding: 20 }}>
                    <View style={{ marginVertical: 10, maxWidth: 380 }}>
                        <View style={styles.input} />
                    </View>
                    <View style={{ marginVertical: 10, maxWidth: 380 }}>
                        <View style={styles.input} />
                    </View>
                    <View
                        style={{
                            width: 350,
                            padding: 16,
                            marginVertical: 12,
                            borderRadius: 5,
                            height: 60
                        }}
                    />
                </View>
            </View>
        </SkeletonPlaceholder>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 60,
        margin: 12,
        padding: 10,
        borderRadius: 8,
    },
});

export default LoginScreenLoader
