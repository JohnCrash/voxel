var browserify = require('browserify');
var fs = require('fs');
var process = require('process');

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
function build(src,des,next){
  let stream;
  stream = fs.createWriteStream(des);
  if(next){
    stream.on('close',()=>{
      next();
    });
  }
  browserify(src)
  .transform("babelify", {presets: ["es2015","es2016","es2017","react","stage-0"]})
  .transform("uglifyify",{mangle: true,global: true})
  .bundle().pipe(stream);
}
//build('src/levelindex.js','public/levelindex_compress.js');
if(process.argv[2] && process.argv[2]==='editor'){
  console.log('Compile editor...');
  build('src/editor.js','public/editor_compress.js');
}else if(process.argv[2] && process.argv[2]==='release'){
  console.log('Compile and public app...');
  build('src/index.js','public/app_compress.js',()=>{
    console.log('RELEASE..');
    //G:/tmp/voxel/
    //修改main.appcache #version + 1
    let c = spawn('git',['-jar','node_modules/google-closure-compiler/compiler.jar','--js',`${des}z`,'--js_output_file',des]);
  });  
}else{
  console.log('Compile app...');
  build('src/index.js','public/app_compress.js');
}