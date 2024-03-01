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
import rootReducer from './store/rootReducer';
import { getScreenVisited } from './Utils/getOnBoardingScreenVisited';
import { TourGuideProvider } from "rn-tourguide"
import { COLORS } from './Constants/theme';
import MainAppNavigation from './navigation/MainAppNavigation';
import { thunk } from './node_modules/redux-thunk';
import { compose, createStore, applyMiddleware } from './node_modules/redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import AsyncStorage from './node_modules/@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // Specify the reducers you want to persist
  whitelist: ['loginReducer'], // In this example, we persist the 'user' reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const middleware = [thunk]
const composeEnhancer = compose

const store = createStore(
  persistedReducer,
  // getcache(),
  composeEnhancer(applyMiddleware(...[thunk]))
)

store.subscribe(() => store.getState())

const persistor = persistStore(store)

const App = () => {
  const [initialRoute, setInitialRoute] = useState()
  const OsVer = Platform.constants['Release'];

  useEffect(() => {
    if (Platform.OS === "ios") {
      requestMultiple([
        PERMISSIONS.IOS.READ_EXTERNAL_STORAGE,
        PERMISSIONS.IOS.WRITE_EXTERNAL_STORAGE,
      ]).then((statuses) => { });
    } else {
      if (OsVer > 12) {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO)
          .then((result) => { })
      } else {
        PermissionsAndroid.requestMultiple(
          [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
        ).then((result) => { })
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
      <PersistGate persistor={persistor}>
        <SafeAreaView style={{ flex: 1 }}>
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
      </PersistGate>
    </Provider>
  );
};

export default App;
