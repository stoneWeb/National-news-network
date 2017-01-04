import { api } from './request'

export default {
  createToken({username, password}){
    return api.post('/Login/index', {username,password})
  }
}
