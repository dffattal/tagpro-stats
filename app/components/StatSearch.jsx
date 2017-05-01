import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {timeStats, percentStats, convertTime, convertPercents, convertRatios} from './utils'

class StatSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lowerBound: 0,
      upperBound: 100
    }
    this.decreaseBounds = this.decreaseBounds.bind(this)
    this.increaseBounds = this.increaseBounds.bind(this)
  }
  flairImage(flair) {
    if (flair.indexOf('?') !== -1) return `/flairs/${flair.split('?')[0]}.png`
    else if (flair === 'Total') return '/flairs/No Flair.png'
    else return `/flairs/${flair}.png`
  }
  cleanStats(stat, value) {
    if (timeStats.indexOf(stat) !== -1) return convertTime(value)
    if (percentStats.indexOf(stat) !== -1) return convertPercents(value, stat)
    if (stat.indexOf('Per ') !== -1) return convertRatios(value)
    else return value
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
    const tree = this.props.selectedTree
    const sortedResults = []
    function sortTree(node, iterator) {
      if (node.right) sortTree(node.right, iterator)
      iterator(node)
      if (node.left) sortTree(node.left, iterator)
    }
    this.props.selectedTree.data && sortTree(this.props.selectedTree.data, function(node) {
      const {name, id, value, rank} = node
      sortedResults.push({
        name,
        id,
        value,
        rank
      })
    })
    return (
      <div className="col-lg-6 col-lg-offset-1 pull-left">
        {sortedResults.length
        ? <div>
          <h3>{`${tree.category}: ${tree.name}`}{tree.category === 'Flairs' ? <img src={this.flairImage(tree.name)}/> : null}</h3>
          <table className="table table-striped table-hover table-bordered">
            <thead>
              <tr className="active">
                <th className="text-right">Rank</th>
                <th>Name</th>
                <th className="text-right">{tree.name}</th>
              </tr>
            </thead>
            <tbody>
            {sortedResults.length && sortedResults.map((node, i) => {
              if (i >= this.state.lowerBound && i < this.state.upperBound) {
                return (
                  <tr key={node.id}>
                    <th className="text-right">{node.rank}</th>
                    <td><Link to={`/accounts/${node.id}`}>{node.name}</Link></td>
                    <td className="text-right">{this.cleanStats(tree.name, node.value)}</td>
                  </tr>
                )
              }
            })}
            </tbody>
          </table>
          {this.state.lowerBound !== 0
          ? <btn
          className="btn btn-info pull-left"
          onClick={this.decreaseBounds}>Prev</btn>
          : null}
          {this.state.upperBound <= sortedResults.length
          ? <btn
          className="btn btn-info pull-right"
          onClick={this.increaseBounds}>Next</btn>
          : null}
        </div>
        : <div />
        }
      </div>
    )
  }
}

const StatSearchContainer = connect(
  state => ({
    selectedTree: state.data.selectedTree
  })
)(
  (StatSearch)
)

export default StatSearchContainer
