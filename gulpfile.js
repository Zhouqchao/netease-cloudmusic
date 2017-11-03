var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');

//添加兼容性前缀，压缩css
gulp.task('handleCSS',function(){
	gulp.src('./src/css/*.css')
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(gulp.dest('./dist/css/'));
})