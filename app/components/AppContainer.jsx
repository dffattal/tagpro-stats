import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link, browserHistory} from 'react-router'
import {getSearchResults} from '../reducers/accounts'


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
    console.log(evt.target.account.value)
    const urlCheck = evt.target.account.value.split('.')
    if (urlCheck[1].toLowerCase() === 'koalabeast' && urlCheck[2].toLowerCase().startsWith('com')) {
      console.log('Clean url!')
    } else {
      console.log('Bad url!')
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
