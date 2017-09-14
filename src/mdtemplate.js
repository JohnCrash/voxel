export default function trans(txt,dict){
    let s = "";
    for(let key in dict){
        if(typeof dict[key] === "string")
            s += `let ${key} = "${dict[key]}";\n`;
        else
            s += `let ${key} = ${dict[key]};\n`;
    }
    let exestr = s+"`"+txt+"`";
    try{
        return eval(exestr);
    }catch(e){
        return e.toString();
    }
};