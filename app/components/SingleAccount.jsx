import React from 'react'
import {connect} from 'react-redux'

function SingleAccount(props) {
  console.log(props)
  const {allTime, degrees, flairs, name, previousNames, rolling300} = props.selectedAccount
  const allTimeStats = Object.keys(allTime)
  const rolling300Stats = Object.keys(rolling300)
  return (
    <div>
      <div className="row">
        <div className="col-lg-8">
          <h1 className="text-center">{name}</h1>
          <table className="table table-striped table-hover">
            <thead>
              <th>All Time</th>
            </thead>
            <tbody>
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
