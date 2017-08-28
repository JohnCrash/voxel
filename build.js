var browserify = require('browserify');
var fs = require('fs');
const { spawn } = require('child_process');

function build(src,des){
  browserify(src)
  .transform("babelify", {presets: ["es2015","es2016","es2017","react","stage-0"]})
  .bundle()
  .pipe(fs.createWriteStream(`${des}z`)
  .on('close',()=>{
    let c = spawn('java',['-jar','node_modules/google-closure-compiler/compiler.jar','--js',`${des}z`,'--js_output_file',des]);
    c.stderr.on('data', (data) => {
      console.log(`${data}`);
    });
    c.stdout.on('data', (data) => {
      console.log(`${data}`);
    }); 
    c.on('close',(code)=>{
      fs.unlink(`${des}z`);
    });
  }));  
}

build('src/levelindex.js','public/levelindex_compress.js');
build('src/editor.js','public/editor_compress.js');