import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated,
    ScrollView,
    Dimensions
} from "react-native";
import {
    createDrawerNavigator,
    DrawerContentScrollView,
} from "@react-navigation/drawer";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSelectedTab } from "../store/actions/tabActions";
import { COLORS, SIZES } from "../Constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData_1, getUserData, getCompanyUserData } from "../Utils/getScreenVisisted";
import MainLayout from "../MainAppScreens/MainLayout";
import images from "../Constants/images";
const Drawer = createDrawerNavigator();

const CustomDrawerItem = ({ label, icon, isFocused, onPress }) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection: "row",
                height: 40,
                marginBottom: SIZES.base,
                alignItems: "center",
                paddingLeft: SIZES.radius,
                borderRadius: SIZES.base,
                backgroundColor: isFocused ? COLORS.transparentBlack1 : null,
            }}
            onPress={onPress}
        >
            <Image
                source={icon}
                style={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.white,
                }}
            />

            <Text
                style={{
                    marginLeft: 15,
                    color: COLORS.white,
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const CustomDrawerContent = ({ navigation, selectedTab, setSelectedTab, appName }) => {
    const [orientation, setOrientation] = useState()
    const [companyLoginData, setCompanyLoginData] = useState({
        companyId: null,
        companyName: null,
        companyLogoName: null,
        companyLogoPath: null,
        NoOfShips: null
    })
    const l_loginReducer = useSelector(state => state.loginReducer)

    useEffect(() => {
        if (appName === "TrACE KPI") {
            getCompanyUserData().then((res) => {
                setCompanyLoginData({
                    companyId: res.companyId,
                    companyName: res.companyName,
                    companyLogoName: res.companyLogoName,
                    companyLogoPath: res.companyLogoPath,
                    NoOfShips: res.NoOfShips
                })
            });
        }
    }, [])

    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    useEffect(() => {
        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            setOrientation(
                isPortrait() ? 'portrait' : 'landscape'
            );
        });
    }, [orientation])

    useEffect(() => {
        const dim = Dimensions.get('screen');
        if (dim.height >= dim.width) {
            setOrientation("protrait")
        } else {
            setOrientation("landscape")
        }
    }, [])

    const OnlinelogOut = async () => {
        await AsyncStorage.removeItem("online_screen_visited")
        await AsyncStorage.removeItem("userData")
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        })
    }

    const KPIlogOut = async () => {
        await AsyncStorage.removeItem("screen_visited")
        await AsyncStorage.removeItem("userCompanyData_")
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        })
    }

    return (
        <DrawerContentScrollView
            scrollEnabled={true}
            contentContainerStyle={{ flex: 1, backgroundColor: COLORS.primary }}
        >
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: SIZES.radius,
                }}
            >
                {/* Profile */}
                {appName === "TrACE Online" ?
                    <View style={{ marginLeft: 8, marginBottom: 14, }}>
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                marginTop: SIZES.radius,
                                alignItems: "center",
                                marginBottom: 14
                            }}
                            onPress={() => {
                                navigation.closeDrawer();
                            }}
                        >
                            <Image
                                source={images.profile_icon}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: SIZES.radius,
                                }}
                            />
                        </TouchableOpacity>
                        <View>
                            <Text style={{ color: COLORS.white, fontSize: 20, textAlign: "left", marginBottom: 2 }}>
                                {l_loginReducer && l_loginReducer.userData.Name}
                            </Text>
                            <Text style={{ color: COLORS.gray2, fontSize: 14, textAlign: "left" }}>
                                {l_loginReducer && l_loginReducer.userData.VesselName}
                            </Text>
                        </View>
                    </View>
                    : <View style={{ marginTop: SIZES.radius, alignItems: "center", }}>
                        <Image
                            src={`https://trace.karco.in/Images/CompanyLogo/${companyLoginData.companyLogoPath}`}
                            style={{ width: 120, height: 120, borderRadius: 100 }}
                        />
                        <View style={{ marginTop: 16, alignItems: "center" }}>
                            <Text style={{ color: COLORS.white, fontSize: 20, borderBottomWidth: 2, borderBottomColor: "white", paddingBottom: 4, marginBottom: 8 }}>
                                {companyLoginData.companyName}
                            </Text>
                            <Text style={{ color: COLORS.white, fontSize: 16 }}>
                                {companyLoginData.NoOfShips} Ships
                        </Text>
                        </View>
                    </View>
                }

                {/* Line Divider */}
                <View
                    style={{
                        height: 1,
                        marginVertical: SIZES.height > 800 ? SIZES.radius : 0,
                        marginLeft: SIZES.radius,
                        marginTop: 6,
                        backgroundColor: COLORS.lightGray1,
                    }}
                />

                {orientation === "landscape" ?
                    <ScrollView>
                        <View
                            style={{
                                flex: orientation === "landscape" ? 0 : 1,
                                marginTop: SIZES.height > 800 ? SIZES.padding : SIZES.radius,
                            }}
                        >
                            <CustomDrawerItem
                                label={"Home"}
                                icon={images.home_icon}
                                isFocused={selectedTab == "Home"}
                                onPress={() => {
                                    setSelectedTab("Home");
                                    navigation.navigate(appName === "TrACE Online" ? "Online_Home" : "KPI_Home");
                                }}
                            />

                            {/* Line Divider */}
                            <View
                                style={{
                                    height: 1,
                                    marginVertical: SIZES.height > 800 ? SIZES.radius : 0,
                                    marginLeft: SIZES.radius,
                                    backgroundColor: COLORS.lightGray1,
                                }}
                            />

                            {appName === "TrACE Online" &&
                                <CustomDrawerItem
                                    label="Certificates"
                                    icon={images.certificate_icon}
                                    onPress={() => {
                                        navigation.navigate("Certificates");
                                        navigation.closeDrawer();
                                    }}
                                />
                            }
                        </View>

                        <View>
                            <CustomDrawerItem
                                label={"Logout"}
                                icon={images.logout_icon}
                                onPress={() => {
                                    appName === "TrACE Online" ? OnlinelogOut() : KPIlogOut()
                                    navigation.closeDrawer();
                                }}
                            />
                        </View>
                    </ScrollView> :
                    <>
                        <View
                            style={{
                                flex: orientation === "landscape" ? 0 : 1,
                                marginTop: SIZES.height > 800 ? SIZES.padding : SIZES.radius,
                            }}
                        >
                            <CustomDrawerItem
                                label={"Home"}
                                icon={images.home_icon}
                                isFocused={selectedTab == "Home"}
                                onPress={() => {
                                    setSelectedTab("Home");
                                    navigation.navigate(appName === "TrACE Online" ? "Online_Home" : "KPI_Home");
                                    navigation.closeDrawer();
                                }}
                            />
                            {appName === "KARCO Videos" &&
                                <CustomDrawerItem
                                    label={"Downloads"}
                                    icon={images.home_icon}
                                    isFocused={selectedTab == "Downloads"}
                                    onPress={() => {
                                        setSelectedTab("Downloads");
                                        navigation.navigate("Downloads");
                                    }}
                                />
                            }

                            {/* Line Divider */}
                            <View
                                style={{
                                    height: 1,
                                    marginVertical: SIZES.height > 800 ? SIZES.radius : 0,
                                    marginLeft: SIZES.radius,
                                    backgroundColor: COLORS.lightGray1,
                                }}
                            />

                            {appName === "TrACE Online" &&
                                <CustomDrawerItem
                                    label="Certificates"
                                    icon={images.certificate_black_icon}
                                    isFocused={selectedTab == "Certificates"}
                                    onPress={() => {
                                        navigation.navigate("Certificates");
                                        setSelectedTab("Certificates");
                                        navigation.closeDrawer();
                                    }}
                                />
                            }
                        </View>

                        <View>
                            <CustomDrawerItem
                                label={"Logout"}
                                icon={images.logout_icon}
                                onPress={() => {
                                    appName === "TrACE Online" ? OnlinelogOut() : KPIlogOut()
                                    navigation.closeDrawer();
                                }}
                            />
                        </View>
                    </>
                }
            </View>
        </DrawerContentScrollView>
    );
};

