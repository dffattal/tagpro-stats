import React, {Component} from 'react'
import {connect} from 'react-redux'
import {timeStats, percentStats, convertTime, convertPercents, convertRatios} from './utils'

class SingleAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allTimeTab: 'All',
      rolling300Tab: 'All'
    }
    this.currentTab = this.currentTab.bind(this)
    this.changeTab = this.changeTab.bind(this)
  }

  flairImage(flair) {
    if (flair.indexOf('?') !== -1) return `/flairs/${flair.split('?')[0]}.png`
    else if (flair === 'Total') return `/flairs/${this.props.selectedAccount.selectedFlair}.png`
    else return `/flairs/${flair}.png`
  }

  cleanStats(stat, value) {
    if (timeStats.indexOf(stat) !== -1) return convertTime(value)
    if (percentStats.indexOf(stat) !== -1) return convertPercents(value, stat)
    if (stat.indexOf('Per ') !== -1) return convertRatios(value)
    else return value
  }

  currentTab(tableName) {
    if (tableName === 'All Time') return this.state.allTimeTab
    else return this.state.rolling300Tab
  }

  changeTab(event, tableName) {
    if (tableName === 'All Time') this.setState({allTimeTab: event.target.value})
    else this.setState({rolling300Tab: event.target.value})
  }

  render() {
    const {degrees, name, previousNames, data, selectedFlair, url} = this.props.selectedAccount
    const flairNames = data && Object.keys(data.flairs)

    const tables = [{
      name: 'All Time',
      tabs: ['Daily', 'Weekly', 'Monthly', 'All'],
      state: this.state.allTimeTab
    }, {
      name: 'Rolling 300',
      tabs: ['All', 'CTF', 'Neutral'],
      state: this.state.rolling300Tab
    }]
    return (
      <div>
        {this.props.selectedAccount.id
        ? this.props.selectedAccount.data
        ? <div className="row">
          <h1 className="text-center"><a href={url}>{name}</a></h1>
          <div className="col-lg-12">
            {tables.map((table, i) => {
              return (
                <div key={table.name} className="col-lg-4 col-lg-offset-1">
                  {table.tabs.map(tab => {
                    return (
                      <button
                      key={tab}
                      className={`btn btn-primary ${this.currentTab(table.name) === tab ? 'active' : ''}`}
                      value={tab}
                      onClick={event => this.changeTab(event, table.name)}>
                      {tab}
                      </button>
                    )
                  })}
                  <table className="table table-striped table-hover table-bordered">
                    <thead>
                      <tr className="active">
                        <th>{table.name}</th>
                        <th className="text-right">Value</th>
                        <th className="text-right">Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data && Object.keys(data[table.name][table.state]).map(stat => {
                        const statObj = data[table.name][table.state][stat]
                        return (
                          <tr key={stat}>
                            <th>{stat}</th>
                            <td className="text-right">{this.cleanStats(stat, statObj.value)}</td>
                            <td className="text-right">{statObj.rank}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>
          <div key="Flairs" className="col-lg-6 col-lg-offset-3">
                <table className="table table-striped table-hover table-bordered">
                  <thead>
                    <tr className="active">
                      <th>Flairs</th>
                      <th>Image</th>
                      <th>Count</th>
                      <th>Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && flairNames.map(flair => {
                      return (
                        <tr key={flair}>
                          <th>{flair}</th>
                          <td><img src={this.flairImage(flair)}/></td>
                          <td>{data.flairs[flair].value || 'N/A'}</td>
                          <td>{data.flairs[flair].rank}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
        </div>
        : <h2>Account is being built, check back soon!</h2>
        : <h2>Account not found.</h2>}
      </div>
    )
  }
}

const SingleAccountContainer = connect(
  function mapStateToProps(state) {
    return {
      selectedAccount: state.accounts.selectedAccount
    }
  }
)(
  (SingleAccount)
)

export default SingleAccountContainer
