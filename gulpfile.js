const { src, dest, watch, parallel, series } = require('gulp');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const sync = require('browser-sync').create();

function copy(cb) {
  src('src/static/**').pipe(dest('public/assets/static'));
  cb();
}

function generateCSS(cb) {
  src('src/styles/tailwind.css')
    .pipe(postcss([require('tailwindcss')]))
    .pipe(dest('public/assets'))
    .pipe(sync.stream());
  cb();
}

function generateJS(cb) {
  src('src/js/index.js')
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/assets'));
  sync.reload();
  cb();
}

function watchFiles(cb) {
  watch('src/static/**', copy);
  watch('src/styles/**', generateCSS);
  watch('src/js/**', generateJS);
  watch('./public/**.html').on('change', sync.reload);
}

function browserSync(cb) {
  sync.init({
    server: {
      baseDir: './public',
    },
  });
  watchFiles();
}

exports.sync = browserSync;
exports.watch = watchFiles;
exports.css = generateCSS;
exports.copy = copy;

// Default Task
exports.default = series(parallel(generateCSS, generateJS, copy), browserSync);
