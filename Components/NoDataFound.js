import React from 'react'
import { View, Text, Image } from 'react-native'
import NoDataIcon from "../Images/empty.png"
import NoDataIcon1 from "../Images/empty-box.png"
import { COLORS } from '../Constants/theme';

const NoDataFound = ({ appName }) => {
    return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={{ margin: 8 }}>
                <Image source={appName === "KARCO Videos" ? NoDataIcon1 : NoDataIcon} style={{ width: 200, height: 200 }} />
            </View>
            <Text style={{ fontSize: 26, color: COLORS.primary, fontWeight: "bold", marginBottom: 12 }}>No Data Found</Text>
            <Text style={{ fontSize: 18, textAlign: "center", color: COLORS.darkBlue, fontWeight: "600" }}>
                {appName ===
                    "KARCO Videos" ? "Please Download Videos to view Downloaded Videos."
                    : "Try searching for something else or try with a different spelling"
                }
            </Text>
        </View>
    )
}

export default NoDataFound
