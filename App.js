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
        <TourGuideProvider {...{ borderRadius: 8, verticalOffset: 24, maskOffset: 24, color: COLORS.primary,wrapperStyle: style }}>
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
