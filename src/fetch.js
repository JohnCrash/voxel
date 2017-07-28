var fetch = require("whatwg-fetch");

function defaultErrorHandle(err){
    console.log(err);
}

export default {
    fetchBin: function(s,cb,errcb){
        fetch(s)
        .then(response=>response.arrayBuffer())
        .then(data=>cb(data))
        .catch(err=>{
            errcb?errcb(err):defaultErrorHandle(err);
        });
    },
    fetchJson: function(s,cb,errcb){
        fetch(s)
        .then(response=>response.json())
        .then(json=>cb(json))
        .catch(err=>{
            errcb?errcb(err):defaultErrorHandle(err);
        });
    },
    fetchText: function(s,cb,errcb){
        fetch(s)
        .then(response=>response.text())
        .then(text=>cb(text))
        .catch(err=>{
            errcb?errcb(err):defaultErrorHandle(err);
        });
    }       
};