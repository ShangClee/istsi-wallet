// Type override for i18next to fix compatibility with React 18 and TypeScript 5.x
// This makes TFunctionResult compatible with ReactNode by treating it as a string
/// <reference types="react" />

declare module "i18next" {
  // Make TFunctionResult compatible with React.ReactNode
  // In practice, t() returns strings which are valid ReactNode values
  type TFunctionResult = string

  // Re-export TFunction for compatibility
  export interface TFunction {
    (key: string, options?: any): string
    (key: string, defaultValue?: string, options?: any): string
  }

  // Ensure i18n instance has the necessary methods
  export interface i18n {
    use(module: any): i18n
    init(options?: any): Promise<TFunction>
    changeLanguage(lng: string): Promise<TFunction>
    t: TFunction
  }
}
