const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const webpack = require('webpack-stream');
const webpack2 = require('webpack');
const zip = require('gulp-zip');

gulp.task('compile', () => {
  return gulp.src('./src/**')
    .pipe(zip('extension.zip'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('css', ['css:vendor', 'css:app']);

gulp.task('css:vendor', () => {
  return gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.min.css'
  ])
    .pipe(concat('vendor.css'))
    .pipe(cleanCSS({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('./src/css'));
});

gulp.task('css:app', () => {
  return gulp.src('./assets/scss/app.scss')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest('./src/css'));
});

gulp.task('js', ['js:vendor', 'js:app']);

gulp.task('js:vendor', () => {
  return gulp.src([
    './node_modules/bootstrap.native/lib/utils.js',
    './node_modules/bootstrap.native/lib/tooltip-native.js',
    './node_modules/moment/min/moment.min.js',
    './node_modules/moment/locale/ru.js'
  ])
    .pipe(concat('vendor.min.js'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(gulp.dest('./src/js'));
});

gulp.task('js:app', () => {
  return gulp.src('./assets/js/main.js')
    .pipe(webpack({
      module: {
        rules: [
          {
            test: /\.vue$/,
            use: 'vue-loader'
          },
          {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
          },
        ]
      },
    }, webpack2))
    .pipe(uglify())
    .pipe(rename({
      basename: 'popup',
      suffix: '.min'
    }))
    .pipe(gulp.dest('./src/js'));
});

gulp.task('fonts', ['fonts:vendor']);

gulp.task('fonts:vendor', () => {
  return gulp.src([
    './node_modules/bootstrap/dist/fonts/**'
  ])
    .pipe(gulp.dest('./src/fonts'));
});

gulp.task('default', ['css', 'js', 'fonts', 'compile']);

gulp.task('watch', () => {
  gulp.watch('./assets/scss/**/*.scss', ['css:app']);
  gulp.watch(['./assets/js/**/*.js', './assets/js/**/*.vue'], ['js:app']);
});
