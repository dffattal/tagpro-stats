'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'

import store from './store'
import {getSingleAccount} from './reducers/accounts'

import NotFound from './components/NotFound'
import AppContainer from './components/AppContainer'
import SingleAccount from './components/SingleAccount'
import SearchResults from './components/SearchResults'

function fetchAccount(routerState) {
  store.dispatch(getSingleAccount(routerState.params.id))
}

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={AppContainer}>
        <Route path="/accounts/:id" component={SingleAccount} onEnter={fetchAccount} />
        <Route path="/results" component={SearchResults} />
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
