import React from 'react'
import OnBoardingScreen from '../MainAppScreens/OnBoardingScreen';
import HomeScreen from '../MainAppScreens/HomeScreen';
import MainNavigation from '../miniapps/TrACE_KPI/navigations/MainNavigation';
import OnlineNavigation from '../miniapps/TrACE_Online/navigations/OnlineNavigation';
import VideoNavigation from '../miniapps/TrACE_Video_View/navigation/VideoNavigation';
import { createStackNavigator } from '@react-navigation/stack';
const Main = createStackNavigator()

const MainAppNavigation = ({ initialRoute }) => {
    return (
        <Main.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName={initialRoute}>
            <Main.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
            <Main.Screen name="Home" component={HomeScreen} />
            <Main.Screen name="KPI_Navigation" component={MainNavigation} />
            <Main.Screen name="Online_Navigation" component={OnlineNavigation} />
            <Main.Screen name="VideoNav_Navigation" component={VideoNavigation} />
        </Main.Navigator>
    )
}

export default MainAppNavigation
