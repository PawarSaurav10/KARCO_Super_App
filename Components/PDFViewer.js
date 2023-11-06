import React from 'react'
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import Pdf from 'react-native-pdf';
import { COLORS } from '../Constants/theme';
import { getURL } from "../baseUrl"

const PDFViewer = (props) => {
    // console.log(props, "props")
    return (
        <View style={styles.container}>
            <Pdf
                page={props.pageNo}
                scale={2.0}
                minScale={2.0}
                trustAllCerts={false}
                source={{ uri: `${getURL.view_PDF_URL}/${props.pdf}` }}
                style={styles.pdf}
                renderActivityIndicator={() =>
                    <ActivityIndicator color={COLORS.blue} size={"large"} />
                }
                onError={(error) => {
                    <View style={{ padding: 6 }}>
                        <Text style={{ fontSize: 16, color: COLORS.primary }}>{error}</Text>
                    </View>
                    // console.log(error);
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});

export default PDFViewer
