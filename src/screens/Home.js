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
      className="inline-block text-center m-2 bg-blue-500 hover:bg-blue-700 focus:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
      className="inline-block text-center m-2 bg-blue-500 hover:bg-blue-700 focus:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
      className="inline-block text-center m-2 bg-blue-500 hover:bg-blue-700 focus:bg-green-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => {
        history.push("login")
      }}>
      Login Form
    </button>
  </div>
}