const DrawerNew = ({ selectedTab, setSelectedTab, route }) => {
    const [progress, setProgress] = React.useState(new Animated.Value(0));

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.primary,
            }}
        >
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false,
                    swipeEdgeWidth: route.params.appName === "KARCO Videos" ? -100 : 80,
                }}
                drawerType="slide"
                overlayColor="transparent"
                drawerStyle={{
                    flex: 1,
                    width: "65%",
                    paddingRight: 20,
                    backgroundColor: "transparent",
                }}
                sceneContainerStyle={{
                    backgroundColor: "transparent",
                }}
                // initialRouteName="Home"
                drawerContent={(props) => {
                    setTimeout(() => {
                        setProgress(props.progress);
                    }, 0);

                    return (
                        <CustomDrawerContent
                            appName={route.params.appName}
                            navigation={props.navigation}
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                        />
                    );
                }}
            >
                <Drawer.Screen name="MainLayout">
                    {(props) => (
                        <MainLayout {...props} appName={route.params.appName} videoType={route.params.type} />
                    )}
                </Drawer.Screen>
            </Drawer.Navigator>
        </View>
    );
};

function mapStateToProps(state) {
    return {
        selectedTab: state.tabReducer.selectedTab,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setSelectedTab: (selectedTab) => {
            return dispatch(setSelectedTab(selectedTab));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerNew);