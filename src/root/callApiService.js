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
