// I plan for this to grow so ive made is a class

class nestedRoutes {
  constructor() {
    this.routes = {}
  }
  add(routes) {
   this.routes = routes
  }
}


export default new nestedRoutes()

