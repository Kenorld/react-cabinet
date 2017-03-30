import inflection from 'inflection'

const options = {
  'uiRootUrl': '/',
  'apiRootUrl': '//localhost:9090/'
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
    return joinURLPaths(options.uiRootUrl, `${baseName}`)
  }else if (action === 'delete'){
    return joinURLPaths(options.uiRootUrl, `${baseName}/${id}/delete`)
  }else if (action === 'create'){
    return joinURLPaths(options.uiRootUrl, `${baseName}/create`)
  }
  if (id !== undefined) {
    return joinURLPaths(options.uiRootUrl, `${baseName}/${id}`)
  }
  return joinURLPaths(options.uiRootUrl, `${baseName}`)
}
export function getAPIURL(entityName, action, id) {
  const baseName = inflection.pluralize(entityName)
  if (action === 'list' || action === 'create') {
    return joinURLPaths(options.apiRootUrl, `${baseName}`)
  }else if (action === 'delete' || action === 'update'){
    return joinURLPaths(options.apiRootUrl, `${baseName}/${id}`)
  }
  if (id !== undefined) {
    return joinURLPaths(options.apiRootUrl, `${baseName}/${id}`)
  }
  return joinURLPaths(options.apiRootUrl, `${baseName}`)
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