import { observable, action, computed, runInAction } from "mobx"
import client from '../client'

class NotificationStore {
  @observable type = 'info'
  @observable message = ''

  hideNotification(){
    this.message = ''
  }
  notify(message, type = 'info'){
    this.type = type
    this.message = message
  }
}

export default new NotificationStore()
