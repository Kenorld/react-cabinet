import get from 'lodash.get'
import set from 'lodash.set'
import { computed } from 'mobx'

export function getValues(record, source) {
  const fields = source.split(','), values = []
  fields.forEach((field) => {
    field = field.trim()
    values.push(get(record, field))
  })
  return values
}

export function fetchValue(element, defaultValue = "") {
  let values = getValues(element.record || element.props.record, element.props.source) || ['']
  let value = defaultValue
  if (element.props.convert) {
    if (element.props.convert.fetch) {
      value = element.props.convert.fetch.apply(element, values)
    } else {
      value = element.props.convert.apply(element, values)
    }
  }else{
    value = values.join(', ')
  }
  return value
}

export function writeValue(element, value) {
  if (element.props.convert && element.props.convert.write) {
    value = element.props.convert.write(value)
  }
  set(element.record || element.props.record, element.props.source, value)
}