// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {serverLogFile, dev} from '../../config/ApiServerAddress';

const http = require('http');
const https = require('https');
const ping = require('ping');
const portscanner = require('portscanner')
const { exec } = require("child_process");

const fs = require('fs'); // file system : used for writing to the log

const performHTTPLookup = (httpModule, url) => {
    const TIMEOUT = 7000;
    return new Promise(resolve => {
        const handleSuccess = (v) => {
            let returnObject = { hostIsUp: true } 
            let extraInfoObject = {
                protocol : v.socket._httpMessage.protocol,
                host: v.socket._httpMessage.host,
                path : v.socket._httpMessage.path,
                httpStatusCode: v.statusCode,
                httpMessage: v.statusMessage,
                httpHeader: v.socket._httpMessage._header,
                defaultEncoding: v._readableState.defaultEncoding,
                rawHeaders: v.rawHeaders,
            }

            // mutates above object if a redirect was returned
            if (v.statusCode === 301) {
                const i = v.rawHeaders.indexOf('Location') + 1;
                extraInfoObject.httpMessage = (i) ? `MOVED TO --> ${v.rawHeaders[i]}` : v.statusMessage;
            }

            // nests extra info inside the return object
            returnObject.extraInfo = extraInfoObject;
            resolve(returnObject);
        }

        const handleError = (e) => {
            if (e.code === "ECONNRESET") { // timeout was reached
                e.socket = "socket hang up";
                e.note = "timeout reached";
            }
            resolve({
                hostIsUp: false,
                extraInfo: {
                    failedAt: e.syscall,
                    reason: e.code,
                    errno: e.errno,
                    hostname: e.address,
                    socket: e.socket,
                    note: e.note,
                }});
        }
        try {
            const request = httpModule.get(url, {timeout: TIMEOUT});
            request.on('response', response => handleSuccess(response));
            request.on('timeout', () => request.abort())
            request.on('error', e => handleError(e))
        } catch (e) {
            handleError(e);
        }
    });
}

const performPortScan = (portsArray, host) => {
    return new Promise(resolve => {
        portscanner.findAPortInUse(portsArray, host, function(error, port) {
            if (!!port) {
                resolve({hostIsUp: true, extraInfo: {portOpen: port}})
            } else {
                resolve({hostIsUp: false, extraInfo: {portOpen: "none"}})
            }
        })
    })
}

const performPing = (host) => {
    return new Promise(resolve => {
        ping.promise.probe(host).then(results => {
            if (results.alive === true) {
                resolve({hostIsUp: true, extraInfo: {...results}})
            }
            
            if (results.alive === false) {
                resolve({hostIsUp: false, extraInfo: {...results}})
            }
        })
    })
}

const getFQDN = function(host) {
    return new Promise(resolve => {
        if (dev) { resolve("dev environment") }
        exec(`nslookup ${host} | grep Name | head -n 1 | awk '{print $2}'`, (error, stdout, stderr) => {
            if (error) { resolve("error") }
            if (stderr) { resolve(stderr) }
            resolve(stdout);
        });
    })
}

const writeToLog = function(host, request) {
    let log = JSON.parse(fs.readFileSync(serverLogFile));
    try {
        if (!log.hasOwnProperty(host)) {
            log[host] = {};
        }
        
        if (!log[host].hasOwnProperty(request.body.protocol)) {
            log[host][request.body.protocol] = 0;
        }

        log[host][request.body.protocol] += 1;

        fs.writeFileSync(serverLogFile, JSON.stringify(log, null, 2));
    } catch (error) {
        console.error(`failed to write to log: ${error}`);
        return;
    }
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        let lookupResult = {};
        let resultsArray = [];
        let sanitisedInput = req.body.url.replace(/[^A-Za-z0-9\.:%-]/g, "").replace(/https?:\/\//, "");
        writeToLog(sanitisedInput, req);
        const fqdnLookup = await getFQDN(sanitisedInput).then(v => {return v.toString()});
        const fqdn = {fullyQualifiedName: fqdnLookup}
        switch (req.body.protocol) {
            case 'http':
                lookupResult =  await performHTTPLookup(http, `http://${sanitisedInput}`).then(v => {return {protocol: "http", ...fqdn, ...v}});
                resultsArray = [lookupResult];
                break;
                
            case 'https':
                lookupResult = await performHTTPLookup(https, `https://${sanitisedInput}`).then(v => {return {protocol: "https", ...v}});
                resultsArray = [lookupResult];
                break;
                
            case 'ping':
                lookupResult = await performPing(sanitisedInput).then(v => {return {protocol: "ping", ...v}});
                resultsArray = [lookupResult];
                break;
                
            case 'vnc':
                lookupResult = await performPortScan([5900, 5901, 5902, 5903, 5904, 5905], sanitisedInput).then(v => {return {protocol: "vnc", ...v}});
                resultsArray = [lookupResult];
                break;
            
            case 'ssh':
                lookupResult = await performPortScan([22], sanitisedInput).then(v => {return {protocol: "ssh", ...v}});
                resultsArray = [lookupResult];
                break;
            case 'rdp':
                lookupResult = await performPortScan([3389], sanitisedInput).then(v => {return {protocol: "rdp", ...v}});
                resultsArray = [lookupResult];
                break;
        }

        resultsArray[0].extraInfo = {...fqdn, ...resultsArray[0].extraInfo}
        res.status(200).json(resultsArray);
    }
}