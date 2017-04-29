import axios from 'axios'

const FETCH_SINGLE_ACCOUNT = 'FETCH_SINGLE_ACCOUNT'
const FETCH_SEARCH_RESULTS = 'FETCH_SEARCH_RESULTS'

const defaultState = {
  selectedAccount: {},
  searchResults: []
}


export default function(state = defaultState, action) {
  const newState = Object.assign({}, state)

  switch (action.type) {
  case FETCH_SINGLE_ACCOUNT:
    newState.selectedAccount = action.selectedAccount
    break
  case FETCH_SEARCH_RESULTS:
    newState.searchResults = action.searchResults
    break
  default:
    return state
  }
  return newState
}

const fetchSingleAccount = selectedAccount => ({
  type: FETCH_SINGLE_ACCOUNT, selectedAccount
})

const fetchSearchResults = searchResults => ({
  type: FETCH_SEARCH_RESULTS, searchResults
})

export const getSingleAccount = accountId => dispatch => {
  axios.get(`/api/accounts/${accountId}`)
    .then(response => response.data)
    .then(selectedAccount => {
      dispatch(fetchSingleAccount(selectedAccount))
    })
    .catch(console.error)
}

export const getSearchResults = name => dispatch => {
  axios.get(`/api/accounts/?name=%${name}%`)
    .then(response => response.data)
    .then(searchResults => {
      dispatch(fetchSearchResults(searchResults))
    })
    .catch(console.error)
}
