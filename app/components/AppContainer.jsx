import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

function App({children}) {
  return (
    <div>
      <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header" >
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <ul className="nav navbar-nav">
              <li><Link className="navbar-brand" to="/">TagPro-Stats</Link></li>
            </ul>
          </div>
        </nav>
        {children}
    </div>
  )
}

const AppContainer = connect(
  () => ({})
)(
  (App)
)

export default AppContainer
