require('es6-promise').polyfill();
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer')
var electron = require('electron-connect').server.create();


gulp.task('start', function () {
  // Start browser process
  electron.start();
});

gulp.task('sass', function () {
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

gulp.task('copyjs', function() {
  // move over js
  gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('build/js'))
});

gulp.task('default', ['sass', 'copyjs', 'copyfonts', 'start']);

gulp.task('watch', function() {
  // Restart browser process
  gulp.watch('main.js', electron.reload);
  // Reload renderer process
  gulp.watch(['src/js/**/*.js'], ['copyjs', electron.reload]);
  // gulp watch for stylus changes
  gulp.watch('src/scss/**/*.scss', ['sass', electron.reload]);
});

gulp.task('dev', ['default', 'watch']);
