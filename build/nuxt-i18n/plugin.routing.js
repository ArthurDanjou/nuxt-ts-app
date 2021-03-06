import './middleware'
import Vue from 'vue'
import {
  defaultLocale,
  defaultLocaleRouteNameSuffix,
  LOCALE_CODE_KEY,
  LOCALE_DOMAIN_KEY,
  MODULE_NAME,
  routesNameSeparator,
  STRATEGIES,
  strategy,
  trailingSlash,
  vuex
} from './options'
import { getDomainFromLocale } from './utils-common'

function localePath (route, locale) {
  const localizedRoute = localeRoute.call(this, route, locale)

  if (!localizedRoute) {
    return
  }

  return localizedRoute.fullPath
}

function localeRoute (route, locale) {
  // Abort if no route or no locale
  if (!route) {
    return
  }

  const { i18n } = this

  locale = locale || i18n.locale

  if (!locale) {
    return
  }

  // If route parameter is a string, check if it's a path or name of route.
  if (typeof route === 'string') {
    if (route[0] === '/') {
      // If route parameter is a path, create route object with path.
      route = { path: route }
    } else {
      // Else use it as route name.
      route = { name: route }
    }
  }

  let localizedRoute = Object.assign({}, route)

  if (route.path && !route.name) {
    const resolvedRoute = this.router.resolve(route.path).route
    const resolvedRouteName = this.getRouteBaseName(resolvedRoute)
    if (resolvedRouteName) {
      localizedRoute = {
        name: getLocaleRouteName(resolvedRouteName, locale),
        params: resolvedRoute.params,
        query: resolvedRoute.query,
        hash: resolvedRoute.hash
      }
    } else {
      const isDefaultLocale = locale === defaultLocale
      // if route has a path defined but no name, resolve full route using the path
      const isPrefixed =
          // don't prefix default locale
          !(isDefaultLocale && [STRATEGIES.PREFIX_EXCEPT_DEFAULT, STRATEGIES.PREFIX_AND_DEFAULT].includes(strategy)) &&
          // no prefix for any language
          !(strategy === STRATEGIES.NO_PREFIX) &&
          // no prefix for different domains
          !i18n.differentDomains
      if (isPrefixed) {
        localizedRoute.path = `/${locale}${route.path}`
      }
      localizedRoute.path = localizedRoute.path.replace(/\/+$/, '') + (trailingSlash ? '/' : '') || '/'
    }
  } else {
    if (!route.name && !route.path) {
      localizedRoute.name = this.getRouteBaseName()
    }

    localizedRoute.name = getLocaleRouteName(localizedRoute.name, locale)

    const { params } = localizedRoute
    if (params && params['0'] === undefined && params.pathMatch) {
      params['0'] = params.pathMatch
    }
  }

  const resolvedRoute = this.router.resolve(localizedRoute).route
  if (resolvedRoute.name) {
    return resolvedRoute
  }
  // If didn't resolve to an existing route then just return resolved route based on original input.
  return this.router.resolve(route).route
}

function switchLocalePath (locale) {
  const name = this.getRouteBaseName()
  if (!name) {
    return ''
  }

  const { i18n, route, store } = this

  if (!route) {
    return ''
  }

  const { params, ...routeCopy } = route
  let langSwitchParams = {}
  if (vuex && vuex.syncRouteParams && store) {
    langSwitchParams = store.getters[`${vuex.moduleName}/localeRouteParams`](locale)
  }
  const baseRoute = Object.assign({}, routeCopy, {
    name,
    params: {
      ...params,
      ...langSwitchParams,
      0: params.pathMatch
    }
  })
  let path = this.localePath(baseRoute, locale)

  // Handle different domains
  if (i18n.differentDomains) {
    const options = {
      differentDomains: i18n.differentDomains,
      locales: i18n.locales,
      localeDomainKey: LOCALE_DOMAIN_KEY,
      localeCodeKey: LOCALE_CODE_KEY,
      moduleName: MODULE_NAME
    }
    const domain = getDomainFromLocale(locale, this.req, options)
    if (domain) {
      path = domain + path
    }
  }

  return path
}

function getRouteBaseName (givenRoute) {
  const route = givenRoute !== undefined ? givenRoute : this.route
  if (!route || !route.name) {
    return null
  }
  return route.name.split(routesNameSeparator)[0]
}

function getLocaleRouteName (routeName, locale) {
  let name = routeName + (strategy === STRATEGIES.NO_PREFIX ? '' : routesNameSeparator + locale)

  if (locale === defaultLocale && strategy === STRATEGIES.PREFIX_AND_DEFAULT) {
    name += routesNameSeparator + defaultLocaleRouteNameSuffix
  }

  return name
}

const VueInstanceProxy = function (targetFunction) {
  return function () {
    const proxy = {
      getRouteBaseName: this.getRouteBaseName,
      i18n: this.$i18n,
      localePath: this.localePath,
      req: process.server ? this.$ssrContext.req : null,
      route: this.$route,
      router: this.$router,
      store: this.$store
    }

    return targetFunction.apply(proxy, arguments)
  }
}

const NuxtContextProxy = function (context, targetFunction) {
  return function () {
    const { app, req, route, store } = context

    const proxy = {
      getRouteBaseName: app.getRouteBaseName,
      i18n: app.i18n,
      localePath: app.localePath,
      req: process.server ? req : null,
      route,
      router: app.router,
      store
    }

    return targetFunction.apply(proxy, arguments)
  }
}

const plugin = {
  install (Vue) {
    Vue.mixin({
      methods: {
        localePath: VueInstanceProxy(localePath),
        localeRoute: VueInstanceProxy(localeRoute),
        switchLocalePath: VueInstanceProxy(switchLocalePath),
        getRouteBaseName: VueInstanceProxy(getRouteBaseName)
      }
    })
  }
}

export default (context) => {
  Vue.use(plugin)
  const { app } = context
  app.localePath = NuxtContextProxy(context, localePath)
  app.localeRoute = NuxtContextProxy(context, localeRoute)
  app.switchLocalePath = NuxtContextProxy(context, switchLocalePath)
  app.getRouteBaseName = NuxtContextProxy(context, getRouteBaseName)
}
