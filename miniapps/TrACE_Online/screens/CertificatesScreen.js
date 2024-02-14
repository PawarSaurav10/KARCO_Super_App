import React, { useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, BackHandler } from 'react-native'
import NoDataFound from '../../../Components/NoDataFound';
import images from '../../../Constants/images';
import Header from '../../../Components/Header';

const CertificatesScreen = ({ navigation }) => {
    const backAction = () => {
        navigation.replace("Online_Home")
        return true;
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <Header
                titleStyle={{
                    fontSize: 16, fontWeight: "bold"
                }}
                leftComponent={
                    <TouchableOpacity
                        style={{ marginHorizontal: 12, justifyContent: "flex-start", padding: 6 }}
                        onPress={() => navigation.replace("Online_Home")}
                    >
                        <Image source={images.left_arrow_icon} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                }
                title={"Certificates"}
            />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <NoDataFound title="No Certificates Downloaded" desc="Please complete assessment and generate the Certificates." imageType="NoData" />
            </View>
        </View>
    )
}

export default CertificatesScreen
