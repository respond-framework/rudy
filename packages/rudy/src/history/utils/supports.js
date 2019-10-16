// @flow
/* global window */

// eslint-disable-next-line import/prefer-default-export
export const supportsDom = () =>
  !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  )
