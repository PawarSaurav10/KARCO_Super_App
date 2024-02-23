import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, BackHandler, ActivityIndicator, Dimensions, Modal } from 'react-native'
import NoDataFound from '../../../Components/NoDataFound';
import images from '../../../Constants/images';
import Header from '../../../Components/Header';
import { COLORS } from '../../../Constants/theme';
import ReactNativeBlobUtil from 'react-native-blob-util'
import { FlatList } from '../../../node_modules/react-native-gesture-handler';
import moment from "moment"
import CertificatesCard from '../../../Components/CertificatesCard';
import Pdf from '../../../node_modules/react-native-pdf';

const CertificatesScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [directory, setDirectory] = useState([])
    const [viewPdf, setViewPdf] = useState(false)
    const [viewItem, setViewItem] = useState(null)

    const backAction = () => {
        navigation.replace("Online_Home")
        return true;
    };

    const docPath = ReactNativeBlobUtil.fs.dirs.DownloadDir;
    const getDirectoryList = async () => {
        await ReactNativeBlobUtil.fs
            .lstat(docPath + "/Documents")
            .then(response => {
                setDirectory(response);
                setIsLoading(false)
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        getDirectoryList();
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, [])

    const onViewClick = (data) => {
        setViewPdf(true)
        setViewItem(data)
    }

    const deleteFile = (item) => {
        ReactNativeBlobUtil.fs.unlink(item.path)
        setIsLoading(true)
        getDirectoryList()
    }

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
            {isLoading &&
                <ActivityIndicator
                    style={{ flex: 1 }}
                    size="large"
                    color={COLORS.primary}
                />
            }

            {!isLoading &&
                <View style={{ flex: 1, padding: 10 }}>
                    {directory.length > 0 &&
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={directory}
                                keyExtractor={item => item.filename}
                                renderItem={({ item, index }) => (
                                    <CertificatesCard
                                        videoName={item.filename}
                                        createdDate={moment.unix(item.lastModified / 1000).format("DD/MM/YYYY")}
                                        onViewClick={onViewClick}
                                        onDelete={deleteFile}
                                        data={item}
                                    />
                                )}
                            />
                        </View>
                    }
                    {directory.length === 0 &&
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <NoDataFound title="No Certificates Downloaded" desc="Please complete assessment and generate the Certificates." imageType="NoData" />
                        </View>
                    }
                </View>
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={viewPdf}
                onRequestClose={() => {
                    setViewPdf(false)
                }}>
                <View
                    style={{
                        width: "100%",
                        height: '100%',
                        marginTop: 'auto',
                        backgroundColor: COLORS.white2,
                    }}>
                    <View style={{ justifyContent: "flex-end", position: "absolute", top: 16, left: 16, zIndex: 10 }}>
                        <TouchableOpacity
                            onPress={() => {
                                setViewPdf(false)
                            }}>
                            <Image source={images.close_icon} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    </View>
                    <Pdf
                        enablePaging={true}
                        scale={1.0}
                        minScale={1.0}
                        trustAllCerts={false}
                        source={{
                            uri: `file://${viewItem && viewItem.path}`
                        }}
                        style={{ flex: 1, position: "relative" }}
                        renderActivityIndicator={() =>
                            <ActivityIndicator color={COLORS.blue} size={"large"} />
                        }
                    />
                </View>
            </Modal>
        </View>
    )
}

export default CertificatesScreen
