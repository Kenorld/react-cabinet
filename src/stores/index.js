import notification from './notification'

const allStores = { notification }
export const getStore = function (name) {
  let store = allStores
  name.split('/').forEach((part)=>{
    store = store[part]
    if (store == null){
      throw new Error(`Not found store, name: ${name}  part: ${part}`)
    }
  })
  return store
}
export function addStores(stores){
  Object.assign(allStores, stores)
}

export factory from './factory'

export default allStores