import React, { createContext } from 'react'
import PropTypes from 'prop-types'

const RudyContext = createContext('rudy-link')

export const RudyProvider = ({ api, children }) => (
  <RudyContext.Provider value={api}>{children}</RudyContext.Provider>
)

RudyProvider.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  api: PropTypes.object.isRequired,
}

export const RudyConsumer = RudyContext.Consumer
