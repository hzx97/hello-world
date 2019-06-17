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
export const getAllRoleList = () => {
  return axios.get('roles')
    .then((result) => {
      return result.data
    })
}
export const grantRole = (id, rid) => {
  return axios.put(`users/${id}/role`, { rid: rid })
    .then((result) => {
      return result.data
    })
}
export const getrolelist = (id, rid) => {
  return axios.put(`users/${id}/role`, { rid: rid })
    .then((result) => {
      return result.data
    })
}
export const removeRightByUserId = (roleid, rightid) => {
  return axios.delete(`roles/${roleid}/rights/${rightid}`)
}
export const addRoleSubmit = (obj) => {
  return axios({
    method: 'post',
    url: 'roles',
    data: obj
  })
}
export const getroleright = (type) => {
  return axios.get(`rights/${type}`)
}
export const grantRoleSubmit = (roleid, rids) => {
  console.log(roleid, rids)
  return axios({
    url: `roles/${roleid}/rights`,
    method: 'post',
    data: { rids: rids }
  })
}
