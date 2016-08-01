require('es6-promise').polyfill();
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer')
var electron = require('electron-connect').server.create();
var concat = require("gulp-concat");
var babel = require("gulp-babel");

gulp.task('start', function () {
  // Start browser process
  electron.start();
});

gulp.task('scss', function () {
 return gulp.src('src/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
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

gulp.task('scripts', function() {

  return gulp.src("src/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['react', 'es2015']
    }))
    .pipe(concat("main.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("build/js"));
});

gulp.task('default', ['scss', 'scripts', 'copyfonts', 'start']);

gulp.task('watch', function() {
  // Restart browser process
  gulp.watch('main.js', electron.reload);
  // Reload renderer process
  gulp.watch(['src/js/**/*.js'], ['scripts', electron.reload]);
  // gulp watch for stylus changes
  gulp.watch('src/scss/**/*.scss', ['scss', electron.reload]);
});

gulp.task('dev', ['default', 'watch']);
