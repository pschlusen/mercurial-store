require('dotenv').config()
var gulp = require('gulp')
var sass = require('gulp-sass')
const log = require('gutil-color-log')
var path = require('path')
var fs = require('fs');
var emoji = require('node-emoji')

const MODIFIED_PATH = __dirname + process.env.MODIFIED_PATH
sass.compiler = require('sass')
 
gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./src/css'))
});
 
gulp.task('watch', function () {
  gulp.watch('./src/sass/**/*.scss', gulp.task('sass')).on('change', function(file){
    fs.readFile(MODIFIED_PATH, (err, data) => {
      if (!err)
        if( data && data.toString().indexOf(file) < 0 )
          fs.appendFile(MODIFIED_PATH, `${path.join(__dirname, file)}\r\n`, (err) => {
            !err && log('green', `${emoji.get(':fast_forward:')} File '${file}' queued on modifieds`) 
          })
    })
  })
});