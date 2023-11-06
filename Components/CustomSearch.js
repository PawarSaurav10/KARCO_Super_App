import React from 'react'
import { View, TextInput } from 'react-native';
import { COLORS } from '../Constants/theme';

const CustomSearch = ({ label, keyboardType, onChangeText, value }) => {
    return (

            <TextInput
                placeholder={label}
                keyboardType={keyboardType}
                inlineImageLeft="search_icon"
                inlineImagePadding={20}
                style={{ paddingVertical: 6, borderWidth:1, borderColor: COLORS.gray, borderRadius: 20, backgroundColor: COLORS.white2, paddingHorizontal: 10, }}
                onChangeText={onChangeText}
                value={value}
                placeholderTextColor={COLORS.black}
                color={COLORS.black}
            />
        
    )
}

export default CustomSearch
