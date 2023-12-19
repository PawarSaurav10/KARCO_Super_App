import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet, Platform, Alert } from 'react-native'
import { useTogglePasswordVisibility } from '../CustomHooks/useTogglePasswordVisibility';
import { useIsFocused } from '@react-navigation/native';
import CustomInput from '../Components/CustomInput';
import CustomIconButton from '../Components/CustomIconButton';
import LoginIcon from "../Images/login.png"
import Loader from "../Images/welcome_trace.gif"
import Logo from "../Images/Trace_logo.png"
import { COLORS } from '../Constants/theme';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import { saveCompanyDataToStorage, setScreenVisited, saveUserDataToStorage, setOnlineScreenVisited } from '../Utils/getScreenVisisted';
import { getURL } from '../baseUrl';
import LoginScreenLoader from "../Components/LoginScreenLoader"
import NetInfo from "@react-native-community/netinfo";
// import NetworkUtils, { CheckConnectivity } from "../Utils/isInternetConnected"

const LoginScreen = ({ navigation, route }) => {
    const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility();
    const isFocused = useIsFocused()
    const [loginData, setLoginData] = useState({
        userId: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false)

    const CheckConnectivity = () => {
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.fetch().then(xx => {
                if (xx.isConnected) {
                    // Alert.alert("You are online!");
                } else {
                    Alert.alert('Oops !!', 'Your Device is not Connected to Internet, Please Check your Internet Connectivity', [
                        {
                            text: 'OK', onPress: () =>
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: "Home" }],
                                })
                        },
                    ]);
                }
            });
        }
    }

    useEffect(() => {
        if (isFocused) {
            CheckConnectivity()
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isFocused]);

    const onHandleLoginClick = () => {
        // if (isConnected) {
        CheckConnectivity()
        if (loginData.userId !== "" && loginData.password !== "") {
            setIsLoading(true)
            try {
                if (route.params.appName === "TrACE KPI") {
                    axios.get(`https://trace.karco.in/api/applogin/CompanyLogin?username=${loginData.userId.trimStart("").trimEnd("")}&password=${loginData.password.trimStart("").trimEnd("")}`)
                        .then((response) => {
                            if (response.data.CompanyId > 0) {
                                setIsLoading(false)
                                let companyId = response.data.CompanyId
                                let companyName = response.data.CompanyName
                                let companyLogoName = response.data.LogoName
                                let companyLogoPath = response.data.LogoPath
                                let NoOfShips = response.data.NoOfShips
                                saveCompanyDataToStorage(companyId, companyName, companyLogoName, companyLogoPath, NoOfShips)
                                setScreenVisited("Yes")
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: "KPI_Home" }],
                                });
                            } else {
                                setIsLoading(false)
                                alert("Couldn't Sign In, Your User Name and Password Does'nt Match.")
                            }
                        })
                } else {
                    axios.get(`${getURL.base_URL}/applogin/userlogin?username=${loginData.userId.trimStart("").trimEnd("")}&password=${loginData.password.trimStart("").trimEnd("")}`)
                        .then((response) => {
                            if (response.data.CrewListId > 0) {
                                setIsLoading(true)
                                saveUserDataToStorage(response.data, loginData.password.trimStart("").trimEnd(""))
                                // let data = [];
                                // data.push({
                                //     code: "SIGNIN",
                                //     isVisited: true,
                                //     screenName: "LoginScreen",
                                // });
                                setOnlineScreenVisited("Yes");
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: "Online_Home" }],
                                });
                                setIsLoading(false)
                            } else {
                                setIsLoading(false)
                                alert("Couldn't Sign In, Your Username and Password Does'nt Match.")
                            }
                        })
                }
            } catch (error) {
                return console.log(error)
            }
        } else {
            setIsLoading(false)
            Alert.alert('Warning', `Plaese Enter ${loginData.userId === "" ? "Username" : loginData.password === "" ? "Password" : "Username and Password"}`, [
                { text: 'OK', onPress: () => console.log("OK Pressed") },
            ]);
        }
        // } else {
        //     setIsLoading(false)
        //     Alert.alert('Oops !!', 'Your Device is not Connected to Internet, Please Check your Internet Connectivity', [
        //         { text: 'OK', onPress: () => CloseApp() },
        //     ]);
        // }
    }
    return (
        <View style={{ flex: 1 }}>
            {isLoading && <LoginScreenLoader />}
            {!isLoading &&
                <ScrollView>
                    <View style={{ flexDirection: 'col', justifyContent: "center" }}>
                        <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                            <View style={{ width: 200, marginBottom: 8 }}>
                                <FastImage
                                    style={{ width: 200, height: 100 }}
                                    source={Loader}
                                />
                            </View>
                            <Image style={{ width: 160, height: 90, objectFit: "contain" }} source={Logo} />
                            <View style={{ padding: 10 }}>
                                <View style={{ marginVertical: 4 }}>
                                    <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", color: COLORS.darkBlue, textTransform: "uppercase" }}>Let's Sign You In</Text>
                                </View>
                                <View style={{ marginVertical: 4 }}>
                                    <Text style={{ fontSize: 16, textAlign: "center", color: COLORS.darkBlue }}>Welcome, Please enter your Log In Details below and Click Login </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            padding: 20, flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={{ marginVertical: 20, maxWidth: 380, alignItems: "center" }}>
                                <CustomInput
                                    label="User Name"
                                    textColor={COLORS.black}
                                    value={loginData.userId}
                                    style={styles.input}
                                    onChangeText={(value) => {
                                        setLoginData({ ...loginData, userId: value })
                                    }}
                                />
                            </View>
                            <View style={{ marginVertical: 20, maxWidth: 380 }}>
                                <CustomInput
                                    label="Password"
                                    textColor={COLORS.black}
                                    inputType="password"
                                    secureTextEntry={passwordVisibility}
                                    onIconClick={handlePasswordVisibility}
                                    icon={rightIcon}
                                    value={loginData.password}
                                    style={styles.input}
                                    onChangeText={(value) => {
                                        setLoginData({ ...loginData, password: value })
                                    }}
                                />
                            </View>
                            <CustomIconButton
                                label="Login"
                                onPress={() => {
                                    CheckConnectivity()
                                    onHandleLoginClick()
                                }}
                                containerStyle={{
                                    backgroundColor: "#004C6B",
                                    width: "100%",
                                    padding: 16,
                                    alignItems: "center",
                                    marginVertical: 12,
                                    borderRadius: 5,
                                    maxWidth: 380,
                                }}
                                icon={LoginIcon}
                                iconStyle={{
                                    marginRight: 10
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>

            }
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        padding: 10,
        // backgroundColor: Colors.lighter,
        borderRadius: 8,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        paddingBottom: 10
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});


export default LoginScreen
