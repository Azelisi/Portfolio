const { src, dest, watch, parallel, series } = require('gulp');


const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const clean = require('gulp-clean');



const scripts = () => {
    return src(['app/js/main.js'])
        .pipe(webpackStream(webpackConfig))
        .pipe(dest('dist/js'))
};

function styles() {
    return src('app/sсss/style.scss')
        .pipe(autoprefixer({ overrideBrowserlist: ['last 10 version'] }))
        .pipe(concat('style.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

function images() {
    return src('app/img/**/*')
        .pipe(dest('dist/img'));
}



function watching() {
    watch(['app/scss/style.scss'], styles);
    watch(['app/js/main.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function cleanDist() {
    return src('dist')
        .pipe(clean());
}

function building() {
    return src([
        'app/**/*.css',
        'app/**/*.js',
        'app/**/*.html'
    ], { base: 'app' })
        .pipe(dest('dist'));
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(cleanDist, parallel(images, styles, scripts,), building);
exports.default = parallel(styles, scripts, browsersync, watching);