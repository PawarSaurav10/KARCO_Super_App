import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../TrACE_Video_View/screens/HomeScreen';
import VideoDetailScreen from '../screens/VideoDetailScreen';
import DownloadsScreen from '../screens/DownloadsScreen';
import DrawerNavigation from '../../../navigation/DrawerNavigation';
const VideoNav = createStackNavigator()

const VideoNavigation = () => {
    return (
        <VideoNav.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <VideoNav.Screen name="Video_Home" component={DrawerNavigation} initialParams={{ appName: "KARCO Videos" }} />
            {/* <VideoNav.Screen name="Video_Home" component={HomeScreen} /> */}
            <VideoNav.Screen name="Video Detail" component={VideoDetailScreen} />
            <VideoNav.Screen name="Downloads" component={DownloadsScreen} />
        </VideoNav.Navigator>
    )
}

export default VideoNavigation