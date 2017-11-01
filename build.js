var browserify = require('browserify');
var fs = require('fs');
//const { spawn } = require('child_process');
//var envify = require('envify/custom');

/*
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
*/
process.env.NODE_ENV = 'production';
function build(src,des){
  browserify(src)
  .transform("babelify", {presets: ["es2015","es2016","es2017","react","stage-0"]})
  .transform("uglifyify",{mangle: true,global: true})
  .bundle().pipe(fs.createWriteStream(des));
}
//build('src/levelindex.js','public/levelindex_compress.js');
//build('src/editor.js','public/editor_compress.js');
build('src/app.js','public/app_compress.js');