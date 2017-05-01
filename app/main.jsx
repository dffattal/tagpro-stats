'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'

import store from './store'
import {getSingleAccount} from './reducers/accounts'
import {getSingleTree} from './reducers/data'

import NotFound from './components/NotFound'
import AppContainer from './components/AppContainer'
import SingleAccount from './components/SingleAccount'
import AccountSearch from './components/AccountSearch'
import StatSearch from './components/StatSearch'

function fetchAccount(routerState) {
  store.dispatch(getSingleAccount(routerState.params.id))
}
function loadTree(routerState) {
  store.dispatch(getSingleTree(routerState.location.query))
}

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={AppContainer}>
        <Route path="/accounts/results" component={AccountSearch} />
        <Route path="/accounts/:id" component={SingleAccount} onEnter={fetchAccount} />
        <Route path="/stats/results" component={StatSearch} onEnter={loadTree}/>
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
