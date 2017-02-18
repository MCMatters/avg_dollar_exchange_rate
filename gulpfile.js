const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const rename = require('gulp-rename');
const runSequence = require('run-sequence').use(gulp);
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const webpack = require('webpack-stream');
const webpack2 = require('webpack');
const zip = require('gulp-zip');

gulp.task('clean', () => {
  return del.sync(['./src/css/**.css', './src/js/**.js'])
});

gulp.task('compile', () => {
  return gulp.src('./src/**')
    .pipe(zip('extension.zip'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('css', ['css:vendor', 'css:app']);

gulp.task('css:vendor', () => {
  return gulp.src([
    './assets/vendor/bootstrap/css/bootstrap.min.css',
    './node_modules/balloon-css/balloon.min.css'
  ])
    .pipe(concat('vendor.css'))
    .pipe(cleanCSS({
      level: {
        1: {
          specialComments: 0
        }
      }
    }))
    .pipe(gulp.dest('./src/css'));
});

gulp.task('css:app', () => {
  return gulp.src('./assets/scss/app.scss')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest('./src/css'));
});

gulp.task('js', () => {
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
      plugins: [
        new webpack2.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        })
      ]
    }, webpack2))
    .pipe(uglify())
    .pipe(rename({
      basename: 'app',
      suffix: '.min'
    }))
    .pipe(gulp.dest('./src/js'));
});

gulp.task('default', (cb) => {
  runSequence('clean', 'css', 'js', 'compile', cb);
});

gulp.task('watch', () => {
  gulp.watch('./assets/scss/**/*.scss', ['css:app']);
  gulp.watch(['./assets/js/**/*.js', './assets/js/**/*.vue'], ['js:app']);
});
