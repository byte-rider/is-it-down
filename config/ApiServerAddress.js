const dev = process.env.NODE_ENV !== 'production'

export const apiserver = dev ? 'http://localhost:3000' : 'http://isitdown.it.csiro.au';