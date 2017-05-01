import { combineReducers } from 'redux'
import accounts from './accounts'
import data from './data'

const rootReducer = combineReducers({
  accounts,
  data
})

export default rootReducer
