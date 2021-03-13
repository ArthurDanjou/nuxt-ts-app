export { default as Logo } from '../..\\src\\components\\Logo.vue'

export const LazyLogo = import('../..\\src\\components\\Logo.vue' /* webpackChunkName: "components/logo" */).then(c => c.default || c)
