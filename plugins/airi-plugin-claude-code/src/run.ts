#!/usr/bin/env node
import module from 'node:module'

import { runCLI } from './cli'

try {
  module.enableCompileCache?.()
}
// eslint-disable-next-line no-empty
catch {
  // noop
}
runCLI()
