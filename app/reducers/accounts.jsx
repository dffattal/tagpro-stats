import axios from 'axios'

const FETCH_SINGLE_ACCOUNT = 'FETCH_SINGLE_ACCOUNT'

const defaultState = {
  selectedAccount: {}
}


export default function(state = defaultState, action) {
  const newState = Object.assign({}, state)

  switch (action.type) {
  case FETCH_SINGLE_ACCOUNT:
    newState.selectedAccount = action.selectedAccount
    break
  default:
    return state
  }
  return newState
}

const fetchSingleAccount = selectedAccount => ({
  type: FETCH_SINGLE_ACCOUNT, selectedAccount
})

export const getSingleAccount = accountId => dispatch => {
  axios.get(`/api/accounts/${accountId}`)
    .then(response => response.data)
    .then(selectedAccount => {
      dispatch(fetchSingleAccount(selectedAccount))
    })
    .catch(console.error)
}

