/**
 * TODO: port the rest of this package to typescript, and export these
 * types (or a more complete version of them) from the entry point.
 */

export type Location = {
  hash: string
  key: string
  prev: Location | undefined
}

export interface Api {
  getLocation: () => Location
}

export type Request = {}

export type Middleware = (
  api: Api,
) => (request: Request, next: () => Promise<any>) => Promise<any>

export type Route = {}

export type Options = {}
