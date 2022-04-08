export const dev = process.env.NODE_ENV !== 'production'

export const apiserver = dev ? 'http://localhost:3000' : 'https://isitdown.it.csiro.au';
export const serverLogFile = dev ? 
        'C:\\Users\\edw19b\\OneDrive - CSIRO\\Documents\\isitdown-serverlog\\log.json' : 
        '/home/edw19b/is-it-down/log.json';

// export const nslookup = (host) => {
//         if (dev) {
//                 return `nslookup ${host} | findstr /c:"Name:" | for /f "tokens=2" %s in ('more') do @echo %s`;
//         }        
//         return `nslookup ${host} | grep Name | head -n 1 | awk '{print $2}'`;
// }