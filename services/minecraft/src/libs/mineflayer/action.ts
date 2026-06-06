import type { z } from 'zod'

import type { Mineflayer } from './core'

type ActionResult = unknown | Promise<unknown>

export interface Action {
  readonly name: string
  readonly description: string
  readonly schema: z.ZodObject<unknown>
  readonly readonly?: boolean
  readonly followControl?: 'pause' | 'detach'
  readonly execution?: 'sync' | 'async'
  readonly perform: (mineflayer: Mineflayer) => (...args: unknown[]) => ActionResult
}
