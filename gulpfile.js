var gulp = require('gulp'),
    sass = require('gulp-sass'),
    webpackStream = require('webpack-stream'),
    webpack = require('webpack'),
    gulp = require('gulp'),
    browserSync = require('browser-sync').create();


///// Production /////
var uglify = require('gulp-uglify'),
    pump = require('pump'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin');


///// Settings /////
var src = './src';
var static = './static';
var dist = './dist';


gulp.task('generate-service-worker', function(callback) {
  var swPrecache = require('sw-precache');
  var rootDir = dist;

  swPrecache.write(`${rootDir}/service-worker.js`, {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'],
    stripPrefix: rootDir
  }, callback);
});


gulp.task('staticTransporter', function() {  
  gulp.src('./static/**/*')
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({
      stream: true
    }));
});


gulp.task('transportHTML', function() {
  gulp.src(src + '/*.html')
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({
      stream: true
    }));
});


gulp.task('transportContent', function() {
  gulp.src('./content/**/*')
    .pipe(gulp.dest(dist + '/content'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


gulp.task('prodTransportStatic', function() {
  gulp.src('./static/**/*')
    .pipe(gulp.dest(dist))
});


gulp.task('compileSass', function () {
  return gulp.src(src + '/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dist + '/styles'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


gulp.task('compileJS', function() {
    return gulp.src(src + '/index.js')
    .pipe(webpackStream({
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          }
        ],
      },
      output: {
        filename: 'index.js',
      }
    }, webpack))
    .pipe(gulp.dest(dist + '/scripts'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


///// Live reload //////
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: dist
    },
    open: "external"
  })
});

gulp.task('minifyJSStatic', function (cb) {
  pump([
        gulp.src('./static/scripts/*.js'),
        uglify(),
        gulp.dest(dist + '/scripts')
    ],
    cb
  );
});


gulp.task('minifyJS', ['compileJS', 'minifyJSStatic'], function (cb) {
  pump([
        gulp.src('./static/scripts/*.js'),
        uglify(),
        gulp.dest(dist + '/scripts')
    ],
    cb
  );
});


gulp.task('minifyCSS', ['compileSass', 'setPrefixes', 'prodTransportStatic'], function () {
  return gulp.src(dist + '/styles/**/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest(dist + '/styles'));
});


gulp.task('setPrefixes', function(){
  return gulp.src(dist + '/styles/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(dist + '/styles'));
});


gulp.task('minifyHTML', ['transportHTML'], function() {
  return gulp.src(dist + '/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(dist));
});


///// Watch /////
gulp.task('default', [
                      'transportContent',
                      'transportHTML',
                      'prodTransportStatic',
                      'browserSync',
                      'compileSass',
                      'compileJS',
                      ],
  function() {
    gulp.watch([src + '/**/*.html'], ['transportHTML']);
    gulp.watch(['content/**/*'], ['transportContent']);
    gulp.watch([static + '/**/*.*'], ['staticTransporter']);
    gulp.watch([src + '/**/*.scss', 'src/index.scss'], ['compileSass']);
    gulp.watch([src + '/**/*.js', 'src/index.js'], ['compileJS']);
});


///// Production & Netlify /////
gulp.task('prod', [
                    'prodTransportStatic',
                    'transportContent',
                    'transportHTML',
                    'minifyCSS',
                    'minifyHTML',
                    'minifyJS'
                  ]);