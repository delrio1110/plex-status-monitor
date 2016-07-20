require('es6-promise').polyfill();
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer')
var electron = require('electron-connect').server.create();


gulp.task('start', function () {
  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('main.js', electron.restart);

  // Reload renderer process
  gulp.watch(['src/js/app.js', 'index.html'], electron.reload);
});

gulp.task('sass', function () {
 return gulp.src('src/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(autoprefixer())
  .pipe(gulp.dest('build/css'))
  // .pipe(reload({stream:true}))

});

// gulp.task('sass:watch', function () {
//   gulp.watch('.src/scss/**/*.scss', ['sass']);
// });

gulp.task('copyfonts',function() {
  // move over fonts
  gulp.src('src/fonts/**/*.{txt,ttf,woff,eof,eot,svg}')
    .pipe(gulp.dest('build/fonts'))
});

gulp.task('default', ['sass', 'copyfonts', 'start']);

gulp.task('watch', function() {
  // Restart browser process
  gulp.watch('main.js', electron.restart);

  // Reload renderer process
  gulp.watch(['src/js/app.js', 'index.html'], electron.reload);

  // gulp watch for stylus changes
  gulp.watch('src/scss/**/*.scss', ['sass', electron.reload]);

});

gulp.task('dev', ['default', 'watch']);
