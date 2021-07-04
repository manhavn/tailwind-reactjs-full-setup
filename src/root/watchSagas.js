// src/root/watchSagas.js
import {takeEvery, call, put} from "redux-saga/effects";
import {callApiService} from "./callApiService";
import {change_data_list} from "./commonSlice";

// const delay = (ms) => new Promise(res => setTimeout(res, ms))

// Our worker Saga: will perform the async increment task
export function* saga_get_data_list({page, limit}) {
  try {
    const response = yield call(callApiService, {
      method: "GET",
      query: {
        page: page || 0,
        limit: limit || 10
      },
      url: "http://localhost:3000/get-data.json"
    });

    const data = response.data;

    // yield delay(1000)

    //put reducers
    yield put(change_data_list(data))

    // dispatch a success action to the store with the new dog
    // yield put({type: "API_CALL_SUCCESS", data});

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({type: "API_CALL_FAILURE", error});
  }
}

export default function* watchSagas() {
  yield takeEvery('SAGA_GET_DATA_LIST', saga_get_data_list)
}
