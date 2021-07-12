# Getting Started with Create React App

### Demo: https://funcfire.web.app


```shell
 npx create-react-app tailwind-reactjs-full-setup
 cd tailwind-reactjs-full-setup
 npm i -g yarn && yarn start
```

# Install Tailwind

```shell
 npm install -D tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
 npm install @craco/craco pretty-checkbox
 touch craco.config.js
 npx tailwindcss-cli@latest init
```

- craco.config.js

```js
// craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}
```

- tailwind.config.js

```js
// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```

- package.json

```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
  }
}
```

- src/index.css

```css
/* src/index.css */
@import '~pretty-checkbox/dist/pretty-checkbox.min.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

# Config Redux Sagas

```shell
 mkdir -p src/root
 touch src/root/store.js
 touch src/root/commonSlice.js
 touch src/root/watchSagas.js
 touch src/root/callApiService.js
```

- src/root/store.js

```js
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
```

- src/root/commonSlice.js

```js
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
```

- src/root/watchSagas.js

```js
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
```

- src/root/callApiService.js

```js
// src/root/callApiService.js
import axios from 'axios';

export function* callApiService({url, method, query, contentType}) {
  if (!url) {
    return
  }
  let keys = []
  if (!query) {
    query = []
  } else {
    keys = Object.keys(query)
  }
  if (method) {
    method = method.toLowerCase()
  }
  let params = {}

  function getFormQuery() {
    keys.forEach(key => {
      let value = query[key]
      if (typeof value === 'string') {
        params[key] = value
      } else {
        params[key] = JSON.stringify(value);
      }
    })
  }

  function axiosGet() {
    return axios
    .get(url, {params})
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error
    });
  }

  function axiosDelete() {
    return axios
    .delete(url, {params})
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error
    });
  }

  function axiosPost(data, headers) {
    return axios({
      method,
      url,
      data,
      config: {headers}
    })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error
    });
  }

  let headers = {'Content-Type': 'multipart/form-data'}
  let dataForm = new FormData();

  function getFormPostPut() {
    if (contentType !== "json") {
      keys.forEach(key => {
        let value = query[key]
        if (typeof value === 'string') {
          dataForm.append(key, value);
        } else {
          let data1 = JSON.stringify(value)
          dataForm.append(key, data1);
        }
      })
    } else {
      headers['Content-Type'] = 'application/json'
      dataForm = query
    }
  }

  switch (method) {
    case 'post':
      getFormPostPut();
      return yield axiosPost(dataForm, headers);
    case 'put':
      getFormPostPut();
      return yield axiosPost(dataForm, headers);
    case 'delete':
      getFormQuery();
      return yield axiosDelete();
    case 'get':
      getFormQuery();
      return yield axiosGet();
    default:
      getFormQuery();
      return yield axiosGet();
  }
}
```

# Components And Screens

- src/index.js

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import store from "./root/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

- src/App.js

```js
// src/App.js
import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Home from "./screens/Home";
import LoginForm from "./screens/LoginForm";

export default function App() {
  return <Router>
    <Route>
      <Header/>
      <Toast/>
    </Route>

    <div className={"overflow-auto mt-20 grid justify-center"}>
      <Switch>
        <Route path="/login">
          <LoginForm/>
        </Route>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </div>

    <Route>
      <Footer/>
    </Route>
  </Router>
}
```

```shell
 mkdir -p src/components
 mkdir -p src/screens
 touch src/components/Toast.css
 touch src/components/Toast.js
 touch src/components/Header.js
 touch src/components/Footer.js
 touch src/screens/Home.js
 touch src/screens/LoginForm.js
```

- src/components/Toast.css

```css
/*src/components/Toast.css*/
.toast000 {
    position: fixed;
    right: 0;
    margin-top: 20px;
    display: grid;
    justify-items: end;
}

.toast111 {
    margin-right: -1500px;
    opacity: 0;
}

.toast111.open {
    margin-right: 0;
    opacity: 0.98;

    -webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -ms-transition: all 1s ease;
    -o-transition: all 1s ease;
    transition-duration: 0.3s;

    -webkit-animation-name: toast111; /* Safari 4.0 - 8.0 */
    -webkit-animation-duration: 0.2s; /* Safari 4.0 - 8.0 */
    animation-name: toast111;
    animation-duration: 0.2s;
}

.toast111.close {
    margin-right: -1500px;
    opacity: 0;

    -webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -ms-transition: all 1s ease;
    -o-transition: all 1s ease;
    transition-duration: 1s;

    -webkit-animation-name: toast111; /* Safari 4.0 - 8.0 */
    -webkit-animation-duration: 0.5s; /* Safari 4.0 - 8.0 */
    animation-name: toast111;
    animation-duration: 0.5s;
}
```

- src/components/Toast.js

```js
// src/components/Toast.js
import "./Toast.css";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  choose_toast_message,
  choose_toast_status,
  choose_toast_time_out, delete_toast_message,
  delete_toast_status, delete_toast_time_out
} from "../root/commonSlice";

