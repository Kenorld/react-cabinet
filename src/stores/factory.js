import { observable, action, computed, runInAction } from "mobx"
import inflection from 'inflection';
import client from '../client'
import {getAPIURL} from '../url'

function create(entityName) {
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
        record = Object.assign(exist, record)
      } else {
        this.records.push(record)
      }
      return record
    }
    @action list = async (limit, skip, sort, filter, search) => {
      console.log("====================api url:", getAPIURL(entityName, 'list'))
      return await client.get(getAPIURL(entityName, 'list'), { limit, skip, sort, filter, search }).then(action(`list ${baseName}`, (data) => {
        data.records && data.records.forEach((record) => {
          this.merge(record)
        })
        return data
      }))
    }
    @action create = async (data) => {
      return await client.patch(getAPIURL(entityName, 'create'), data).then(action(`create ${entityName}`, (data) => {
        return this.merge(data)
      }))
    }
    @action update = async (id, data) => {
      return await client.patch(getAPIURL(entityName, 'update', id), data).then(action(`update ${entityName} data`, () => {
        return this.merge({ id: id, ...data })
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
    find(id) {
      return this.records.find((record) => {
        return record.id === id
      })
    }
  }
  return classDefine
}


const exported = {
  create: create
}
export default exported 