import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link, browserHistory} from 'react-router'
import axios from 'axios'
import {getSearchResults} from '../reducers/accounts'
import {getSingleTree} from '../reducers/data'
import {flairTreesToBuild, treesToBuild} from 'APP/server/data/utils'

/* global toastr */
toastr.options.closeButton = true

class App extends Component {
  constructor(props) {
    super(props)
    this.state={
      category: 'All Time',
      stat: 'Win Percent',
      flair: 'TagPro Developer'
    }
    this.searchAccounts = this.searchAccounts.bind(this)
    this.addAccount = this.addAccount.bind(this)
    this.changeCategory = this.changeCategory.bind(this)
    this.changeStat = this.changeStat.bind(this)
    this.searchStats = this.searchStats.bind(this)
  }

  searchAccounts(evt) {
    evt.preventDefault()
    this.props.getSearchResults(evt.target.search.value)
    browserHistory.push('/results')
  }

  searchStats(evt) {
    evt.preventDefault()
    this.props.getSingleTree(this.state)
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

  changeCategory(evt) {
    this.setState({
      category: evt.target.value
    })
  }

  changeStat(evt) {
    if (this.state.category === 'Flairs') {
      this.setState({
        flair: evt.target.value
      })
    } else {
      this.setState({
        stat: evt.target.value
      })
    }
  }

  render() {
    console.log(this.state)
    const stats = (this.state.category === 'Flairs' ? flairTreesToBuild : Object.keys(treesToBuild))
    return (
      <div>
        <nav className="navbar navbar-default">
            <div className="container-fluid">
              <ul className="nav navbar-nav">
                <li><Link className="navbar-brand" to="/">TagPro-Stats</Link></li>
                <li>
                  <form className="navbar-form navbar-left" onSubmit={this.searchStats}>
                    <label className="nav-label">Search:</label>
                    <select className="form-control" value={this.state.category} onChange={this.changeCategory}>
                      <option value="All Time">All Time</option>
                      <option value="Rolling 300">Rolling 300</option>
                      <option value="Flairs">Flairs</option>
                    </select>
                    <select className="form-control" value={this.state.stat} onChange={this.changeStat}>
                      {stats.map(stat => {
                        return (
                          <option value={stat} key={stat}>{stat}</option>
                        )
                      })}
                    </select>
                    <button className="btn btn-info">Submit</button>
                  </form>
                </li>
              </ul>
              <ul className="nav navbar-nav pull-right">
                <li>
                  <form className="navbar-form navbar-right" onSubmit={this.addAccount}>
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="Add an account" name="account" />
                    </div>
                    <button className="btn btn-success">Add</button>
                  </form>
                  <form className="navbar-form navbar-right" onSubmit={this.searchAccounts}>
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
    },
    getSingleTree: searchQuery => {
      dispatch(getSingleTree(searchQuery))
    }
  })
)(
  (App)
)

export default AppContainer
