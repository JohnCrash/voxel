import log from './log';
import {Global} from '../global';

require("whatwg-fetch");

function fetchCDN(s){
    if(window.cdndomain && s){
        let c = s[0];
        if( c === '/')
            return fetch(window.cdndomain+s.slice(1),{credentials:'include'});
        else if(c === '.')
            return fetch(s);
        else
            return fetch(window.cdndomain+s,{credentials:'include'});
    }else{
        return fetch(s);
    }
}

function fetchBin(s,cb,errcb){
    fetchCDN(s)
    .then(response=>response.arrayBuffer())
    .then(data=>cb(data))
    .catch(err=>{
        fetch(s).then(response=>response.arrayBuffer())
        .then(data=>cb(data))
        .catch(err=>{
            errcb?errcb(err):log(err);
        });
    });
}

function fetchJson(s,cb,errcb){
    fetchCDN(s)
    .then(response=>response.json())
    .then(json=>cb(json))
    .catch(err=>{
        fetch(s)
        .then(response=>response.json())
        .then(json=>cb(json))
        .catch(err=>{
            errcb?errcb(err):log(err);
        });
    });
}

function fetchText(s,cb,errcb){
    fetchCDN(s)
    .then(response=>response.text())
    .then(text=>cb(text))
    .catch(err=>{
        fetch(s)
        .then(response=>response.text())
        .then(text=>cb(text))
        .catch(err=>{
            errcb?errcb(err):log(err);
        });
    });
}

function postJson(s,b,cb,errcb){
    b = b || {};
    b.uid = Global.getUID();
    b.sum = Global.getSUM();
    b.cls = Global.getClsID();
    fetch(s,{method:'POST',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'},
    body : JSON.stringify(b)})
    .then(response=>response.json())
    .then(json=>cb(json))
    .catch(err=>{
        errcb?errcb(err):log(err);
    });    
}
export {fetchBin,fetchJson,fetchText,postJson}