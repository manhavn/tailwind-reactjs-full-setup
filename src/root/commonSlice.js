// src/root/commonSlice.js
import {createSlice} from '@reduxjs/toolkit';

export const commonSlice = createSlice({
  name: 'common',
  initialState: {},
  reducers: {
    change_data_list: (state, action) => {
      state.data_list = action.payload;
      state.success = true;
    },
    change_choose_data: (state, action) => {
      state.choose_data = action.payload;
    },
    delete_success: (state) => {
      delete state.success;
    },
    set_pathname: (state, action) => {
      state.pathname = action.payload;
    },
    set_toast_status: (state, action) => {
      state.toast_status = action.payload;
    },
    delete_toast_status: (state) => {
      delete state.toast_status;
    },
    set_toast_message: (state, action) => {
      state.toast_message = action.payload;
    },
    delete_toast_message: (state) => {
      delete state.toast_message;
    },
    set_toast_time_out: (state, action) => {
      state.toast_time_out = action.payload;
    },
    delete_toast_time_out: (state) => {
      delete state.toast_time_out;
    },
  },
});

export const {
  change_data_list,
  delete_success,
  set_pathname,
  change_choose_data,
  set_toast_status,
  delete_toast_status,
  set_toast_message,
  delete_toast_message,
  set_toast_time_out,
  delete_toast_time_out,
} = commonSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const data_list = state => state.common.data_list;
export const choose_data = state => state.common.choose_data;
export const success = state => state.common.success;
export const choose_data_pathname = state => state.common.pathname;
export const choose_toast_message = state => state.common.toast_message;
export const choose_toast_status = state => state.common.toast_status;
export const choose_toast_time_out = state => state.common.toast_time_out || 4000;
