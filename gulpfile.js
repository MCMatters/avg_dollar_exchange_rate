const gulp = require('gulp');
const zip = require('gulp-zip');
const babel = require('gulp-babel');
const uglify = require('gulp-uglifyjs');
const rename = require('gulp-rename');

gulp.task('compile', function () {
    return gulp.src('./src/**')
        .pipe(zip('extension.zip'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('js', function () {
    return gulp.src('./assets/js/popup.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./src/js'));
});

gulp.task('default', ['js', 'compile']);
