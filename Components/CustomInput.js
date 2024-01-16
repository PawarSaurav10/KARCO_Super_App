import React from 'react'
import { TextInput, Text, View, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { COLORS } from '../Constants/theme';

const CustomInput = ({ value, onChangeText, inputType, label, keyboardType, icon, fieldButtonFunction, fieldButtonLabel, textColor, onIconClick, secureTextEntry, inputMode }) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                borderBottomColor: '#ccc',
                borderBottomWidth: 1,
                paddingBottom: 8,
                marginBottom: 25,
            }}>
            {/* {icon} */}
            {inputType == 'password' ? (
                // <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder={label}
                        keyboardType={keyboardType}
                        style={{ flex: 1, paddingVertical: 0, width: '90%', fontSize: 18 }}
                        secureTextEntry={secureTextEntry}
                        value={value}
                        color={textColor}
                        onChangeText={onChangeText}
                        placeholderTextColor={COLORS.black}
                        enablesReturnKeyAutomatically
                    />
                    <Pressable onPress={onIconClick} style={{ padding: 4 }}>
                        <Image source={icon} style={{ width: 22, height: 22, marginRight: 10 }} />
                    </Pressable>
                </View>
                // </View>
            ) : (
                    <TextInput
                        placeholder={label}
                        keyboardType={"numeric"}
                        inputMode="search"
                        style={{ flex: 1, paddingVertical: 0, fontSize: 18 }}
                        onChangeText={onChangeText}
                        value={value}
                        color={textColor}
                        placeholderTextColor={COLORS.black}

                    />
                )}
            <TouchableOpacity onPress={fieldButtonFunction}>
                <Text style={{ color: '#AD40AF', fontWeight: '700' }}>{fieldButtonLabel}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default CustomInput
