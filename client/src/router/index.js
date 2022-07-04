// 1. Introduce route components.
import App from "../App.vue";
import {createRouter, createWebHashHistory} from "vue-router";

// 2. Define some routes
// Each route should map to a component.
const routes = [
  {path: '/:driver/:path', component: App},
]
// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})
// 5. export router for overall installation
export default router;
