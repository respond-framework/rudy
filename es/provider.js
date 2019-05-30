import React, { createContext } from 'react';
import PropTypes from 'prop-types';
var RudyContext = createContext('rudy-link');
export var RudyProvider = function RudyProvider(_ref) {
  var api = _ref.api,
      children = _ref.children;
  return React.createElement(RudyContext.Provider, {
    value: api
  }, children);
};
RudyProvider.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  api: PropTypes.object.isRequired
};
export var RudyConsumer = RudyContext.Consumer;
//# sourceMappingURL=provider.js.map