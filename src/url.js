import inflection from 'inflection'

const options = {
  uiRootURL: '/',
  apiRootURL: '//localhost:9090/',
  loginURL: '/auth/login',
  forbiddenURL: '/auth/forbidden',
}
export function getLoginURL(){
  return joinURLPaths(options.apiRootURL, options.loginURL)
}
export function getForbiddenURL(){
  return joinURLPaths(options.apiRootURL, options.forbiddenURL)
}
export function joinURLPaths(...args){
  return args.reduce((result, item)=>{
    const char0 = result[result.length - 1], char1 = item[0]
    if (char0 === '/' && char1 === '/'){
      return result + item.substring(1)
    }else if (char0 === '/' || char1 === '/'){
      return result + item
    }else{
      return result + '/' + item
    }
  })
}
export function getUIURL(entityName, action, id) {
  const baseName = inflection.pluralize(entityName)
  if (action === 'list') {
    return joinURLPaths(options.uiRootURL, `${baseName}`)
  }else if (action === 'delete'){
    return joinURLPaths(options.uiRootURL, `${baseName}/${id}/delete`)
  }else if (action === 'create'){
    return joinURLPaths(options.uiRootURL, `${baseName}/create`)
  }
  if (id !== undefined) {
    return joinURLPaths(options.uiRootURL, `${baseName}/${id}`)
  }
  return joinURLPaths(options.uiRootURL, `${baseName}`)
}
export function getAPIURL(entityName, action, id) {
  const baseName = inflection.pluralize(entityName)
  if (action === 'list' || action === 'create') {
    return joinURLPaths(options.apiRootURL, `${baseName}`)
  }else if (action === 'delete' || action === 'update'){
    return joinURLPaths(options.apiRootURL, `${baseName}/${id}`)
  }
  if (id !== undefined) {
    return joinURLPaths(options.apiRootURL, `${baseName}/${id}`)
  }
  return joinURLPaths(options.apiRootURL, `${baseName}`)
}

export function appendQueryToURL(url, query) {
  url = new URL(url)
  var searchParams = url.searchParams
  for (const i in query) {
    const value = query[i]
    if (typeof value === 'object') {
      searchParams.set(i, JSON.stringify(value))
    } else {
      if (value !== "" && value != null) {
        searchParams.set(i, value)
      }else{
        searchParams.delete(i)
      }
    }
  }
  return '/' + url.toString().replace(/^(?:\/\/|[^\/]+)*\//, "")
}

export function config(customOptions){
  Object.assign(options, customOptions)
}