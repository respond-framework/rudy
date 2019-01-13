import React from 'react'
import { connect } from 'react-redux'

// Home component
const Home = ({ visitUser }) => {
  const rndUserId = Math.floor(20 * Math.random())
  return (
    <div>
      <p>Welcome home!</p>
      <button type="button" onClick={() => visitUser(rndUserId)}>
        {`Visit user ${rndUserId}`}
      </button>
    </div>
  )
}

const ConnectedHome = connect(
  null,
  (dispatch) => ({
    visitUser: (userId) => dispatch({ type: 'USER', params: { id: userId } }),
  }),
)(Home)

// User component
const User = ({ goHome, userId }) => (
  <div>
    <p>{`User component: user ${userId}`}</p>
    <button type="button" onClick={() => goHome()}>
      Back
    </button>
  </div>
)

const ConnectedUser = connect(
  ({ location: { params } }) => ({ userId: params.id }),
  (dispatch) => ({ goHome: () => dispatch({ type: 'HOME' }) }),
)(User)

// 404 component
const NotFound = ({ pathname }) => (
  <div>
    <h3>404</h3>
    Page not found: <code>{pathname}</code>
  </div>
)
const ConnectedNotFound = connect(({ location: { pathname } }) => ({
  pathname,
}))(NotFound)

export {
  ConnectedHome as Home,
  ConnectedUser as User,
  ConnectedNotFound as NotFound,
}
