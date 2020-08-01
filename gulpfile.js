const { src, dest, watch, parallel, series } = require('gulp');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const sync = require('browser-sync').create();

// Copy all files from src/static to public/assets/static.
function copy(cb) {
  src('src/static/**').pipe(dest('public/assets/static'));
  cb();
}

// Process Tailwind CSS file, output it to public/assets and reload browser.
function generateCSS(cb) {
  src('src/styles/tailwind.css')
    .pipe(postcss([require('tailwindcss')]))
    .pipe(dest('public/assets'))
    .pipe(sync.stream());
  cb();
}

// Process JS, generate sourcemap, output it to public/assets and reload browser.
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

// Watch for any changes in directories listed below and when change is detected - run relevant task. Reload browser always when the HTML file inside 'public' folder changes.
function watchFiles(cb) {
  watch('src/static/**', copy);
  watch('src/styles/**', generateCSS);
  watch('src/js/**', generateJS);
  watch('./public/**.html').on('change', sync.reload);
}

// Serve files from 'public' folder.
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

// Default Task - type "gulp" in terminal to run it.
exports.default = series(parallel(generateCSS, generateJS, copy), browserSync);

// Build Task for Netlify
exports.build = parallel(generateCSS, generateJS, copy);
