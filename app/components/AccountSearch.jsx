import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

class AccountSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lowerBound: 0,
      upperBound: 100
    }
    this.decreaseBounds = this.decreaseBounds.bind(this)
    this.increaseBounds = this.increaseBounds.bind(this)
  }
  decreaseBounds() {
    this.setState({
      lowerBound: this.state.lowerBound -= 100,
      upperBound: this.state.upperBound -= 100
    })
  }
  increaseBounds() {
    this.setState({
      lowerBound: this.state.lowerBound += 100,
      upperBound: this.state.upperBound += 100
    })
  }
  render() {
    const results = this.props.searchResults
    return (
      <div className="col-lg-6 col-lg-offset-1 pull-left">
        <h3>{results.length} Account{results.length === 1 ? '' : 's'} Found</h3>
        <ul className="list-group">
          {results.map((account, i) => {
            if (i >= this.state.lowerBound && i < this.state.upperBound) {
              return (
                <li key={account.id} className="list-group-item">
                  <Link to={`/accounts/${account.id}`}>{account.name}</Link>
                </li>
              )
            }
          })}
        </ul>
        <btn
        className={`btn btn-info pull-left ${this.state.lowerBound === 0 ? 'disabled' : ''}`}
        onClick={this.decreaseBounds}>Prev</btn>
        <btn
        className={`btn btn-info pull-right ${this.state.upperBound >= results.length ? 'disabled' : ''}`}
        onClick={this.increaseBounds}>Next</btn>
      </div>
    )
  }
}

const AccountSearchContainer = connect(
  state => ({
    searchResults: state.accounts.searchResults
  })
)(
  (AccountSearch)
)

export default AccountSearchContainer
