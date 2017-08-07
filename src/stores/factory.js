import { observable, action, computed, runInAction, extendObservable } from "mobx"
import inflection from 'inflection';
import client from '../client'
import { getAPIURL } from '../url'

function create(entityName, defaultFields) {
  const baseName = inflection.pluralize(entityName)
  const classDefine = class {
    @observable creatingRecord = {}
    @observable records = []

    find(id) {
      return this.records.find((item) => { return item.id === id })
    }

    @action merge(record) {
      const exist = this.find(record.id)
      if (exist) {
        return extendObservable(exist, fillDefault(record))
      } else {
        const len = this.records.push(fillDefault(record))
        return this.records[len - 1]
      }
    }
    @action list = async (limit = 20, skip = 0, sort = '', filter = {}, search = '') => {
      return await client.get(getAPIURL(entityName, 'list'), { limit, skip, sort, filter, search }).then(action(`list ${baseName}`, (data) => {
        const records = []
        data.records && data.records.forEach((record) => {
          records.push(this.merge(record))
        })
        return { records, rawData: data }
      }))
    }
    @action create = async (record) => {
      return await client.post(getAPIURL(entityName, 'create'), record).then(action(`create ${entityName}`, (data) => {
        return this.merge(Object.assign(record, data))
      }))
    }
    @action update = async (id, record) => {
      return await client.patch(getAPIURL(entityName, 'update', id), record).then(action(`update ${entityName} data`, (data) => {
        return this.merge({ id: id, ...record, ...data })
      }))
    }
    @action delete = async (id) => {
      return await client.delete(getAPIURL(entityName, 'delete', id)).then(action(`delete ${entityName} data`, (data) => {
        for (let i = this.records.length - 1; i >= 0; i--) {
          const record = this.records[i]
          if (record.id === id) {
            this.records.splice(i, 1)
          }
        }
        return data
      }))
    }
    @action read = async (id, onlyServer = false) => {
      if (id === "" || id == null) {
        return null
      }
      if (!onlyServer) {
        const record = this.find(id)
        if (record) {
          return record
        }
      }
      return await client.get(getAPIURL(entityName, 'read', id)).then(action(`read ${entityName} data`, (data) => {
        if (data.id) {
          return this.merge(data)
        } else {
          console.log("Error get data:", `/${baseName}/${id}`, data)
          return data
        }
      }))
    }
  }
  function fillDefault(record) {
    if (defaultFields) {
      if (typeof defaultFields === 'object') {
        extendRecord(record, defaultFields)
      } else {
        defaultFields(record)
      }
    }
    return record
  }
  return classDefine
}

function extendRecord(record, defaultFields) {
  for (let f in defaultFields) {
    if (record[f] == null) {
      record[f] = defaultFields[f]
    } else if (typeof record[f] === 'object' && typeof defaultFields[f] === 'object') {
      extendRecord(record[f], defaultFields[f])
    }
  }
  return record
}

const exported = {
  create: create
}
export default exported 