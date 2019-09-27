/* eslint-env browser */

export default (): boolean =>
  !(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  )
