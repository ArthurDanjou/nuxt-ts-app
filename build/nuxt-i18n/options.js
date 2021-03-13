export const vueI18n = {"fallbackLocale":"en"}
export const vueI18nLoader = false
export const locales = [{"code":"en","name":"English","iso":"en-EN","file":"en-EN.ts"},{"code":"fr","iso":"fr-FR","file":"fr-FR.ts","name":"Français"}]
export const defaultLocale = "en"
export const defaultDirection = "ltr"
export const routesNameSeparator = "___"
export const defaultLocaleRouteNameSuffix = "default"
export const strategy = "no_prefix"
export const lazy = true
export const langDir = "C:\\Users\\arthu\\Documents\\Workspace\\nuxt-ts-app\\src\\locales"
export const rootRedirect = null
export const detectBrowserLanguage = {"useCookie":true,"cookieCrossOrigin":false,"cookieDomain":null,"cookieKey":"i18n_redirected","cookieSecure":false,"alwaysRedirect":false,"fallbackLocale":"","onlyOnNoPrefix":false,"onlyOnRoot":false}
export const differentDomains = false
export const seo = true
export const baseUrl = ""
export const vuex = {"moduleName":"i18n","syncLocale":false,"syncMessages":false,"syncRouteParams":true}
export const parsePages = true
export const pages = {}
export const skipSettingLocaleOnNavigate = false
export const beforeLanguageSwitch = () => null
export const onLanguageSwitched = () => null
export const IS_UNIVERSAL_MODE = true
export const MODULE_NAME = "nuxt-i18n"
export const LOCALE_CODE_KEY = "code"
export const LOCALE_ISO_KEY = "iso"
export const LOCALE_DIR_KEY = "dir"
export const LOCALE_DOMAIN_KEY = "domain"
export const LOCALE_FILE_KEY = "file"
export const STRATEGIES = {"PREFIX":"prefix","PREFIX_EXCEPT_DEFAULT":"prefix_except_default","PREFIX_AND_DEFAULT":"prefix_and_default","NO_PREFIX":"no_prefix"}
export const COMPONENT_OPTIONS_KEY = "nuxtI18n"
export const localeCodes = ["en","fr"]
export const trailingSlash = undefined

export const ASYNC_LOCALES = {
  'en-EN.ts': () => import('../..\\src\\locales\\en-EN.ts' /* webpackChunkName: "lang-en-EN.ts" */),
  'fr-FR.ts': () => import('../..\\src\\locales\\fr-FR.ts' /* webpackChunkName: "lang-fr-FR.ts" */)
}
