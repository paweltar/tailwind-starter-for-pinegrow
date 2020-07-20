const { src, dest, watch } = require('gulp');
const postcss = require('gulp-postcss');

function copy(cb) {
  src('src/static/**').pipe(dest('public/assets/static'));
  cb();
}

function generateCSS(cb) {
  src('src/styles/tailwind.css')
    .pipe(postcss([require('tailwindcss')]))
    .pipe(dest('public/assets'));
  cb();
}

function watchFiles(cb) {
  watch('src/static/**', copy);
  watch('src/styles/**', generateCSS);
}

exports.watch = watchFiles;
exports.css = generateCSS;
exports.copy = copy;
