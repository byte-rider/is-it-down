// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { resolve } from 'path';

const http = require('http');
const https = require('https');
const ping = require('ping');
const portscanner = require('portscanner')
const { exec } = require("child_process");

const performHTTPLookup = (httpModule, url) => {
    const TIMEOUT = 7000;
    return new Promise(resolve => {
        const handleSuccess = (v) => {
            const i = v.rawHeaders.indexOf('Location') + 1;
            let newLocation = (i)? v.rawHeaders[i] : "";
            resolve({
                hostIsUp: true, 
                extraInfo: {
                    protocol : v.socket._httpMessage.protocol,
                    host: v.socket._httpMessage.host,
                    path : v.socket._httpMessage.path,
                    httpStatusCode: v.statusCode,
                    httpStatusMessage: v.statusMessage,
                    newLocation: newLocation,
                    httpHeader: v.socket._httpMessage._header,
                    defaultEncoding: v._readableState.defaultEncoding,
                    rawHeaders: v.rawHeaders,
                }});
        }

        const handleError = (e) => {
            if (e.code === "ECONNRESET") {
                // timeout was reached
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
        exec(`nslookup ${host} | grep Name | head -n 1 | awk '{print $2}'`, (error, stdout, stderr) => {
            if (error) {
                resolve(error)
            }
            if (stderr) {
                resolve(stderr);
            }
            resolve(stdout);
        });

    })
}

export default async function handler(req, res) {
    
    if (req.method === 'POST') {
        let lookupResult = {};
        let resultsArray = [];
        const fqdnLookup = await getFQDN(req.body.url).then(v => {return v.toString()});
        const fqdn = {fullyQualifiedName: fqdnLookup}
        switch (req.body.protocol) {
            case 'http':
                lookupResult =  await performHTTPLookup(http, `http://${req.body.url}`).then(v => {return {protocol: "http", ...fqdn, ...v}});
                resultsArray = [lookupResult];
                break;
                
            case 'https':
                lookupResult = await performHTTPLookup(https, `https://${req.body.url}`).then(v => {return {protocol: "https", ...v}});
                resultsArray = [lookupResult];
                break;
                
            case 'ping':
                lookupResult = await performPing(req.body.url).then(v => {return {protocol: "ping", ...v}});
                resultsArray = [lookupResult];
                break;
                
            case 'vnc':
                lookupResult = await performPortScan([5900, 5901, 5902, 5903, 5904, 5905], req.body.url).then(v => {return {protocol: "vnc", ...v}});
                resultsArray = [lookupResult];
                break;
            
            case 'ssh':
                lookupResult = await performPortScan([22], req.body.url).then(v => {return {protocol: "ssh", ...v}});
                resultsArray = [lookupResult];
                break;
            case 'rdp':
                lookupResult = await performPortScan([3389], req.body.url).then(v => {return {protocol: "rdp", ...v}});
                resultsArray = [lookupResult];
                break;
        }

        resultsArray[0].extraInfo = {...fqdn, ...resultsArray[0].extraInfo}
        res.status(200).json(resultsArray);
    }
}