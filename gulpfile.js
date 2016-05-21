var gulp = require('gulp'),
		wiredep = require('wiredep').stream,
		useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
		browserSync = require('browser-sync'),
		clean = require('gulp-clean');
 
gulp.task('clean', function () {
	return gulp.src('dist', {read: false})
		.pipe(clean());
});

var sassOptions = {
  outputStyle: 'expanded'
};

gulp.task('browserSync', function() {
    browserSync({
    	server : {
    		baseDir : 'app'
    	}
    })
});

gulp.task('bower', function () {
  gulp.src('./app/**/*.jade')
    .pipe(wiredep({
      directory : "app/bower_components"
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('jade', function() {
    gulp.src('app/**/*.jade')
      .pipe(jade({
      	pretty : true
      }))
      .pipe(gulp.dest('app'))
      .pipe(browserSync.reload({
      	stream: true
      }));
});

gulp.task('sass', function() {
    gulp.src('app/style/**/*.scss')
      .pipe(sass(sassOptions))
      .pipe(gulp.dest('app/style'))
      .pipe(browserSync.reload({
      	stream: true
      }));
});

gulp.task('html', function () {
  gulp.src('app/*.html')
  	.pipe(useref())
  	.pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('dist'));
});



gulp.task('watch', function() {
    gulp.watch('app/style/**/*.scss', ['sass']);
    gulp.watch('app/**/*.jade', ['jade']);
});

gulp.task('default',['bower','sass', 'jade', 'browserSync','watch']);

gulp.task('build',['clean', 'html']);
