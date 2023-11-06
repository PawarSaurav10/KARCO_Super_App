/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './MainAppScreens/HomeScreen';
import MainNavigation from './miniapps/TrACE_KPI/navigations/MainNavigation';
import OnlineNavigation from './miniapps/TrACE_Online/navigations/OnlineNavigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from './node_modules/redux';
import thunk from './node_modules/redux-thunk';
import rootReducer from './store/rootReducer';
import OnBoardingScreen from './MainAppScreens/OnBoardingScreen';
import { getScreenVisited } from './Utils/getOnBoardingScreenVisited';
import { TourGuideProvider } from "rn-tourguide"
import VideoNavigation from './miniapps/TrACE_Video_View/navigation/VideoNavigation';

const Main = createStackNavigator();

const middleware = [thunk];
const composeEnhancer = window.__REDUX_DEVTOOLS_ENTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  // getcache(),
  composeEnhancer(applyMiddleware(...middleware))
);
store.subscribe(() => store.getState());

function App() {
  const [initialRoute, setInitialRoute] = useState()

  useEffect(() => {
    getScreenVisited().then((res) => {
      if (res === null) {
        setInitialRoute("OnBoardingScreen")
      } else {
        setInitialRoute("Home");
      }
    });
  }, [])

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <SafeAreaView
        style={{ flex: 1 }}
      >
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <TourGuideProvider {...{ borderRadius: 8, verticalOffset: 24, maskOffset: 24 }}>
          <NavigationContainer>
            {initialRoute &&
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
            }
          </NavigationContainer>
        </TourGuideProvider>
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
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

export default App;
