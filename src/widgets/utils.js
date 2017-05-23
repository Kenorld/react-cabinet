import get from 'lodash.get';

export function getValues(record, source){
  const fields = source.split(','), values = []
  fields.forEach((field)=>{
    field = field.trim()
    values.push(get(record, source))
  })
  return values
}