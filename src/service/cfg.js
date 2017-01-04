import Storage from './storage'

let userConfig = Storage.get();
const getCfg = () => {
  return userConfig
}
const setCfg = (...args) => {
  Storage.set(...args);
  userConfig = Storage.get();
  return userConfig
}
const rmCfg = (...args) => {
  Storage.remove(...args);
  userConfig = Storage.get();
  return userConfig
}
export { getCfg, setCfg, rmCfg }
