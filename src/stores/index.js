import notificationStore from './notification'

const allStores = { notificationStore }
export const getStore = function (name) {
  let store = allStores
  name.split('/').forEach((part)=>{
    store = store[part]
  })
  return store
}
export function concatStores(stores){
  Object.assign(allStores, stores)
}

export factory from './factory'

export default allStores