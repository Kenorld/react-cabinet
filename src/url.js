import inflection from 'inflection'
import urljoin from 'url-join'

const options = {
  'uiRootUrl': '/',
  'apiRootUrl': 'localhost:9090/'
}
export function getUIURL(entityName, action, id) {
  const baseName = inflection.pluralize(entityName)
  if (action === 'list') {
    return urljoin(options.uiRootUrl, `/${baseName}`)
  }else if (action === 'delete'){
    return urljoin(options.uiRootUrl, `/${baseName}/${id}/delete`)
  }else if (action === 'create'){
    return urljoin(options.uiRootUrl, `/${baseName}/create`)
  }
  if (id !== undefined) {
    return urljoin(options.uiRootUrl, `/${baseName}/${id}`)
  }
  return urljoin(options.uiRootUrl, `/${baseName}`)
}
export function getAPIUrl(entityName, action, id) {
  return urljoin(options.apiRootUrl, getUIURL(entityName, action, id))
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