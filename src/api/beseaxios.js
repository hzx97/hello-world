import axios from 'axios'
var myaxios = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1/'
})
myaxios.interceptors.request.use(function (config) {
  var token = localStorage.getItem('itcastpro_token')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
export default myaxios
