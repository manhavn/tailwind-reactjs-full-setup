// src/root/store.js
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import {reduxBatch} from '@manaflair/redux-batch';
import watchSagas from "./watchSagas";
import {commonSlice} from "./commonSlice";

const sagaMiddleware = createSagaMiddleware()
let devTools = false

const middleware = [...getDefaultMiddleware(), sagaMiddleware]

if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger)
  devTools = true
}

const preloadedState = {}

export default configureStore({
  reducer: {
    common: commonSlice.reducer,
  },
  middleware,
  devTools,
  preloadedState,
  enhancers: [reduxBatch]
})

sagaMiddleware.run(watchSagas)
