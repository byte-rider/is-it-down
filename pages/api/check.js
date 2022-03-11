// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { resolve } from 'path';

const http = require('http');
const https = require('https');
const ping = require('ping');
const portscanner = require('portscanner')

const performHTTPLookup = (httpModule, url) => {
    return new Promise(resolve => {
        const handleSuccess = (v) => {
            resolve({hostIsUp: true, httpStatusCode: v.statusCode, httpStatusMessage: v.statusMessage});
        }

        const handleError = (e) => {
            resolve({hostIsUp: false, httpStatusCode: "none", httpStatusMessage: e.code});
        }
        try {
            httpModule
            .get(url,  v => handleSuccess(v))
            .on('error', e => handleError(e))
        } catch (e) {
            handleError(e);
        }
    });
}

const performPortScan = (portsArray, host) => {
    return new Promise(resolve => {
        portscanner.findAPortInUse(portsArray, host, function(error, port) {
            if (!!port) {
                resolve({hostIsUp: true, vncPortOpen: port})
            }
            resolve({hostIsUp: false, vncPortOpen: "none"})
        })
    })
}

const performPing = (host) => {
    return new Promise(resolve => {
        ping.promise.probe(host).then(results => {
            if (results.alive === true) {
                resolve({hostIsUp: true, ...results})
            }
            
            if (results.alive === false) {
                resolve({hostIsUp: false, ...results})
            }
        })
    })
}

export default async function handler(req, res) {
    
    if (req.method === 'POST') {
        let lookupResult = {};
        let resultsArray = [];
        switch (req.body.protocol) {
            case 'http':
                lookupResult =  await performHTTPLookup(http, `http://${req.body.url}`).then(v => {return {protocol: "http", ...v}});
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
                
            case 'ALL':
                const a = performHTTPLookup(http, `http://${req.body.url}`).then(v => {return {protocol: "http", ...v}});
                const b = performHTTPLookup(https, `https://${req.body.url}`).then(v => {return {protocol: "https", ...v}});
                const c = performPing(req.body.url).then(v => {return {protocol: "ping", ...v}});
                const d = performPortScan([5900, 5901, 5902, 5903, 5904, 5905], req.body.url).then(v => {return {protocol: "vnc", ...v}});
                resultsArray = await Promise.all([a, b, c, d]);
                break;
        }

        // res.status(200);
        res.status(200).json(resultsArray);
    }
}