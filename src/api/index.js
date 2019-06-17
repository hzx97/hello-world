import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么?获取token,传递
  // 1.获取token
  var token = localStorage.getItem('itcastpro_token')

  if (token) {
    // 2.在发送请求的时候传递token
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
export const login = (obj, callback) => {
  // axios.post是一个promise对象
  //  .then返回的还是一个promise对象
  return axios.post('login', obj)
    .then((result) => {
      return result.data
    })
}
export const getUserList = (pa) => {
  return axios.get('users', { params: pa })
    .then((result) => {
      return result.data
    })
}
export const updateUserStatuById = (id, type) => {
  return axios.put(`users/${id}/state/${type}`)
    .then((result) => {
      return result.data
    })
}
export const editUsers = (obj) => {
  return axios.put(`users/${obj.id}`, obj)
    .then((result) => {
      return result.data
    })
}
export const delUserById = (id) => {
  return axios.delete(`users/${id}`)
    .then((result) => {
      return result.data
    })
}
export const addUSer = (obj) => {
  return axios.post(`users`, obj)
    .then((result) => {
      return result.data
    })
}