function GetToast({status, message, timeOut}) {
  const [incoming, setIncoming] = useState(false);
  const [status1] = useState(status);
  const [message1] = useState(message);
  const [timeOut1] = useState(timeOut || 4000);

  useEffect(() => {
    setTimeout(() => {
      setIncoming(true);
    }, 50)
    setTimeout(() => {
      setIncoming(false);
    }, timeOut1)
  }, [timeOut1])

  return <div className={`toast111 ${incoming ? "open" : "close"}`}>
    {(status1 === 1 &&
      <div className="flex items-center bg-green-500 border-l-4 border-green-700 py-2 px-3 shadow-md mb-2">
        <div className="text-green-500 rounded-full bg-white mr-3">
          <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" className="bi bi-check" fill="currentColor"
               xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd"
                  d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
          </svg>
        </div>
        <div className="text-white max-w-xs ">
          {message1}
        </div>
      </div>)
    || (status1 === 0 &&
      <div className="flex items-center bg-red-500 border-l-4 border-red-700 py-2 px-3 shadow-md mb-2">
        <div className="text-red-500 rounded-full bg-white mr-3">
          <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor"
               xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd"
                  d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
            <path fillRule="evenodd"
                  d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
          </svg>
        </div>
        <div className="text-white max-w-xs ">
          {message1}
        </div>
      </div>)
    || (status1 === 2 &&
      <div className="flex items-center bg-yellow-400 border-l-4 border-yellow-700 py-2 px-3 shadow-md mb-2">
        <div className="text-yellow-500 rounded-full bg-white mr-3">
          <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" className="bi bi-exclamation" fill="currentColor"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
        </div>
        <div className="text-white max-w-xs ">
          {message1}
        </div>
      </div>)
    }
  </div>;
}

