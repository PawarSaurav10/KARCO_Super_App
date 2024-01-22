import React, { useState, useEffect } from 'react'
import { View, Text, useColorScheme, BackHandler, StatusBar, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native'
import { useNavigation, useIsFocused } from '@react-navigation/core';
import { getCompanyUserData } from '../../../Utils/getScreenVisisted';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Header from '../../../Components/Header';
import { COLORS } from '../../../Constants/theme';
import { ProgressChart } from 'react-native-chart-kit';
import moment from "moment"
import { LinearGradient, Defs, Stop } from 'react-native-svg';
import { VictoryChart, VictoryLabel, VictoryBar, VictoryAxis, VictoryTooltip, VictoryVoronoiContainer, VictoryLine, VictoryScatter, VictoryTheme } from 'victory-native';
import SelectDropdown from 'react-native-select-dropdown';
import KPIHomeScreenLoader from '../../../Components/KPIHomeScreenLoader';
import { getURL } from '../../../baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import images from '../../../Constants/images';
import CustomAlert from '../../../Components/CustomAlert';


const HomeScreen = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [userLoginData, setUserLoginData] = useState({
        companyId: null,
    })
    const [buttonType, setButtonType] = useState("Overall")
    const [performanceType, setPerformanceType] = useState("Top")
    const [selectedDays, setSelectedDays] = useState("90 Days")
    const [isLoading, setIsLoading] = useState(true)
    const [totalPercentage, setTotalPercentage] = useState(null)
    const [topPerformance, setTopPerformance] = useState([])
    const [bottomPerformance, setBottomPerformance] = useState([])
    const [day30LineData, setDay30LineData] = useState([])
    const [day60LineData, setDay60LineData] = useState([])
    const [day90LineData, setDay90LineData] = useState([])
    const [dueData, setDueData] = useState({
        tenDays: null,
        minustenDays: null,
        twentyDays: null,
        minustwentyDays: null,
        thirtyDays: null,
        minusthirtyDays: null,
    })
    const [importExportData, setImportExportData] = useState({
        ImportDays: null,
        ExportDays: null,
        ImportColor: null,
        ExportColor: null,
    })

    const [OverAllData, setOverAllData] = useState({
        KVAvg: null,
        CCAvg: null,
        ReflAvg: null,
        ResAvg: null,
        RespAvg: null,
        KVColor: null,
        CCColor: null,
        RefColor: null,
        RespColor: null,
        ResColor: null,
    })
    const [orientation, setOrientation] = useState()
    const [viewAlert, setViewAlert] = useState({
        isShow: false,
        AlertType: ""
    })
    const daysData = ["90 Days", "60 Days", "30 Days"]

    /**
    * Returns true if the screen is in portrait mode
    */
    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    /**
     * Returns true of the screen is in landscape mode
     */
    const isLandscape = () => {
        const dim = Dimensions.get('screen');
        return dim.width >= dim.height;
    };

    useEffect(() => {
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            setOrientation(
                isPortrait() ? 'portrait' : 'landscape'
            );
        });
    }, [orientation])


    const logOut = async () => {
        await AsyncStorage.removeItem("screen_visited")
        await AsyncStorage.removeItem("userCompanyData_")
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        })
    }

    const backAction = () => {
        setViewAlert({
            isShow: true,
            AlertType: "Logout"
        })
        return true;
    };

    function CheckConnectivity() {
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.fetch().then(xx => {
                if (xx.isConnected) {
                } else {
                    setViewAlert({
                        isShow: true,
                        AlertType: "Internet"
                    })
                }
            });
        }
    }

    useEffect(() => {
        CheckConnectivity()
        getCompanyUserData().then((res) => {
            setUserLoginData({
                companyId: res.companyId,
            })
        });
    }, [])

    useEffect(() => {
        if (isFocused) {
            const dim = Dimensions.get('screen');
            if (dim.height >= dim.width) {
                setOrientation("protrait")
            } else {
                setOrientation("landscape")
            }
            CheckConnectivity()
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            )
            if (userLoginData.companyId) {

                axios.get(`${getURL.KPI_base_URL}/GetOverallPercByCompanyId?companyId=${userLoginData.companyId}&KPITypeId=${buttonType === "Overall" ? "1" : "2"}`)
                    .then((res) => {
                        setTotalPercentage(res.data)
                    })

                axios.get(`${getURL.KPI_base_URL}/GetIndividualPercByCompanyId?CompanyId=${userLoginData.companyId}&KPITypeId=${buttonType === "Overall" ? "1" : "2"}`)
                    .then((res) => {
                        setOverAllData({
                            KVAvg: res.data.KVAvg,
                            CCAvg: res.data.CCAvg,
                            ReflAvg: res.data.ReflAvg,
                            ResAvg: res.data.ResAvg,
                            RespAvg: res.data.RespAvg,
                            KVColor: res.data.KVColor,
                            CCColor: res.data.CCColor,
                            RefColor: res.data.RefColor,
                            RespColor: res.data.RespColor,
                            ResColor: res.data.ResColor,
                        })
                        // setIsLoading(false)
                    })

                axios.get(`${getURL.KPI_base_URL}/GetTopBottomPercByCompanyId?CompanyId=${userLoginData.companyId}&KPITypeId=${buttonType === "Overall" ? 1 : 2}`)
                    .then((res) => {
                        let topPerformanceData = res.data.TopPerformer
                        let botttomPerformanceData = res.data.BottomPerformer
                        let arryTopPerformance = topPerformanceData.split(",")
                        let arryBottmPerformance = botttomPerformanceData.split(",")
                        setTopPerformance(arryTopPerformance)
                        setBottomPerformance(arryBottmPerformance)
                    })

                axios.get(`${getURL.KPI_base_URL}/GetSummaryDataByCompanyId?companyId=${userLoginData.companyId}`)
                    .then((res) => {
                        let temp30Data = []
                        res.data.ChartFor30.map((aa) => {
                            return temp30Data.push({
                                ...aa,
                                date: moment(aa.date).format("D MMM YY"),
                                value: aa.value
                            })
                        })
                        let temp60Data = []
                        res.data.ChartFor60.map((aa) => {
                            return temp60Data.push({
                                ...aa,
                                date: moment(aa.date).format("D MMM YY"),
                                value: aa.value
                            })
                        })
                        let temp90Data = []
                        res.data.ChartFor90.map((aa) => {
                            return temp90Data.push({
                                ...aa,
                                date: moment(aa.date).format("D MMM YY"),
                                value: aa.value
                            })
                        })
                        setDay30LineData(temp30Data)
                        setDay60LineData(temp60Data)
                        setDay90LineData(temp90Data)
                    })

                axios.get(`${getURL.KPI_base_URL}/GetTrainigOverdueByCompanyId?companyId=${userLoginData.companyId}`)
                    .then((res) => {
                        setDueData({
                            tenDays: JSON.parse(res.data.TenDays === "NaN" ? 0 : res.data.TenDays),
                            twentyDays: JSON.parse(res.data.TwentyDays === "NaN" ? 0 : res.data.TwentyDays),
                            thirtyDays: JSON.parse(res.data.ThirtyDays === "NaN" ? 0 : res.data.ThirtyDays),
                            minustenDays: JSON.parse(res.data.TenDaysOverdue === "NaN" ? 0 : res.data.TenDaysOverdue),
                            minustwentyDays: JSON.parse(res.data.TwentyDaysOverdue === "NaN" ? 0 : res.data.TwentyDaysOverdue),
                            minusthirtyDays: JSON.parse(res.data.ThirtyDaysOverdue === "NaN" ? 0 : res.data.ThirtyDaysOverdue),
                        })
                    })

                axios.get(`${getURL.KPI_base_URL}/GetImportExportReportByCompanyId?companyId=${userLoginData.companyId}`)
                    .then((res) => {
                        setImportExportData({
                            ImportDays: res.data.ImportDays,
                            ExportDays: res.data.ExportDays,
                            ImportColor: res.data.ImportColor,
                            ExportColor: res.data.ExportColor,
                        })
                    })
            }
            return () => {
                backHandler.remove();
                setIsLoading(false)
            }
        }
    }, [userLoginData, buttonType])

    const Percentage = totalPercentage / 100

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: Colors.lighter }}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={isDarkMode ? Colors.darker : Colors.lighter}
            />
            <Header
                titleStyle={{
                    fontSize: 16, fontWeight: "bold"
                }}
                leftComponent={
                    <TouchableOpacity
                        style={{ justifyContent: "flex-start", padding: 6, marginHorizontal: 12 }}
                        onPress={() => navigation.openDrawer()}
                    >
                        <Image source={images.menu_2_icon} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                }
                title={"KEY PERFORMANCE INDICATOR"}
            />
            <View style={{ flex: 1 }}>
                {isLoading &&
                    <KPIHomeScreenLoader />
                }
                {!isLoading &&
                    <View style={{ flex: 1 }}>
                        <View style={{ backgroundColor: COLORS.white2 }}>
                            <View style={{ margin: 10, flexDirection: "row" }}>
                                <TouchableOpacity style={buttonType == "Overall" ? styles.active_circle_button : styles.circle_button}
                                    onPress={() => {
                                        CheckConnectivity()
                                        setButtonType("Overall")
                                        setSelectedDays("90 Days")
                                        setPerformanceType("Top")
                                        setIsLoading(true)
                                    }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: `${buttonType == "Overall" ? "#004C6B" : "#898B9A"}` }}>Overall</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={buttonType == "Monthly" ? styles.active_circle_button : styles.circle_button}
                                    onPress={() => {
                                        CheckConnectivity()
                                        setButtonType("Monthly")
                                        setSelectedDays("90 Days")
                                        setPerformanceType("Top")
                                        setIsLoading(true)
                                    }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: `${buttonType == "Monthly" ? "#004C6B" : "#898B9A"}` }}>Monthly</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                padding: 12,
                            }}>
                                {/* Overall Progress Chart */}
                                <View style={{ backgroundColor: "white", padding: 10, borderRadius: 10 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "black", textAlign: "center" }}>{buttonType} Completion Status</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "center", margin: 10, alignItems: "center" }}>
                                        <View style={{ position: "absolute", zIndex: 10 }}>
                                            <Text style={{ fontSize: 52, textAlign: "center", fontWeight: "bold", color: `${Percentage >= 0.7 ? "rgba(0,181,105,1)" : Percentage >= 0.5 ? "rgba(237,199,0,1)" : "rgba(255, 0, 0,1)"}` }}>{totalPercentage}
                                                <Text style={{ fontSize: 36 }}>%</Text>
                                            </Text>
                                        </View>
                                        <View style={{ position: "relative" }}>
                                            <ProgressChart
                                                data={{
                                                    data: [Percentage],
                                                    colors: [
                                                        `${Percentage >= 0.7 ? "rgba(0,181,105,1)" : Percentage >= 0.5 ? "rgba(237,199,0,1)" : "rgba(255, 0, 0,1)"}`,
                                                    ],
                                                }}
                                                width={Dimensions.get('window').width / 2}
                                                height={150}
                                                strokeWidth={8}
                                                hideLegend={true}
                                                withCustomBarColorFromData={true}
                                                radius={60}
                                                chartConfig={{
                                                    backgroundGradientFromOpacity: 0.5,
                                                    backgroundGradientToOpacity: 1,
                                                    backgroundColor: "#FFFFFF",
                                                    backgroundGradientFrom: "#FFFFFF",
                                                    backgroundGradientTo: "#FFFFFF",
                                                    color: (opacity = 1, _index) => ` rgba(0, 0, 0, ${opacity})`,
                                                }}
                                                style={{ marginVertical: 8, borderRadius: 10, }} />
                                        </View>
                                    </View>
                                </View>

                                {/* Individual Completion Percentage Bar Graph */}
                                <View style={{ backgroundColor: "white", padding: 10, borderRadius: 10, marginTop: 16 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "black", textAlign: "left" }}>Individual {buttonType} Completion Percentage</Text>
                                    <View>
                                        <VictoryChart
                                            maxDomain={{ y: 100 }}
                                            padding={{ bottom: 50, left: 40, right: 60, top: 40 }}
                                            width={Dimensions.get("window").width}
                                            style={{
                                                parent: {
                                                    border: "1px solid #ccc"
                                                },
                                            }}
                                            domainPadding={{ x: 20, y: 20 }}
                                        >
                                            {/* </Svg> */}
                                            <VictoryAxis
                                                style={{
                                                    axisLabel: { fontSize: 14, padding: 28, fontWeight: "bold" },
                                                    tickLabels: { padding: 6 }
                                                }}
                                                label="Percentage (%)"
                                                dependentAxis
                                                tickLabelComponent={<VictoryLabel width={12} style={{ fontSize: 12, paddingLeft: 10 }} />}
                                            />
                                            <Defs>
                                                <LinearGradient id={'gradient'} x1={'0%'} y={'0%'} x2={'0%'} y2={'100%'}>
                                                    <Stop offset={'10%'} stopColor={'rgb(0,181,105)'} />
                                                    <Stop offset={'50%'} stopColor={'rgb(237,199,0)'} />
                                                    <Stop offset={'100%'} stopColor={'rgb(255, 0, 0)'} />
                                                </LinearGradient>
                                                <LinearGradient id={'gradient1'} x1={'0%'} y={'0%'} x2={'0%'} y2={'100%'}>
                                                    {/* <Stop offset={'0%'} stopColor={'rgb(0,181,105)'} /> */}
                                                    <Stop offset={'10%'} stopColor={'rgb(237,199,0)'} />
                                                    <Stop offset={'100%'} stopColor={'rgb(255, 0, 0)'} />
                                                </LinearGradient>
                                                <LinearGradient id={'gradient2'} x1={'0%'} y={'0%'} x2={'0%'} y2={'100%'}>
                                                    <Stop offset={'0%'} stopColor={'rgb(237,199,0)'} />
                                                    <Stop offset={'25%'} stopColor={'rgb(255, 0, 0)'} />
                                                </LinearGradient>
                                            </Defs>
                                            <VictoryBar
                                                data={[
                                                    { quarter: "KARCO\nVideo", earnings: OverAllData.KVAvg, color: OverAllData.KVColor },
                                                    { quarter: "Company\n Content", earnings: OverAllData.CCAvg, color: OverAllData.CCColor },
                                                    { quarter: "Reflective", earnings: OverAllData.ReflAvg, color: OverAllData.RefColor },
                                                    { quarter: "Resilience", earnings: OverAllData.ResAvg, color: OverAllData.RespColor },
                                                    { quarter: "Responsive", earnings: OverAllData.RespAvg, color: OverAllData.ResColor }
                                                ]}
                                                labels={({ datum }) => `${parseFloat(datum.earnings).toFixed(0)}%`}
                                                sortOrder="ascending"
                                                animate={{
                                                    duration: 1000,
                                                    onLoad: { duration: 500 },
                                                }}
                                                x="quarter" y="earnings"
                                                cornerRadius={{ top: 4 }}
                                                barWidth={18}
                                                height={400}
                                                style={{ data: { fill: ({ datum }) => datum.earnings >= 70 ? `url(#gradient)` : datum.earnings >= 51 ? `url(#gradient1)` : `url(#gradient2)` } }}
                                            />
                                            <VictoryAxis
                                                style={{
                                                    axisLabel: { fontSize: 20, padding: 30 },
                                                    ticks: { stroke: "grey", size: 10 },
                                                    tickLabels: { padding: 5 }
                                                }}
                                                tickLabelComponent={<VictoryLabel dy={5} style={{ fontSize: 12, marginTop: 10 }} angle={-20} />}
                                            />
                                        </VictoryChart>
                                    </View>
                                </View>

                                {/* Top / Bottom Performers  */}
                                <View style={{ backgroundColor: "white", padding: 10, borderRadius: 10, marginTop: 16 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "black", textAlign: "left" }}>{buttonType} Top / Bottom Performers At Present</Text>
                                    <View style={{ marginVertical: 12, flexDirection: "row" }}>
                                        <TouchableOpacity style={[performanceType == "Top" ? styles.active_circle_button : styles.circle_button, { flexDirection: "row", alignItems: "center" }]}
                                            onPress={() => {
                                                setPerformanceType("Top")
                                            }}>
                                            <Image source={images.top_icon} style={{ width: 16, height: 16, marginRight: 4 }} />
                                            <Text style={{ fontSize: 16, fontWeight: "bold", color: `${performanceType == "Top" ? "#00b569" : "#898B9A"}` }}>Top Performers</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[performanceType == "Bottom" ? styles.active_circle_button : styles.circle_button, { flexDirection: "row", alignItems: "center" }]}
                                            onPress={() => {
                                                setPerformanceType("Bottom")
                                            }}>
                                            <Image source={images.down_arrow_icon} style={{ width: 16, height: 16, marginRight: 4 }} />
                                            <Text style={{ fontSize: 16, fontWeight: "bold", color: `${performanceType == "Bottom" ? "#ff0000" : "#898B9A"}` }}>Bottom Performers</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        {performanceType === "Top" && topPerformance.map((aa, idx) => (
                                            <View key={idx} style={{ borderColor: Colors.lighter, borderRadius: 6, padding: 6, margin: 4, borderWidth: 2, flexDirection: "row", alignItems: "center" }}>
                                                <Image source={images.up_arrow_icon} style={{ marginRight: 8, width: 20, height: 20 }} />
                                                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#004C6B" }}>{aa}</Text>
                                            </View>
                                        ))}
                                        {performanceType === "Bottom" && bottomPerformance.map((aa, idx) => {
                                            return (
                                                <View key={idx}>
                                                    {aa !== "No record exist" ? (
                                                        <View style={{ borderColor: Colors.lighter, borderRadius: 6, padding: 6, margin: 4, borderWidth: 2, flexDirection: "row", alignItems: "center" }}>
                                                            {aa !== "No record exist" && <Image source={images.double_down_arrow_icon} style={{ marginRight: 8, width: 20, height: 20 }} />}
                                                            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#004C6B" }}>{aa}</Text>
                                                        </View>
                                                    ) : (
                                                            <View style={{ padding: 6, margin: 4, alignItems: "center", justifyContent: "center" }}>
                                                                <Image source={images.empty_box_icon} style={{ width: 40, height: 40, marginBottom: 8 }} />
                                                                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#004C6B" }}>{aa}</Text>
                                                            </View>
                                                        )
                                                    }
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>

                                {/* Training Summary Line and Scatter Graph */}
                                <View style={{ backgroundColor: "white", padding: 10, borderRadius: 10, marginTop: 16, flex: 1 }}>
                                    <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between", alignItems: "center" }}>
                                        <View style={{ flex: 0.6 }}>
                                            <Text style={{ fontSize: 16, fontWeight: "bold", color: "black", textAlign: "left" }}>Training Summary Over The Last</Text>
                                        </View>
                                        <View style={{ flex: 0.4, alignItems: "flex-end" }}>
                                            <SelectDropdown
                                                key={daysData}
                                                rowStyle={styles.dropdown2RowStyle}
                                                rowTextStyle={styles.dropdown2RowTxtStyle}
                                                dropdownStyle={{
                                                    borderBottomLeftRadius: 12,
                                                    borderBottomRightRadius: 12,
                                                }}
                                                buttonStyle={{ width: 100, height: 30, borderRadius: 12 }}
                                                buttonTextStyle={{ fontSize: 14 }}
                                                renderDropdownIcon={() => {
                                                    return (
                                                        <Image source={images.arrow_down_icon} style={{ width: 10, height: 10 }} />
                                                    )
                                                }}
                                                dropdownIconPosition="right"
                                                defaultValue={selectedDays === "" ? "90 Days" : selectedDays}
                                                data={daysData}
                                                onSelect={(selectedItem, index) => {
                                                    setSelectedDays(selectedItem)
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <VictoryChart theme={VictoryTheme.grayscale} maxDomain={{ y: 100 }} minDomain={{ y: 1 }}
                                            padding={{ bottom: 60, left: 40, right: 30, top: 20 }}
                                            domainPadding={{ x: 20, y: 20 }}
                                            width={Dimensions.get("window").width - 20}
                                            containerComponent={
                                                <VictoryVoronoiContainer
                                                    voronoiBlacklist={["scatter"]}
                                                    labels={({ datum }) => `${parseFloat(datum.value).toFixed(0)}%, ${datum.date}`}
                                                    labelComponent={
                                                        <VictoryTooltip dy={-7} constrainToVisibleArea />
                                                    }
                                                />
                                            }
                                            standalone={true}
                                            style={{
                                                parent: {
                                                    border: "1px solid #ccc"
                                                },
                                            }}
                                        >
                                            <VictoryAxis
                                                style={{
                                                    axisLabel: { fontSize: 14, padding: 28, fontWeight: "bold" },
                                                    grid: { strokeWidth: 0.5, stroke: "grey", strokeDasharray: 10 },
                                                    ticks: { stroke: "grey", size: 4 },
                                                    tickLabels: { padding: 4 },
                                                }}
                                                label="Percentage (%)"
                                                dependentAxis
                                                tickLabelComponent={<VictoryLabel width={12} style={{ fontSize: 12, paddingLeft: 10 }} />}
                                            />
                                            <VictoryAxis
                                                fixLabelOverlap={true}
                                                style={{
                                                    axisLabel: { fontSize: 14, padding: 60, fontWeight: "bold" },
                                                    ticks: { stroke: "grey", size: 10 },
                                                    tickLabels: { padding: 2 }
                                                }}
                                                tickLabelComponent={<VictoryLabel dy={5} style={{ fontSize: 12, marginTop: 10 }} angle={selectedDays === "30 Days" ? 0 : selectedDays === "60 Days" ? -25 : -30} textAnchor={selectedDays === "30 Days" ? "middle" : selectedDays === "60 Days" ? "end" : "end"} />}
                                            />
                                            <VictoryLine
                                                name="line"
                                                style={{
                                                    data: {
                                                        stroke: "#004C6B",
                                                        strokeWidth: 4
                                                    },
                                                }}
                                                data={selectedDays === "30 Days" ? day30LineData : selectedDays === "60 Days" ? day60LineData : selectedDays === "90 Days" ? day90LineData : day90LineData}
                                                x="date" y="value"
                                                interpolation="natural"
                                                animate={{
                                                    duration: 3000,
                                                    onLoad: { duration: 2000 },

                                                }}
                                            />
                                            <VictoryScatter
                                                name="scatter"
                                                animate={{
                                                    duration: 3000,
                                                    onLoad: { duration: 2000 },
                                                }}
                                                style={{ data: { fill: "#c43a31" } }}
                                                size={6}
                                                x="date"
                                                y="value"
                                                standalone={false}
                                                data={selectedDays === "30 Days" ? day30LineData : selectedDays === "60 Days" ? day60LineData : selectedDays === "90 Days" ? day90LineData : day90LineData}
                                            />
                                        </VictoryChart>
                                    </View>
                                </View>

                                {/* Training Due / Overdue Bar Graph */}
                                <View style={{ backgroundColor: "white", padding: 10, borderRadius: 10, marginTop: 16 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "black", textAlign: "left" }}>Training Due / Overdue Days</Text>
                                    <View>
                                        <VictoryChart
                                            maxDomain={{ y: 100 }}
                                            minDomain={{ y: 0 }}
                                            padding={{ bottom: 60, left: 30, right: 60, top: 40 }}
                                            width={Dimensions.get("window").width}
                                            style={{
                                                parent: {
                                                    border: "1px solid #ccc"
                                                },
                                            }}
                                            domainPadding={{ x: 20, y: 20 }}
                                        >
                                            <VictoryLabel
                                                text="Percentage (%)"
                                                x={orientation === "protrait" ? 180 : Dimensions.get("screen").width / 2.1}
                                                y={20}
                                                textAnchor="middle"
                                                style={{
                                                    fontSize: 14, padding: 24, fontWeight: "bold"
                                                }}
                                            />
                                            <VictoryAxis
                                                dependentAxis
                                                crossAxis
                                                offsetX={orientation === "protrait" ? 180 : Dimensions.get("screen").width / 2.1}
                                                height={400}
                                                style={{
                                                    axisLabel: { fontSize: 14, padding: 24, fontWeight: "bold" },
                                                    tickLabels: { padding: 10 }
                                                }}
                                                standalone={false}
                                            />
                                            <VictoryBar

                                                labels={({ datum }) => `${parseFloat(datum.earnings).toFixed()}%`}
                                                animate={{
                                                    duration: 2000,
                                                    onLoad: { duration: 1000 }
                                                }}
                                                sortKey={0}
                                                x="days" y="earnings"
                                                cornerRadius={{ top: 6 }}
                                                barWidth={24}
                                                height={400}
                                                data={[
                                                    { days: -10, earnings: dueData.minustenDays, colors: "#ff0000" },
                                                    { days: 10, earnings: dueData.tenDays, colors: "#22B573" },
                                                    { days: -20, earnings: dueData.minustwentyDays, colors: "#ff0000" },
                                                    { days: 20, earnings: dueData.twentyDays, colors: "#22B573" },
                                                    { days: 30, earnings: dueData.thirtyDays, colors: "#22B573" },
                                                    { days: -30, earnings: dueData.minusthirtyDays, colors: "#ff0000" },
                                                ]}
                                                tickLabelComponent={<VictoryLabel width={12} dx={4} style={{ fontSize: 12, paddingLeft: 10 }} />}
                                                style={{ data: { fill: ({ datum }) => datum.colors } }}
                                            />
                                            <VictoryAxis
                                                label="Due Date"
                                                domain={[-10, 10]}
                                                crossAxis={true}
                                                style={{
                                                    axisLabel: { fontSize: 14, padding: 36, fontWeight: "bold" },
                                                    ticks: { stroke: "grey", size: 10 },
                                                    tickLabels: { padding: 5 }
                                                }}
                                                tickLabelComponent={<VictoryLabel dy={5} style={{ fontSize: 12, marginTop: 10 }} />}
                                            />
                                        </VictoryChart>
                                    </View>
                                </View>

                                {/* Import & Export Days */}
                                <View style={{ flexDirection: "row", alignItems: "center", }}>
                                    <View style={{ backgroundColor: "#003140", padding: 8, borderRadius: 10, marginTop: 16, flex: 1, marginRight: 10 }}>
                                        <Text style={{ fontSize: 16, fontWeight: "bold", color: "white", textAlign: "left" }}>Days Since Last Import</Text>
                                        <Text style={{ marginVertical: 12, fontSize: 28, fontWeight: "bold", color: importExportData.ImportColor }}>
                                            {importExportData.ImportDays}
                                        </Text>
                                    </View>
                                    <View style={{ backgroundColor: "#003140", padding: 8, borderRadius: 10, marginTop: 16, flex: 1 }}>
                                        <Text style={{ fontSize: 16, fontWeight: "bold", color: "white", textAlign: "left" }}>Days Since Last Export</Text>
                                        <Text style={{ marginVertical: 12, fontSize: 28, fontWeight: "bold", color: importExportData.ExportColor }}>
                                            {importExportData.ExportDays}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                        {viewAlert.isShow && (
                            <CustomAlert
                                isView={viewAlert.isShow}
                                Title={viewAlert.AlertType === "Internet" ? "Oops !!" : "Hold on!"}
                                Content={viewAlert.AlertType === "Internet" ?
                                    "Your Device is not Connected to Internet, Please Check your Internet Connectivity"
                                    : "Are you sure you want to logout of the App?"}
                                buttonContainerStyle={{
                                    flexDirection: "row"
                                }}
                                ButtonsToShow={[
                                    {
                                        text: 'Cancel',
                                        onPress: () => {
                                            setViewAlert({
                                                isShow: false,
                                                AlertType: ""
                                            })
                                        },
                                        toShow: viewAlert.AlertType === "Logout" ? true : false,
                                    },
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            if (viewAlert.AlertType === "Internet") {
                                                navigation.reset({
                                                    index: 0,
                                                    routes: [{ name: "Home" }],
                                                })
                                            } else {
                                                logOut()
                                            }
                                            setViewAlert({
                                                isShow: false,
                                                AlertType: ""
                                            })
                                        },
                                        toShow: true,
                                    }
                                ]}
                            />
                        )}
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    circle_button: {
        margin: 4,
        padding: 4,
    },
    active_circle_button: {
        borderColor: "#004C6B",
        borderBottomWidth: 2,
        margin: 4,
        padding: 4,
    },
    dropdown2RowStyle: { borderBottomColor: '#C5C5C5', height: 30 },
    dropdown2RowTxtStyle: {
        textAlign: 'center',
        fontSize: 14,
    },
    elevation: {
        elevation: 20,
        shadowColor: '#52006A',
    },
    shadowProp: {
        shadowColor: COLORS.white,
        shadowOffset: {
            width: 120,
            height: 120
        },
        shadowRadius: 120,
        shadowOpacity: 1.0
    },
})

export default HomeScreen
