import React from 'react'
import { View, Text, Image, Dimensions } from 'react-native'
import { COLORS } from '../Constants/theme';
import images from '../Constants/images';
import { TouchableOpacity } from '../node_modules/react-native-gesture-handler';

const CertificatesCard = ({ videoName, createdDate, onViewClick, data, onDelete }) => {
    return (
        <View>
            <View style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 14,
                backgroundColor: COLORS.white2,
                margin: 4,
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 0.25,
                shadowRadius: 6,
                elevation: 5,
            }}>
                <View style={{ flex: 0.90 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.primary, marginBottom: 10 }}>{(videoName).slice(0, -4)}</Text>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: COLORS.gray }}>Completed on {createdDate}</Text>
                </View>
                <View style={{ flex: 0.1, marginLeft: 10, justifyContent: "space-between", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => onViewClick(data)} style={{ margin: 6 }}>
                        <Image source={images.view_icon} style={{ width: 20, height: 20 }} tintColor={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(data)} style={{ margin: 6 }}>
                        <Image source={images.delete_icon} style={{ width: 28, height: 28 }} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ borderColor: COLORS.gray2, borderWidth: 1, marginVertical: 6, width: Dimensions.get("window").width - 100, alignSelf: "center" }} />
        </View>
    )
}

export default CertificatesCard
