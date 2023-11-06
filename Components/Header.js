import React from "react";
import { View, Text, Image } from "react-native";
import { COLORS } from "../Constants/theme";
// import { FONTS } from "../constants";

const Header = ({
  containerStyle,
  title,
  titleStyle,
  leftComponent,
  rightComponent,
}) => {
  return (
    <View
      style={{
        height: 60,
        flexDirection: "row",
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#004C6B",
        ...containerStyle,
      }}
    >{leftComponent}
      
      <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }}>
        <Text style={{ color: COLORS.white, ...titleStyle }} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {rightComponent}
    </View>
  );
};

export default Header;