import { defineStore } from "pinia"

export const useUsersStore = defineStore('users', {
    state: () => {
      return {
        currentKey: '',
        userList: [{
          name: '翻翻',
          id: '12121'
        }]
      }
    }
})