/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as Rudy from '@respond-framework/rudy'

export const aquiredRoutes = new Map()
class Router extends Component {
  constructor(props) {
    super(props);

    if(!props.children) {
      throw new Error('[rudy-router]', 'JSX Router found no child <Routes listed');
    }

    const childs = React.Children.toArray(props.children)

    const routeKey = childs[0].props.component().chunkName()
    const routes = {
      [routeKey]: {
        ...childs[0].props,
      },
    }

    const formatRoute = (route) => ({
      ...route,
    })
aquiredRoutes.set(routeKey,routes)
    props.addRoutes(routes, formatRoute)
  }
  render() {
    return null
  }
}

class Route extends Component {
  render() {
    return null
  }
}


const mapDispatchToProps = (dispatch) => ({
  addRoutes: (routes, formatRoute = null) => dispatch(Rudy.addRoutes(routes)),
  setRoute: (object) => dispatch(object)
})

const mapState = (state) => {
  return {}
}

const ConnectedRouter = connect(mapState, mapDispatchToProps)(Router)

export {
  Route,
  ConnectedRouter
}
