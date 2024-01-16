import React, { useState } from 'react'
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native'
import { COLORS } from '../Constants/theme';

const CustomAlert = ({ isView, Title, Content, ButtonsToShow, buttonContainerStyle }) => {
    const [modalVisible, setModalVisible] = useState(isView);
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.7)', flex: 1 }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>{Title}</Text>
                            <Text style={styles.modalText}>{Content}</Text>
                            <View style={buttonContainerStyle}>
                                {ButtonsToShow.filter((xx) => xx.toShow === true).map((aa, idx) => (
                                    <Pressable
                                        key={idx}
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={aa.onPress}>
                                        <Text style={styles.textStyle}>{aa.text}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        elevation: 2,
        marginHorizontal: 16,
        marginVertical: 8
    },
    buttonClose: {
        backgroundColor: COLORS.primary,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: "600",
        color: COLORS.primary,
        marginHorizontal: 10
    },
    modalTitle: {
        color: COLORS.primary,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default CustomAlert
