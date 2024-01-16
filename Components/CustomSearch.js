import React from 'react'
import { TextInput } from 'react-native';
import { COLORS } from '../Constants/theme';

const CustomSearch = ({ label, keyboardType, onChangeText, value }) => {
    return (
        <TextInput
            placeholder={label}
            keyboardType={keyboardType}
            inlineImageLeft="search_icon"
            inlineImagePadding={20}
            style={{ paddingVertical: 8, borderWidth: 1, borderColor: COLORS.gray, borderRadius: 22, backgroundColor: COLORS.white2, paddingHorizontal: 10, }}
            onChangeText={onChangeText}
            value={value}
            placeholderTextColor={COLORS.black}
            color={COLORS.black}
        />
    )
}

export default CustomSearch
