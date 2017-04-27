import React from 'react'
import {connect} from 'react-redux'

function SingleAccount(props) {
  console.log(props)
  const {allTime, degrees, flairs, name, previousNames, rolling300} = props.selectedAccount
  const allTimeStats = allTime && Object.keys(allTime)
  const rolling300Stats = rolling300 && Object.keys(rolling300)
  const tables = [{
    name: 'All Time',
    data: allTimeStats
  }, {
    name: 'Rolling 300',
    data: rolling300Stats
  }]
  return (
    <div>
      <div className="row">
        <h1 className="text-center">{name}</h1>
        {tables.map(table => {
          return (
            <div key={table.name} className="col-lg-4">
              <table className="table table-striped table-hover table-bordered">
                <thead>
                  <tr className="active">
                    <th>{table.name}</th>
                    <th>Value</th>
                    <th>Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {table.data && table.data.filter(stat => {
                    return stat.split(' ')[0] === 'All'
                  })
                  .map(stat => {
                    return (
                      <tr key={stat}>
                        <td>{stat.slice(4)}</td>
                        <td>{allTime[stat]}</td>
                        <td>TBD</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
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
                        <td>{flair.flairName}</td>
                        <td>Link</td>
                        <td>{flair.flairCount || 'N/A'}</td>
                        <td>TBD</td>
                      </tr>
                    )
                  })}
                  <tr>
                    <td>Total</td>
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
