require('es6-promise').polyfill();
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var fs = require('fs')
var autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename')
// const electron = require('electron');
const electron = require('electron-connect').server.create();

var concat = require("gulp-concat");
var babel = require("gulp-babel");

var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('start', function () {
  // Start browser process
  electron.start();
});

gulp.task('scss', function () {
 return gulp.src('src/scss/**/*.scss')
  .pipe(sourcemaps.init())
  // .pipe(sass().on('error', sass.logError))
  .pipe(sass().on('error', handleErrors))
  .pipe(sourcemaps.write())
  .pipe(autoprefixer())
  .pipe(gulp.dest('build/css'));
  electron.reload;
  // .pipe(reload({stream:true}))
});

gulp.task('copyfonts', function() {
  // move over fonts
  gulp.src('src/fonts/**/*.{txt,ttf,woff,eof,eot,svg,js}')
    .pipe(gulp.dest('build/fonts'))
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
  // // run it once the first time buildScript is called
    const b1 = browserify("./src/js/index.js")
      .transform("babelify", {presets: ["es2015", "react"]})
      .bundle()
      .on('error', handleErrors)
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(gulp.dest('build/js'))
      // .pipe(rename('index.js'))
      // .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        // .pipe(uglify())
      // .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('build/js'))
}

gulp.task('scripts', function() {
  return buildScript('index.js', false); // this will run once because we set watch to false
});

gulp.task('scripts-watch', function() {
  return buildScript('index.js', true);
});

// gulp.task('scripts', function() {
//
//   return gulp.src("src/js/**/*.js")
//     .pipe(sourcemaps.init())
//     .pipe(babel())
//     // .pipe(rename('main.js'))``
//     // .pipe(concat("main.js"))
//     .pipe(sourcemaps.write("."))
//     .pipe(gulp.dest("build/js"));
// });

gulp.task('default', ['scss', 'scripts', 'copyfonts', 'start'], function() {
  gulp.watch('src/scss/**/*.scss', ['scss', electron.reload])
});


gulp.task('dev', ['default']);