export default function Toast() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(-1);
  const [timeOut, setTimeOut] = useState(4000);
  const [listToast, setListToast] = useState([]);
  const toast_message = useSelector(choose_toast_message);
  const toast_status = useSelector(choose_toast_status);
  const toast_time_out = useSelector(choose_toast_time_out);

  useEffect(() => {
    if (toast_message) {
      setMessage(toast_message);
      setStatus(toast_status);
      if (toast_time_out) {
        setTimeOut(toast_time_out);
        dispatch(delete_toast_time_out());
      }
      dispatch(delete_toast_status());
      dispatch(delete_toast_message());
      let timeNow = new Date().getTime();
      let newListToast = listToast;
      newListToast.push(timeNow);
      setListToast(newListToast);
      setTimeout(() => {
        listToast.pop();
      }, timeOut + 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast_message])

  return <div className={"toast000"}>
    {listToast.length > 0 &&
    listToast.map((value, index) => <div key={index}>
      <GetToast status={status} message={message} timeOut={timeOut}/>
    </div>)}
  </div>
}
```

- src/components/Header.js

```js
// src/components/Header.js
import {useSelector} from "react-redux";
import {choose_data_pathname} from "../root/commonSlice";
import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

export default function Header() {
  const history = useHistory();
  const [pathname, setPathname] = useState('');
  const [mobileMenu, setMobileMenu] = useState();
  const data_pathname = useSelector(choose_data_pathname);

  useEffect(() => {
    if (data_pathname) setPathname(data_pathname);
  }, [data_pathname])

  return <>
    <nav className="bg-gray-800 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    aria-controls="mobile-menu" aria-expanded="false"
                    onClick={() => {
                      setMobileMenu(true);
                    }}
            >
              <span className="sr-only">Open main menu</span>

              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>

              <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center"
                 onClick={() => {
                   setMobileMenu(false);
                   let wpn = window.location["pathname"]
                   if ((wpn !== "/" && wpn !== "")) {
                     history.push('/');
                   }
                 }}
            >
              <img className="block lg:hidden h-8 w-auto"
                   src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow"/>
              <img className="hidden lg:block h-8 w-auto"
                   src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                   alt="Workflow"/>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <div
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${pathname === "/" || pathname === "" || !pathname ? "bg-gray-900 cursor-default" : "hover:bg-gray-900 cursor-pointer"}`}
                  onClick={() => {
                    let wpn = window.location["pathname"]
                    if ((wpn !== "/" && wpn !== "")) {
                      history.push('/');
                    }
                  }}
                >Statistic
                </div>

                <div
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${pathname === "/login" || pathname === "" || !pathname ? "bg-gray-900 cursor-default" : "hover:bg-gray-900 cursor-pointer"}`}
                  onClick={() => {
                    let wpn = window.location["pathname"]
                    if ((wpn !== "/login")) {
                      history.push('/login');
                    }
                  }}
                >Login Form
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">View notifications</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </button>

            <div className="ml-3 relative">
              <div>
                <button type="button"
                        className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full"
                       src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                       alt=""/>
                </button>
              </div>


              <div
                className="sm:hidden hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                <div className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1"
                     id="user-menu-item-0">Your Profile
                </div>
                <div className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1"
                     id="user-menu-item-1">Settings
                </div>
                <div className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1"
                     id="user-menu-item-2">Sign out
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`sm:hidden ${mobileMenu ? "" : "hidden"}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <div
            className={`${pathname === "/" || pathname === "" || !pathname ? "bg-gray-900 cursor-default" : "hover:bg-gray-900 cursor-pointer"} text-white block px-3 py-2 rounded-md text-base font-medium`}
            aria-current="page"
            onClick={() => {
              setMobileMenu(false);
              let wpn = window.location["pathname"]
              if ((wpn !== "/" && wpn !== "")) {
                history.push('/');
              }
            }}
          >Statistic
          </div>
          <div
            className={`${pathname === "/login" || pathname === "" || !pathname ? "bg-gray-900 cursor-default" : "hover:bg-gray-900 cursor-pointer"} text-white block px-3 py-2 rounded-md text-base font-medium`}
            aria-current="page"
            onClick={() => {
              setMobileMenu(false);
              let wpn = window.location["pathname"]
              if ((wpn !== "/login")) {
                history.push('/login');
              }
            }}
          >Login Form
          </div>
        </div>
      </div>
    </nav>
  </>
}
```

- src/components/Footer.js

```js
// src/components/Footer.js
export default function Footer() {
  return <></>
}
```

- src/screens/Home.js

```js
// src/screens/Home.js
import {useDispatch} from "react-redux";
import {
  set_pathname,
  set_toast_message, set_toast_status, set_toast_time_out,
} from "../root/commonSlice";
import {useHistory} from "react-router-dom";
import {useEffect} from "react";

export default function Home() {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(set_pathname("/"));
  }, [dispatch])

  return <div>
    <button
      className={"inline-block text-center m-2 bg-blue-500 hover:bg-blue-700 focus:bg-green-700 text-white font-bold py-2 px-4 rounded"}
      onClick={() => {
        dispatch(set_toast_status(2));
        dispatch(set_toast_message(`Please waiting ...`));
        dispatch(set_toast_time_out(3000));
        setTimeout(() => {
          dispatch(set_toast_status(1));
          dispatch(set_toast_message(`Save successfully!`));
        }, 1000)
      }}>
      Show Toast Successfully
    </button>

    <button
      className={"inline-block text-center m-2 bg-blue-500 hover:bg-blue-700 focus:bg-green-700 text-white font-bold py-2 px-4 rounded"}
      onClick={() => {
        dispatch(set_toast_status(2));
        dispatch(set_toast_message(`Please waiting ...`));
        dispatch(set_toast_time_out(3000));
        setTimeout(() => {
          dispatch(set_toast_status(0));
          dispatch(set_toast_message(`Saving failed, please try again`));
        }, 1000)
      }}>
      Show Toast Fail
    </button>

    <button
      className={"inline-block text-center m-2 bg-blue-500 hover:bg-blue-700 focus:bg-green-700 text-white font-bold py-2 px-4 rounded"}
      onClick={() => {
        history.push("login")
      }}>
      Login Form
    </button>
  </div>
}
```

- src/screens/LoginForm.js

```js
// src/screens/LoginForm.js
import {useDispatch} from "react-redux";
import {set_pathname} from "../root/commonSlice";
import {useEffect} from "react";

export default function LoginForm() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(set_pathname("/login"));
  }, [dispatch])

  return <div className="w-full max-w-xs">
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username" type="text" placeholder="Username"/>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password" type="password" placeholder="******************"/>
        <p className="text-red-500 text-xs italic">Please choose a password.</p>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button">
          Sign In
        </button>
        <div className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
          Forgot Password?
        </div>
      </div>
    </form>
    <p className="text-center text-gray-500 text-xs">
      &copy;2021 Dev Corp. All rights reserved.
    </p>
  </div>
}
```

```shell
 yarn add @manaflair/redux-batch @reduxjs/toolkit axios react-redux react-router-dom redux-logger redux-saga pretty-checkbox
 yarn start
```

- .gitignore

```gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

*.idea/workspace.xml
*.idea/dataSources
*.idea/dataSources/
*.idea/shelf
*.idea/shelf/

*package-lock.json
*yarn.lock
*.firebaserc
*.firebase/
```

# Firebase Hosting

```shell
 npm i -g firebase-tools
 firebase login
 firebase init hosting
 # ? What do you want to use as your public directory? build
 # ? Configure as a single-page app (rewrite all urls to /index.html)? Yes
 # ? Set up automatic builds and deploys with GitHub? No
 # ? File public/index.html already exists. Overwrite? No
 yarn build
 firebase deploy --only hosting
```

- firebase.json

```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```
