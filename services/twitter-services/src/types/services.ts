export interface TwitterService {
  [key: string]: (...args: unknown[]) => any
}

export interface TwitterServices {
  [key: string]: TwitterService
}
