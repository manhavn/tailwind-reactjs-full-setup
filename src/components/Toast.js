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
