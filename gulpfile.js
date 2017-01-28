const gulp = require('gulp');
const zip = require('gulp-zip');
const babel = require('gulp-babel');
const uglify = require('gulp-uglifyjs');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

gulp.task('compile', () => {
    return gulp.src('./src/**')
        .pipe(zip('extension.zip'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('js', ['js:vendor', 'js:popup']);

gulp.task('js:vendor', () => {
    return gulp.src([
        './node_modules/bootstrap.native/lib/utils.js',
        './node_modules/bootstrap.native/lib/tooltip-native.js',
        './node_modules/moment/min/moment.min.js',
        './node_modules/moment/locale/ru.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./src/js'));
});

gulp.task('js:popup', () => {
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

gulp.task('watch', () => {
    gulp.watch('./assets/js/popup.js', ['js']);
});
