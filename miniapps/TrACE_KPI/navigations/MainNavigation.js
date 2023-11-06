import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "../screens/HomeScreen"
import LoginScreen from '../../../MainAppScreens/LoginScreen';
import DrawerNavigation from '../../../navigation/DrawerNavigation';
const Sub = createStackNavigator();

const MainNavigation = ({ route }) => {
    return (
        <Sub.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName={"Login"}>
            <Sub.Screen
                name="Login"
                component={LoginScreen}
                initialParams={{ appName: route.params }}
            />
            <Sub.Screen
                name="KPI_Home"
                component={DrawerNavigation}
                initialParams={{ appName: "TrACE KPI" }}
            />
            {/* <Sub.Screen name="KPI_Home" component={HomeScreen} /> */}
        </Sub.Navigator>
    )
}

export default MainNavigation