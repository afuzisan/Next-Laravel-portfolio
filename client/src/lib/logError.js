'use client'

export const logError = error => {
  /* eslint-disable no-console */
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error)
  }
  /* eslint-enable no-console */
}
