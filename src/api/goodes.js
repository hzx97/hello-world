import myaxios from './beseaxios'
export const Gettradelist = ({ ...params }) => {
  return myaxios({
    method: 'get',
    url: `goods`,
    params
  })
}
export const getAllCategoriesList = (type) => {
  return myaxios({
    method: 'get',
    url: `categories`,
    params: { type: [type] }
  })
}
export const addGoodInfo = (data) => {
  return myaxios({
    method: 'post',
    url: `goods`,
    data
  })
}
