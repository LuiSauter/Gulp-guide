//Html
import htmlmin from 'gulp-htmlmin';
//CSS
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer'
//Javascript
import gulp from 'gulp';
import babel from 'gulp-babel';
import terser from 'gulp-terser';
//PUG
import pug from 'gulp-pug';
//SASS
// import sass from 'gulp-sass';
//nueva version para no usar import
var sass = require('gulp-sass')(require('sass'));
//Clean CSS
import clean from 'gulp-purgecss';
//Common
import concat from 'gulp-concat';
//Cache bust
import cacheBust from 'gulp-cache-bust';
//Optimization images
// import imagemin from 'gulp-imagemin';
// const imagemin = require('imagemin');


//pug
const production = true;

//Variables/constantes
const cssPlugins = [
    cssnano(),
    autoprefixer()
];

gulp.task('html-min', () => {
    return gulp
        .src('./src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(cacheBust({
            type: 'timestamp'
        }))
        .pipe(gulp.dest('./public'))
});

gulp.task('styles', () => {
    return gulp
        .src('./src/css/*.css')
        .pipe(concat('styles-min.css'))
        .pipe(postcss(cssPlugins))
        .pipe(gulp.dest('./public/css'))
});

gulp.task('babel', () => {
    return gulp
        .src('./src/js/*.js')
        .pipe(concat('scripts-min.js'))
        .pipe(babel())
        .pipe(terser())
        .pipe(gulp.dest('./public/js'))
});

gulp.task('views', () => {
    return gulp.src('./src/views/pages/*.pug')
        .pipe(pug({
            pretty: (production) ? false : true
        }))
        .pipe(cacheBust({
            type: 'timestamp'
        }))
        .pipe(gulp.dest('./public'))
});

gulp.task('sass', () => {
    return gulp.src('./src/scss/styles.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(postcss(cssPlugins))
        .pipe(gulp.dest('./public/css'))
});
gulp.task('clean', () => {
    return gulp.src('./public/css/styles.css')
        .pipe(clean({
            content: ['./public/*.html']
        }))
        .pipe(gulp.dest('./public/css'))
});

/*
gulp.task('imgmin', () => {
    //trabaja con cualquier tipo de imagen
    return gulp.src('./src/images/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
	        imagemin.mozjpeg({quality: 50, progressive: true}),
	        imagemin.optipng({optimizationLevel: 1}),
	        imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
		        ]
	        })
        ]))
        .pipe(gulp.dest('./public/images'))
});
*/

gulp.task('default', () => {
    // gulp.watch('./src/*.html', gulp.series('html-min'));
    // gulp.watch('./src/css/*.css', gulp.series('styles'));
    gulp.watch('./src/views/**/*.pug',gulp.series('views'));
    gulp.watch('./src/scss/**/*.scss',gulp.series('sass'));
    gulp.watch('./src/js/*.js', gulp.series('babel'));
});