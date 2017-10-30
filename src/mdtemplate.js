export default function trans(txt,dict){
    let s = "";
    for(let key in dict){
        if(typeof dict[key] === "string")
            s += `var ${key} = "${dict[key]}";\n`;
        else
            s += `var ${key} = ${dict[key]};\n`;
    }
    let exestr = s+"`"+txt+"`";
    try{
        return eval(exestr);
    }catch(e){
        return e.toString();
    }
};