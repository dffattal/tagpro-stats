import React, {Component} from 'react'
import {connect} from 'react-redux'
import {timeStats, percentStats, convertTime, convertPercents, convertRatios, calcWinPercent} from './utils'

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
    const {allTime, degrees, flairs, name, previousNames, rolling300} = this.props.selectedAccount
    const allTimeStats = allTime && Object.keys(allTime)
    const rolling300Stats = rolling300 && Object.keys(rolling300)
    const data = this.props.selectedAccountData

    allTime && calcWinPercent(allTime, allTimeStats)
    rolling300 && calcWinPercent(rolling300, rolling300Stats)

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
        <div className="row">
          <h1 className="text-center">{name}</h1>
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
                      {data[table.name] && Object.keys(data[table.name][table.state]).map(stat => {
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
                    {flairs && flairs.map(flair => {
                      return (
                        <tr key={flair.flairName}>
                          <th>{flair.flairName}</th>
                          <td><img src={
                            flair.flairName.indexOf('?') === -1
                            ? `/flairs/${flair.flairName}.png`
                            : `/flairs/${flair.flairName.split('?')[0]}.png` }/></td>
                          <td>{flair.flairCount || 'N/A'}</td>
                          <td>TBD</td>
                        </tr>
                      )
                    })}
                    <tr>
                      <th>Total</th>
                      <td></td>
                      <td>{flairs && flairs.length}</td>
                      <td>TBD</td>
                    </tr>
                  </tbody>
                </table>
              </div>
        </div>
      </div>
    )
  }
}

const SingleAccountContainer = connect(
  function mapStateToProps(state) {
    return {
      selectedAccount: state.accounts.selectedAccount,
      selectedAccountData: state.accounts.selectedAccountData
    }
  }
)(
  (SingleAccount)
)

export default SingleAccountContainer
