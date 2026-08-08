import { i18n as i18nConfig } from '~/config'

type ExtractLocales<T> = T extends { path: infer U } ? U : T
export type Locales = ExtractLocales<typeof i18nConfig.locales[number]>

export type I18nKeys = { [i18nConfig.defaultLocale]: string } & { -readonly [key in Locales]?: string }

export type Tail<T extends any[]> = ((...args: T) => any) extends (arg: any, ...tail: infer U) => any ? U : never

export type Diff<T, U> = T extends U ? never : T
