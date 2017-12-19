import { combineReducers } from 'redux'
import config from './config'

console.info('Import reducer...');

const reducers = combineReducers({
    config
})

export default reducers