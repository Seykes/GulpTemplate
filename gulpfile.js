const gulp = require('gulp'),
      browsersync = require('browser-sync').create(),
      fileInclude = require('gulp-file-include'),
      del = require('del'),
      sass = require('gulp-sass')
      autoprefixer = require('gulp-autoprefixer')
      gcmq = require('gulp-group-css-media-queries');
      cleanCSS = require('gulp-clean-css');
      rename = require('gulp-rename')
      uglify = require('gulp-uglify-es').default;
      babel = require('gulp-babel');


const prod_folder = 'dist'
const source_folder = 'src'

const path = {
  build: {
    html: prod_folder + '/',
    css: prod_folder + '/css',
    js: prod_folder + '/js',
    img: prod_folder + '/img',
    fonts: prod_folder + '/fonts'
  },
  src: {
    html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
    css: source_folder + '/sass/style.sass',
    js: source_folder + '/js/script.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: source_folder + '/fonts/*'
  },
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/sass/**/*.sass',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
  },
  clean: './' + prod_folder + '/'
}

function browserSync() {
  browsersync.init({
    server: {
      baseDir: './' + prod_folder + '/'
    },
    notify: false
  });
}

function images() {
  return gulp.src(path.src.img)
    .pipe(gulp.dest(path.build.img))
}

function fonts() {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
}

function css() {
  return gulp.src(path.src.css)
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gcmq())
    .pipe(autoprefixer({
      overrideBrowserslist:  ['last 5 versions'],
      cascade: true
    }))
    .pipe(gulp.dest(path.build.css))
    .pipe(cleanCSS())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(path.build.css))
    .pipe(browsersync.stream())
}

function html() {
  return gulp.src(path.src.html)
    .pipe(fileInclude())
    .pipe(gulp.dest(path.build.html))
    .pipe(browsersync.stream())
}

function watchFiles() {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.src.css], css)
  gulp.watch([path.src.js], js)
  gulp.watch([path.src.img], images)
}

function clean() {
  return del(path.clean)
}

function js() {
  return gulp.src(path.src.js)
    .pipe(fileInclude())
    .pipe(gulp.dest(path.build.js))
    .pipe(uglify())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(path.build.js))
    .pipe(browsersync.stream())
}

const build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts))
const watch = gulp.parallel(build, watchFiles, browserSync)

exports.fonts = fonts
exports.images = images
exports.js = js
exports.css = css
exports.html = html
exports.build = build
exports.watch = watch
exports.default = watch
