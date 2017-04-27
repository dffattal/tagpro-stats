import React from 'react'
import {connect} from 'react-redux'
import {timeStats, percentStats, convertTime, convertPercents, calcWinPercent} from './utils'

function SingleAccount(props) {
  const {allTime, degrees, flairs, name, previousNames, rolling300} = props.selectedAccount
  const allTimeStats = allTime && Object.keys(allTime)
  const rolling300Stats = rolling300 && Object.keys(rolling300)

  allTime && calcWinPercent(allTime, allTimeStats)
  rolling300 && calcWinPercent(rolling300, rolling300Stats)

  const tables = [{
    name: 'All Time',
    stats: allTimeStats,
    data: allTime,
    tabs: ['Daily', 'Weekly', 'Monthly', 'All']
  }, {
    name: 'Rolling 300',
    stats: rolling300Stats,
    data: rolling300,
    tabs: ['All', 'CTF', 'Neutral']
  }]

  function cleanStats(stat, value) {
    if (timeStats.indexOf(stat) !== -1) return convertTime(value)
    if (percentStats.indexOf(stat) !== -1) return (convertPercents(value))
    else return value
  }

  return (
    <div>
      <div className="row">
        <h1 className="text-center">{name}</h1>
        {tables.map(table => {
          return (
            <div key={table.name} className="col-lg-4">
              <ul className="nav nav-tabs">
                {table.tabs.map(tab => {
                  return (
                    <li key={tab} data-target={`${tab}`}>
                      <a href={`#${tab}`} data-toggle="tab">{tab}</a>
                    </li>
                  )
                })}
              </ul>
              <div className="tab-content">
                <div className="tab-pane active" id="All">
                  <table className="table table-striped table-hover table-bordered">
                    <thead>
                      <tr className="active">
                        <th>{table.name}</th>
                        <th>Value</th>
                        <th>Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.stats && table.stats.filter(stat => {
                        return stat.split(' ')[0] === 'All'
                      })
                      .map(stat => {
                        const statTitle = stat.slice(4)
                        return (
                          <tr key={stat}>
                            <th>{statTitle}</th>
                            <td>{cleanStats(statTitle, table.data[stat])}</td>
                            <td>TBD</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        })}
        <div key="Flairs" className="col-lg-4">
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
