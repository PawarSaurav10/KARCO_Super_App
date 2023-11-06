import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { COLORS } from '../Constants/theme';


const HomePageLoader = ({ orientationType }) => {
    return (
        <SkeletonPlaceholder borderRadius={6}>
            <View style={{ margin: 10, padding: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{
                        height: 40,
                        width: 40,
                        marginRight: 10,
                    }} ></View>
                    <View style={{
                        height: 30,
                        width: 200,
                    }}></View>
                </View>
                <View style={{
                    borderRadius: 35,
                    height: 35,
                    width: 35,
                }}>
                </View>
            </View>
            <View style={{ margin: 8, padding: 8 }}>
                <View style={{ paddingVertical: 6, borderRadius: 20, paddingHorizontal: 10, height: 40, width: "100%" }} />
            </View>
            <View style={{ margin: 4, padding: 8, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", }}>
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    margin: 4,
                    paddingVertical: 6,
                    paddingHorizontal: 16,
                    borderRadius: 20
                }}>
                    <View style={{ height: 22, width: 22, marginRight: 4 }} />
                    <View style={{ fontSize: 16, width: "60%" }} />
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    margin: 4,
                    paddingVertical: 6,
                    paddingHorizontal: 16,
                    borderRadius: 20
                }}>
                    <View style={{ height: 22, width: 22, marginRight: 4 }} />
                    <View style={{ fontSize: 16, width: "60%" }} />
                </View>
            </View>

            <View style={{
                marginHorizontal: 10,
                paddingHorizontal: 8,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Text style={{ fontSize: 16, width: 100 }}></Text>
                <Text style={{ fontSize: 14, width: 60 }}></Text>
            </View>
            <View style={{ flexDirection: "row", margin: 4, padding: 4, }}>
                <View>
                    <View style={{
                        borderWidth: 1,
                        borderColor: COLORS.lightGray1,
                        margin: 6,
                        padding: 10,
                        borderRadius: 12,
                        backgroundColor: "white",
                        width: orientationType === "landscape" ? Dimensions.get('window').width / 4.35 : Dimensions.get('window').width / 2.2,
                        display: 'flex',
                        flexDirection: "column"
                    }}>
                        <View style={{ height: 100, width: "100%", marginBottom: 8, borderRadius: 10, }} />
                        <View style={{ height: 56 }}>
                            <Text style={{ fontSize: 14, marginBottom: 6, }} />
                            <Text style={{ fontSize: 14, paddingBottom: 6, width: 60 }} />
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <View style={{ alignSelf: "baseline" }}>
                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginVertical: 6,
                                    borderRadius: 20,
                                    paddingHorizontal: 6,
                                    paddingVertical: 6,
                                    width: "100%",
                                }} />
                                <Text style={{ fontSize: 12, width: 60 }}></Text>
                            </View>
                            <View style={{ width: 12, height: 12 }} />
                        </View>
                    </View>
                </View>
                <View>
                    <View style={{
                        borderWidth: 1,
                        borderColor: COLORS.lightGray1,
                        margin: 6,
                        padding: 10,
                        borderRadius: 12,
                        backgroundColor: "white",
                        width: orientationType === "landscape" ? Dimensions.get('window').width / 4.35 : Dimensions.get('window').width / 2.2,
                        display: 'flex',
                        flexDirection: "column"
                    }}>
                        <View style={{ height: 100, width: "100%", marginBottom: 8, borderRadius: 10, }} />
                        <View style={{ height: 56 }}>
                            <Text style={{ fontSize: 14, marginBottom: 6, }} />
                            <Text style={{ fontSize: 14, paddingBottom: 6, width: 60 }} />
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <View style={{ alignSelf: "baseline" }}>
                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginVertical: 6,
                                    borderRadius: 20,
                                    paddingHorizontal: 6,
                                    paddingVertical: 6,
                                    width: "100%",
                                }} />
                                <Text style={{ fontSize: 12, width: 60 }}></Text>
                            </View>
                            <View style={{ width: 12, height: 12 }} />
                        </View>
                    </View>
                </View>
            </View>
            <View style={{
                marginHorizontal: 10,
                paddingHorizontal: 8,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Text style={{ fontSize: 16, width: 120 }}></Text>
                <Text style={{ fontSize: 14, width: 60 }}></Text>
            </View>
            <View style={{ margin: 4, padding: 8, }}>
                <View
                    style={{ padding: 10, marginVertical: 4, borderWidth: 1, borderRadius: 10, borderColor: COLORS.lightGray1, backgroundColor: "white" }}
                >
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                        <View style={{ height: 60, width: 60, marginBottom: 4, borderRadius: 10 }} />
                        <View style={{ paddingLeft: 12, flex: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4, marginBottom: 4 }}>
                                <Text style={{ fontSize: 12, fontWeight: "bold", width: 100 }} />
                                <View style={{ width: 40, height: 20 }} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, marginBottom: 6, flexWrap: 'wrap' }} />
                                <Text style={{ fontSize: 14, paddingBottom: 2, flexWrap: 'wrap', width: 200 }} />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4, marginBottom: 4 }}>
                                <View style={{
                                    paddingVertical: 4,
                                    paddingHorizontal: 8,
                                    width: 120,
                                    height: 16
                                }} />
                                <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
                                    <View style={{ width: 20, height: 20 }} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View
                    style={{ padding: 10, marginVertical: 4, borderWidth: 1, borderRadius: 10, borderColor: COLORS.lightGray1, backgroundColor: "white" }}
                >
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                        <View style={{ height: 60, width: 60, marginBottom: 4, borderRadius: 10 }} />
                        <View style={{ paddingLeft: 12, flex: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4, marginBottom: 4 }}>
                                <Text style={{ fontSize: 12, fontWeight: "bold", width: 100 }} />
                                <View style={{ width: 40, height: 20 }} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, marginBottom: 6, flexWrap: 'wrap' }} />
                                <Text style={{ fontSize: 14, paddingBottom: 2, flexWrap: 'wrap', width: 200 }} />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4, marginBottom: 4 }}>
                                <View style={{
                                    paddingVertical: 4,
                                    paddingHorizontal: 8,
                                    width: 120,
                                    height: 16
                                }} />
                                <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
                                    <View style={{ width: 20, height: 20 }} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </SkeletonPlaceholder>
    )
}

export default HomePageLoader
