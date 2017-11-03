var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');

//压缩图片
gulp.task('minImage',function(){
	gulp.src('./src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/images'));
})

//添加兼容性前缀，压缩css
gulp.task('handleCSS',function(){

    gulp.src('./src/css/*.css')
        .pipe(autoprefixer({
        	browsers:['last 2 versions'],
        	cascade:false
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/css'));
})

//压缩html
gulp.task('minifyHTML',function(){
	gulp.src('./dist/*.html')
		.pipe(htmlmin({collapseWhitespace:true}))
		.pipe(gulp.dest('./dist'));
})


gulp.task('default',['minImage','handleCSS','minifyHTML']);