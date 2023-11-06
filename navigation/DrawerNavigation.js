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
import profile_img from "../Images/profile.png";
import { COLORS, SIZES } from "../Constants/theme";
import HomeIcon from "../Images/home.png"
import SettingsIcon from "../Images/settings.png"
import FAQIcon from "../Images/help.png"
import SupportIcon from "../Images/support.png"
import LogoutIcon from "../Images/logout.png"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData_1, getUserData, getCompanyUserData } from "../Utils/getScreenVisisted";
import MainLayout from "../MainAppScreens/MainLayout";
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
    const [userProfileData, setUserProfileData] = useState()
    const [orientation, setOrientation] = useState()
    const [companyLoginData, setCompanyLoginData] = useState({
        userId: null,
        password: null,
        companyId: null,
        companyName: null,
        companyLogoName: null,
        companyLogoPath: null,
        NoOfShips: null
    })

    useEffect(() => {
        getCompanyUserData().then((res) => {
            setCompanyLoginData({
                userId: res.userId,
                password: res.password,
                companyId: res.companyId,
                companyName: res.companyName,
                companyLogoName: res.companyLogoName,
                companyLogoPath: res.companyLogoPath,
                NoOfShips: res.NoOfShips
            })
        });
    }, [appName === "TrACE KPI"])

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
        if (appName === "TrACE Online") {
            getUserData_1().then((res) => {
                setUserProfileData(res.userData)
            });
        }
        const dim = Dimensions.get('screen');
        if (dim.height >= dim.width) {
            setOrientation("protrait")
        } else {
            setOrientation("landscape")
        }
    }, [appName === "TrACE Online"])

    const OnlinelogOut = async () => {
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
                                source={profile_img}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: SIZES.radius,
                                }}
                            />
                        </TouchableOpacity>
                        <View>
                            <Text style={{ color: COLORS.white, fontSize: 20, textAlign: "left", marginBottom: 2 }}>
                                {userProfileData ?.Name}
                            </Text>
                            <Text style={{ color: COLORS.gray2, fontSize: 14, textAlign: "left" }}>
                                {userProfileData ?.EmailId}
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
                                icon={HomeIcon}
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

                            <CustomDrawerItem
                                label="Settings"
                                icon={SettingsIcon}
                                onPress={() => {
                                    navigation.closeDrawer();
                                }}
                            />

                            <CustomDrawerItem
                                label="Help Center"
                                icon={SupportIcon}
                                onPress={() => {
                                    navigation.closeDrawer();
                                }}
                            />

                            <CustomDrawerItem
                                label="FAQ"
                                icon={FAQIcon}
                                onPress={() => {
                                    navigation.closeDrawer();
                                }}
                            />
                        </View>

                        <View>
                            <CustomDrawerItem
                                label={"Logout"}
                                icon={LogoutIcon}
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
                                icon={HomeIcon}
                                isFocused={selectedTab == "Home"}
                                onPress={() => {
                                    setSelectedTab("Home");
                                    navigation.navigate(appName === "TrACE Online" ? "Online_Home" : "KPI_Home");
                                }}
                            />
                            {appName === "KARCO Videos" &&
                                <CustomDrawerItem
                                    label={"Downloads"}
                                    icon={HomeIcon}
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

                            <CustomDrawerItem
                                label="Settings"
                                icon={SettingsIcon}
                                onPress={() => {
                                    navigation.closeDrawer();
                                }}
                            />

                            <CustomDrawerItem
                                label="Help Center"
                                icon={SupportIcon}
                                onPress={() => {
                                    navigation.closeDrawer();
                                }}
                            />

                            <CustomDrawerItem
                                label="FAQ"
                                icon={FAQIcon}
                                onPress={() => {
                                    navigation.closeDrawer();
                                }}
                            />
                        </View>

                        <View
                        // style={{
                        //   // marginBottom: SIZES.height > 800 ? SIZES.padding : 0,
                        // }}
                        >
                            <CustomDrawerItem
                                label={"Logout"}
                                icon={LogoutIcon}
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
    console.log(route.params, "route")
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
                        <MainLayout {...props} appName={route.params.appName} />
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