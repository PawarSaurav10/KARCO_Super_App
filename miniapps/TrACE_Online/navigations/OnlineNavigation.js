import React, { useState, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../../MainAppScreens/LoginScreen';
import VideoDetailScreen from '../screens/VideoDetailScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import ViewAllScreen from '../screens/ViewAllScreen';
const Online = createStackNavigator();
import { getOnlineScreenVisited } from "../../../Utils/getScreenVisisted"
import DrawerNavigation from '../../../navigation/DrawerNavigation';
import CertificatesScreen from '../screens/CertificatesScreen';

const OnlineNavigation = ({ route }) => {
    const [initialRoute, setInitialRoute] = useState()
    useEffect(() => {
        getOnlineScreenVisited().then((res) => {
            if (res === null) {
                setInitialRoute("Login")
            } else {
                setInitialRoute("Online_Home")
            }
        });
    }, [])

    return (
        <>
            {initialRoute && (
                <Online.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                    initialRouteName={initialRoute}
                >
                    <Online.Screen
                        name="Online_Home"
                        component={DrawerNavigation}
                        initialParams={{ appName: "TrACE Online" }}
                    />
                    <Online.Screen name={"Login"} component={LoginScreen} initialParams={{ appName: route.params }} />
                    <Online.Screen name={"Video Detail"} component={VideoDetailScreen} />
                    <Online.Screen name={"AssessmentNew"} component={AssessmentScreen} />
                    <Online.Screen name={"Feedback Form"} component={FeedbackScreen} />
                    <Online.Screen name={"View All"} component={ViewAllScreen} />
                    <Online.Screen name={"Certificates"} component={CertificatesScreen} />
                </Online.Navigator>
            )}
        </>
    )
}

export default OnlineNavigation
