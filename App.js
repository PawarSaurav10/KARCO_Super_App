/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './store/rootReducer';
import { getScreenVisited } from './Utils/getOnBoardingScreenVisited';
import { TourGuideProvider } from "rn-tourguide"
import { COLORS } from './Constants/theme';
import MainAppNavigation from './navigation/MainAppNavigation';
// import { requestMultiple, PERMISSIONS } from 'react-native-permissions';

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
  const OsVer = Platform.constants['Release'];

  useEffect(() => {
    if (Platform.OS === "ios") {
      requestMultiple([
        PERMISSIONS.IOS.READ_EXTERNAL_STORAGE,
        PERMISSIONS.IOS.WRITE_EXTERNAL_STORAGE,
      ]).then((statuses) => {
        // console.log('Camera', statuses[PERMISSIONS.IOS.READ_EXTERNAL_STORAGE]);
        // console.log('FaceID', statuses[PERMISSIONS.IOS.WRITE_EXTERNAL_STORAGE]);
      });
    } else {
      if (OsVer > 12) {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO)
          .then((result) => {
            // console.log(result);
          })
      } else {
        PermissionsAndroid.requestMultiple(
          [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
        ).then((result) => {
          // console.log(result);
        })
      }
    }

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

  const style = {
    backgroundColor: COLORS.primary,
    textColor: COLORS.primary,
    color: COLORS.primary
  }

  return (
    <Provider store={store}>
      <SafeAreaView
        style={{ flex: 1 }}
      >
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <TourGuideProvider {...{ borderRadius: 10, verticalOffset: 28, color: COLORS.primary, wrapperStyle: style, preventOutsideInteraction: true }}>
          <NavigationContainer>
            {initialRoute &&
              <MainAppNavigation initialRoute={initialRoute} />
            }
          </NavigationContainer>
        </TourGuideProvider>
      </SafeAreaView>
    </Provider>
  );
};

export default App;
