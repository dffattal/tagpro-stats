import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

class SearchResults extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="col-lg-6 col-lg-offset-1 pull-left">
        <h3>Search Results</h3>
        <ul className="list-group">
          {this.props.searchResults.map(account => {
            return (
              <li key={account.id} className="list-group-item">
                <Link to={`/accounts/${account.id}`}>{account.name}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

const SearchResultsContainer = connect(
  state => ({
    searchResults: state.accounts.searchResults
  })
)(
  (SearchResults)
)

export default SearchResultsContainer
