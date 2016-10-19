var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('compile', function () {
    return gulp.src('./src/**')
        .pipe(zip('extension.zip'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['compile']);
