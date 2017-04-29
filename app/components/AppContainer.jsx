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
            {this.props.children}
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
