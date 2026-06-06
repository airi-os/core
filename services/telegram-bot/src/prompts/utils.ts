import type { TextContentPart } from '@xsai/shared-chat'

export function vif(condition: boolean, a: string, b = '') {
  return condition ? a : b
}

export function vChoice(...args: [boolean | (() => boolean), string][]) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [exp, result] of args) {
    if (typeof exp === 'function' ? exp() : exp) {
      return result
    }
  }

  return ''
}

export function span(...args: string[]) {
  return args
    .map(arg => arg.trim())
    .map(arg => arg.replaceAll(/\n\s+/g, ''))
    .map(arg => arg.replaceAll(/\r\s+/g, ' '))
    .join(' ')
}

export function div(...args: (string | TextContentPart | TextContentPart[] | null | undefined)[]) {
  const results: string[] = []

  for (const arg of args) {
    if (arg == null) {
      continue
    }
    if (typeof arg === 'string') {
      results.push(arg)
    }
    else if (Array.isArray(arg)) {
      results.push(div(...arg))
    }
    else {
      results.push(arg.text)
    }
  }

  return results.join('\n\n')
}

// ul + li
export function ul(...args: string[]) {
  return args.map((arg) => {
    return `- ${arg}`
  }).join('\n')
}
