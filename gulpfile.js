const { src, dest, watch, series } = require('gulp')

const pug = require('gulp-pug')
const sass = require('gulp-sass')(require('sass'))
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create()


// Compile pug files into HTML
function html() {
  return src('src/pug/*.pug')
    .pipe(pug())
    .pipe(dest('dist'))
}

// Compile sass files into CSS
function styles() {
  return src('src/sass/main.sass')
    .pipe(sass({
      includePaths: ['src/sass'],
      errLogToConsole: true,
      outputStyle: 'compressed',
      onError: browserSync.notify
    }))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
}

// JS

function scripts() {
  return src('src/js/**/*')
    .pipe(babel())
    .pipe(dest('dist/js'))
}

// Copy assets
function assets() {
  return src('src/assets/**/*')
    .pipe(dest('dist/'))
}

// Serve and watch sass/pug files for changes
function watchAndServe() {
  browserSync.init({
    server: 'dist',
  })

  watch('src/sass/**/*.sass', styles)
  watch('src/pug/*.pug', html)
  watch('src/js/*.js', scripts)
  watch('src/assets/**/*', assets)
  watch('dist/*.html').on('change', browserSync.reload)
  watch('dist/css/*.css').on('change', browserSync.reload)
  watch('dist/js/*.js').on('change', browserSync.reload)
}


exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.watch = watchAndServe
exports.default = series(html, styles, assets, scripts, watchAndServe)
