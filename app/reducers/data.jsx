import axios from 'axios'

const FETCH_SINGLE_TREE = 'FETCH_SINGLE_TREE'

const defaultState = {
  selectedTree: {}
}

export default function(state = defaultState, action) {
  const newState = Object.assign({}, state)

  switch (action.type) {
  case FETCH_SINGLE_TREE:
    newState.selectedTree = action.selectedTree
    break
  default:
    return state
  }
  return newState
}

const fetchSingleTree = selectedTree => ({
  type: FETCH_SINGLE_TREE, selectedTree
})

export const getSingleTree = searchQuery => dispatch => {
  const category = searchQuery.category
  const name = (category === 'Flairs' ? searchQuery.flair : searchQuery.stat)
  axios.get(`/api/data?category=${category}&name=${name}`)
    .then(response => response.data)
    .then(selectedTree => {
      dispatch(fetchSingleTree(selectedTree[0]))
    })
    .catch(console.error)
}
