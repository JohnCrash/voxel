require("whatwg-fetch");
import log from './log';

function fetchBin(s,cb,errcb){
    fetch(s)
    .then(response=>response.arrayBuffer())
    .then(data=>cb(data))
    .catch(err=>{
        errcb?errcb(err):log(err);
    });
}

function fetchJson(s,cb,errcb){
    fetch(s)
    .then(response=>response.json())
    .then(json=>cb(json))
    .catch(err=>{
        errcb?errcb(err):log(err);
    });
}

function fetchText(s,cb,errcb){
    fetch(s)
    .then(response=>response.text())
    .then(text=>cb(text))
    .catch(err=>{
        errcb?errcb(err):log(err);
    });
}

function postJson(s,b,cb,errcb){
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