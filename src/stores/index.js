import notificationStore from './notification'

const allStores = { notificationStore }
export const getStore = function (name) {
  return allStores[name + 'Store']
}
export const addStores = function(stores){
  Object.assign(allStores, stores)
}

export default stores