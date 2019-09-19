// @flow
/* eslint-disable react/prop-types,react/jsx-props-no-spreading */

import React from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import { matchUrl, urlToLocation } from '@respond-framework/rudy'
import type { ReceivedAction } from '@respond-framework/rudy'

import { toUrlAndAction, handlePress, preventDefault } from './utils'
import { RudyConsumer } from './provider'
import type { To, OnClick } from './utils'

type OwnProps = {
  to: To,
  redirect?: boolean,
  children?: any,
  onPress?: OnClick,
  onClick?: OnClick,
  down?: boolean,
  shouldDispatch?: boolean,
  target?: string,
  style?: Object,
  className?: string,
  activeStyle?: Object,
  activeClassName?: string,
  ariaCurrent?: string,
  partial?: boolean,
  strict?: boolean,
  query?: boolean,
  hash?: boolean,
  isActive?: (?Object, Object) => boolean,
  component?: string | React.ComponentType<any>,
  api: Object,
}

type Props = {
  dispatch: Function,
  basename: string,
  routesAdded?: number,
  url?: string,
  currentPathname?: string,
} & OwnProps

const LinkInner = (props) => {
  const {
    to,
    redirect,
    component: Component = 'a',
    children,
    onPress,
    onClick,
    down = false,
    shouldDispatch = true,
    target,
    dispatch,
    basename: bn,
    currentPathname: cp, // used only for relative URLs
    api,
    routesAdded,

    url: u,
    isActive,
    partial,
    strict,
    query,
    hash,
    activeStyle,
    activeClassName,
    ariaCurrent,

    ...p
  } = props

  const { routes, getLocation, options, history } = api
  const curr = cp || getLocation().pathname // for relative paths and incorrect actions (incorrect actions don't waste re-renderings and just get current pathname from context)
  const { fullUrl, action } = toUrlAndAction(to, routes, bn, curr, options)
  const hasHref = Component === 'a' || typeof Component !== 'string'

  const handler = handlePress.bind(
    null,
    action,
    api.routes,
    shouldDispatch,
    dispatch,
    onPress || onClick,
    target,
    redirect,
    fullUrl,
    history,
  )

  return (
    <Component
      onClick={(!down && handler) || preventDefault}
      href={hasHref ? fullUrl : undefined}
      onMouseDown={down ? handler : undefined}
      onTouchStart={down ? handler : undefined}
      target={target}
      {...p}
      {...navLinkProps(props, fullUrl, action)}
    >
      {children}
    </Component>
  )
}

const navLinkProps = (
  props: Props,
  toFullUrl: string,
  action: ?ReceivedAction,
) => {
  if (!props.url) return undefined

  const {
    url,
    isActive,
    partial,
    strict,
    query: q,
    hash: h,

    style,
    className,
    activeStyle,
    activeClassName = '',
    ariaCurrent = 'true',

    api,
  } = props

  const { getLocation, options, routes } = api
  const { pathname, query, hash } = urlToLocation(toFullUrl)
  const matchers = { path: pathname, query: q && query, hash: h && hash }
  const opts = { partial, strict }
  const route = routes[action.type] || {}
  const match = matchUrl(url, matchers, opts, route, options)

  if (match) {
    Object.assign(match, action)
  }

  const active = !!(isActive ? isActive(match, getLocation()) : match)

  return {
    style: active ? { ...style, ...activeStyle } : style,
    className: `${className || ''} ${active ? activeClassName : ''}`.trim(),
    'aria-current': active && ariaCurrent,
  }
}

const mapState = (state: Object, { api, ...props }: OwnProps) => {
  const { url, pathname, basename: bn, routesAdded } = api.getLocation()
  const isNav = props.activeClassName || props.activeStyle // only NavLinks re-render when the URL changes

  // We are very precise about what we want to cause re-renderings, as perf is
  // important! So only pass currentPathname if the user will in fact be making
  // use of it for relative paths.
  let currentPathname

  if (typeof props.to === 'string' && props.to.charAt(0) !== '/') {
    currentPathname = pathname
  }

  const basename = bn ? `/${bn}` : ''

  return {
    api,
    basename,
    routesAdded,
    url: isNav && url,
    currentPathname,
  }
}

const connector: Connector<OwnProps, Props> = connect(mapState)

const LinkConnected = connector(LinkInner)

export const Link = (props) => (
  <RudyConsumer>{(api) => <LinkConnected api={api} {...props} />}</RudyConsumer>
)

export const NavLink = ({ activeClassName = 'active', ...props }: Object) => (
  <Link activeClassName={activeClassName} {...props} />
)
