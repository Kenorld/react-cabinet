import get from 'lodash.get';

export function getValues(record, source){
  const fields = source.split(','), values = []
  fields.forEach((field)=>{
    field = field.trim()
    values.push(get(record, field))
  })
  return values
}

export function collectProps(originalProps, definedProps){
  const props = {}
  for(let key in definedProps){
    if (originalProps[key] !== undefined){
      props[key] = originalProps[key]
    }
  }
  return props
}