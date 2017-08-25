var browserify = require('browserify');
var fs = require('fs');

browserify('src/levelindex.js')
.transform("babelify", {presets: ["es2015","es2016","es2017","react","stage-0"]})
.bundle()
.pipe(fs.createWriteStream('public/levelindex.js'));

browserify('src/editor.js')
.transform("babelify", {presets: ["es2015","es2016","es2017","react","stage-0"]})
.bundle()
.pipe(fs.createWriteStream('public/editor.js'));  
