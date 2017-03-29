import notificationStore from './notification'

const allStores = { notificationStore }
export const getStore = function (name) {
  return allStores[name + 'Store']
}
export function addStores(stores){
  Object.assign(allStores, stores)
}

export factory from './factory'

export default allStores