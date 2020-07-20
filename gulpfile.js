const { src, dest, watch } = require('gulp');
const postcss = require('gulp-postcss');
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

function watchFiles(cb) {
  watch('src/static/**', copy);
  watch('src/styles/**', generateCSS);
}

function browserSync(cb) {
  sync.init({
    server: {
      baseDir: './public',
    },
  });

  watch('src/static/**', copy);
  watch('src/styles/**', generateCSS);
  watch('./public/**.html').on('change', sync.reload);
}

exports.sync = browserSync;
exports.watch = watchFiles;
exports.css = generateCSS;
exports.copy = copy;
