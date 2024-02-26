import AsyncStorage from "../node_modules/@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import { applyMiddleware, compose, createStore } from "../node_modules/redux";
import { getcache } from "./statecache";
import { thunk } from "../node_modules/redux-thunk";
import rootReducer from "./rootReducer";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    // Specify the reducers you want to persist
    whitelist: ['loginReducer'], // In this example, we persist the 'user' reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk]
const composeEnhancer = compose

export const store = createStore(
    persistedReducer,
    getcache(),
    composeEnhancer(applyMiddleware(...middleware))
)



export const persistor = persistStore(store)