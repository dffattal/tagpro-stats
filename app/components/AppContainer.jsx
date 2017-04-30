import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link, browserHistory} from 'react-router'
import axios from 'axios'
import {getSearchResults} from '../reducers/accounts'

/* global toastr */
toastr.options.closeButton = true

class App extends Component {
  constructor(props) {
    super(props)
    this.search = this.search.bind(this)
    this.addAccount = this.addAccount.bind(this)
  }

  search(evt) {
    evt.preventDefault()
    this.props.getSearchResults(evt.target.search.value)
    browserHistory.push('/results')
  }

  addAccount(evt) {
    evt.preventDefault()
    const urlCheck = evt.target.account.value.split('.')
    if (urlCheck.length < 3 || urlCheck[1].toLowerCase() !== 'koalabeast' || !urlCheck[2].toLowerCase().startsWith('com')) {
      toastr.warning('Please provide a valid TagPro account profile URL.<br /><br /> Example:<br />http://tagpro-radius.koalabeast.com/profile/52e582ca49164d6a2100044e')
    } else {
      axios.post('/api/accounts', {
        url: evt.target.account.value
      })
        .then(createdAccount => {
          if (createdAccount.status === 200) {
            toastr.info('Account already exists in database.')
          } else {
            toastr.success('Account added to database!')
          }
          browserHistory.push(`/accounts/${createdAccount.data.id}`)
        })
        .catch(err => {
          toastr.error(`Internal Server Error: ${err}`)
        })
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-default">
            <div className="container-fluid">
              <ul className="nav navbar-nav">
                <li><Link className="navbar-brand" to="/">TagPro-Stats</Link></li>
              </ul>
              <ul className="nav navbar-nav pull-right">
                <li>
                  <form className="navbar-form navbar-right" onSubmit={this.addAccount}>
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="Add an account" name="account" />
                    </div>
                    <button className="btn btn-success">Add</button>
                  </form>
                  <form className="navbar-form navbar-right" onSubmit={this.search}>
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="Search for a player" name="search" />
                    </div>
                    <button className="btn btn-info">Search</button>
                  </form>
                </li>
              </ul>
            </div>
          </nav>
          <div className="col-lg-12">
            {this.props.children ? this.props.children : <h1 className="text-center logo">TagPro-Stats</h1>}
          </div>
      </div>
    )
  }
}

const AppContainer = connect(
  () => ({}),
  dispatch => ({
    getSearchResults: name => {
      dispatch(getSearchResults(name))
    }
  })
)(
  (App)
)

export default AppContainer
