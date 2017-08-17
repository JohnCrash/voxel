function yesno(title,centent,cb){
    let domElement = document.createElement('div');
    let width = 200;
    let height = 24*3;
    let top = Math.floor((window.innerHeight-height)/2);
    let left = Math.floor((window.innerWidth-width)/2);
    domElement.style=`position:fixed;top:${top}px;left:${left}px;color:white;width:${width}px;height:${height}px;background:black`;
    domElement.innerHTML = "<h2>Hello world</h2><br><h1>Titlte</h1>";
    document.body.appendChild(domElement);
}
export {yesno};