const dev = process.env.NODE_ENV !== 'production'

export const apiserver = dev ? 'http://localhost:3000' : 'https://isitdown.it.csiro.au';
export const serverLogFile = dev ? 
        'C:\\Users\\edw19b\\OneDrive - CSIRO\\Documents\\isitdown-serverlog\\log.json' : 
        '/home/edw19b/is-it-down/log.json';