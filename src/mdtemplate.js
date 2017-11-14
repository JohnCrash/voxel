export default function trans(txt,dict){
    let s = "";
    for(let key in dict){
        if(typeof dict[key] === "string")
            s += `var ${key} = "${dict[key]}";\n`;
        else
            s += `var ${key} = ${dict[key]};\n`;
    }
    let exestr = s+txt;
    try{
        //console.log(exestr);
        let r =  eval(exestr);
        //console.log(r);
        return r;
    }catch(e){
        //console.log('error : '+e);
        return e.toString();
    }
};