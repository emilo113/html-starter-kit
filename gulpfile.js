var gulp = require('gulp');

//plugins
var sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    runSequence = require('run-sequence');


//paths
var paths = {
    sassIn: 'app/scss/**/*.+(scss|sass)',
    sassOut: 'app/css',
    htmlIn: 'app/**/*.html',
    scriptsIn: 'app/scripts/**/*.js',
    imagesIn: 'app/images/**/*.+(png|jpg|jpeg|gif|svg)',
    imagesOut: 'dist/images',
    fontsIn: 'app/fonts/**/*',
    fontsOut: 'dist/fonts',
    dist: 'dist'
};

//default task
gulp.task('default', function(callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback);
});

//build project
gulp.task('build', function(callback){
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
});


gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
});

gulp.task('sass', function() {
   return gulp.src(paths.sassIn)
       .pipe(sass())
       .on('error', function(error) {
           console.log(error.toString());
           this.emit('end');
       })
       .pipe(gulp.dest(paths.sassOut))
       .pipe(browserSync.reload({
           stream: true
       }))
});

gulp.task('useref', function() {
    return gulp.src(paths.htmlIn)
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssnano()))
        .pipe(gulp.dest(paths.dist))
});

gulp.task('images', function() {
    return gulp.src(paths.imagesIn)
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(paths.imagesOut))
});

gulp.task('fonts', function() {
    return gulp.src(paths.fontsIn)
        .pipe(gulp.dest(paths.fontsOut))
});

gulp.task('watch', ['browserSync', 'sass'], function(){
   gulp.watch(paths.sassIn, ['sass']);
   gulp.watch(paths.htmlIn, browserSync.reload);
   gulp.watch(paths.scriptsIn, browserSync.reload);
});

gulp.task('clean:dist', function() {
    return del.sync(paths.dist);
});

gulp.task('cache:clear', function() {
   return cache.clearAll();
});