'use strict';

const gulp = require('gulp');

// --------------------------------------------------------------------
// Plugins
// --------------------------------------------------------------------
const env = process.env.NODE_ENV || 'development';

const path        = require('path');
const fs          = require('fs');
const es          = require('event-stream');

const processEnv  = require('gulp-env');
const debug       = require('gulp-debug');
const watch 			= require('gulp-watch');
const plumber     = require('gulp-plumber');
const notify      = require('gulp-notify');
const changed 		= require('gulp-changed');
const loopback    = require('gulp-loopback-sdk-angular');

// Run sass alongside burbon (fastest way of sass compiling)
const sass        = require('gulp-sass');
const neat        = require('node-neat').includePaths;

// JS/CSS Injection Related Files
const inject      = require('gulp-inject');
const bowerFiles  = require('main-bower-files');
const angularSort = require('gulp-angular-filesort');

// Live Reload Enabled
const livereload  = require('gulp-livereload');

// --------------------------------------------------------------------
// BUILD PLUGINS
// --------------------------------------------------------------------

const concat      = require('gulp-concat');
const del 				= require('del');

//JS Modules
const uglify      = require('gulp-uglify');
const cssmin      = require('gulp-cssmin');
const sourcemaps  = require('gulp-sourcemaps');
const ngAnnotate  = require('gulp-ng-annotate');
const babel       = require('gulp-babel');

//HTML Modules
const htmlmin     = require('gulp-htmlmin');
const rename      = require('gulp-rename');

// --------------------------------------------------------------------
// Error Handler
// --------------------------------------------------------------------

//The title and icon that will be used for the gulp notifications
const onError = function(err) {
  console.log(err);
};

// --------------------------------------------------------------------
// Gulp config
// --------------------------------------------------------------------

const sourcePath = __dirname + '/client/src/';
const vendorPath = `${sourcePath}vendor/`;

const bowerOptions = {
  paths: {
    bowerDirectory: vendorPath,
    bowerrc: __dirname + '/.bowerrc',
    bowerJson: __dirname + '/bower.json'
  },
  overrides: {
    'angular-ui-router-anim-in-out': {
      main: 'anim-in-out.js'
    },
    'clappr': {
      main: 'dist/clappr.min.js'
    },
    'raven-js': {
      main: [
        'dist/raven.js', 
        'dist/plugins/angular.js'
      ]
    },
    'trackpad-scroll-emulator': {
      main: [
        'css/trackpad-scroll-emulator.css',
        'jquery.trackpad-scroll-emulator.min.js'
      ]
    }
  }
};

const config = {
  inject: {
    target: sourcePath + 'index.html',
    sources: {
      app: {
        css: [
          sourcePath + 'css/**/*.css',
          sourcePath + 'app/**/*.css'
        ],
        js: [
          sourcePath + 'app/**/*.js'
        ]
      }
    }
  },
  sass: {
    target: sourcePath + 'css',
    partials: sourcePath + 'css/scss/partials/*.scss',
    source: [
      sourcePath + 'css/scss/*.scss',
      sourcePath + 'css/*.scss',
      sourcePath + 'css/scss/partials/*.scss',
      sourcePath + 'app/**/*.scss',
      sourcePath + 'app/**/**/*.scss',
      sourcePath + 'app/**/**/**/*.scss'
    ]
  }
};

// --------------------------------------------------------------------
// BUILD Options
// --------------------------------------------------------------------

const destPath  = __dirname + '/client/dist/';
const destIndex = destPath + 'index.html';
const buildDate = (new Date()).getTime();

let buildId = parseInt(buildDate/10000);
buildId = '' + buildId;
buildId = buildId.substring(2);
buildId = env.substring(0, 4) + '-' + buildId;

const build = {
  css: [
    sourcePath + 'css/**/*.css',
    sourcePath + 'app/**/*.css'
  ],
  js: [
    sourcePath + 'app/**/*.js'
  ],
  html: [
    sourcePath + 'app/**/*.html'
  ],
  images: [
    sourcePath + 'images/**/*.*'
  ],
  assets: [
    sourcePath + 'fonts/**/*.*'
  ]
};

const dest = {
  imagesPath: destPath + 'images/',
  assetsPath: destPath + 'fonts/',
  cssPath: destPath + 'css/',
  cssVendorFile: 'vendor.min.css',
  cssFile: 'app.min.css',
  jsPath: destPath + 'app/',
  jsVendorFile: 'vendor.min.js',
  jsFile: 'app.min.js',
  htmlPath: destPath + 'app',
  mapPath: destPath + 'maps/'
};

const htmlOpts = {
  collapseWhitespace: true
};

const jsOpts = {
  mangle: false,
  preserveComments: 'all'
};

const cacheOpts = {
  type: 'timestamp'
};

let buildJSOptions  = JSON.parse(JSON.stringify(bowerOptions));
let buildCSSOptions = JSON.parse(JSON.stringify(bowerOptions));

buildJSOptions.filter  = /\.js$/i;
buildCSSOptions.filter = /\.css$/i;

let bowerJS  = bowerFiles(buildJSOptions);
let bowerCSS = bowerFiles(buildCSSOptions);

// --------------------------------------------------------------------
// BUILD Tasks
// --------------------------------------------------------------------

gulp.task('build', function() {
  //if (env === 'development')
    //return true;

  return gulp.start('build:inject')
    .on('end', () => {
      setTimeout(() => {
        process.exit();
      }, 2000);
    });
});

gulp.task('build:inject', ['build:clean', 'move:index', 'build:js', 'build:css'], function(){
  return gulp.src(destIndex)
    .pipe(inject(
      gulp.src([dest.cssPath + 'app.min.*', dest.jsPath + 'app.min.*'], {read: false}),
      {relative: true}
    ))
    .pipe(inject(
      gulp.src([dest.cssPath + 'vendor.min.*', dest.jsPath + 'vendor.min.*'], {read: false}),
      {name: 'bower', relative: true}
    ))
    .pipe(gulp.dest(destPath));
});

gulp.task('build:clean', function() {
  return del([
    dest.cssPath + '*.css',
    dest.jsPath  + '*.js',
    dest.mapPath + '*.map'
  ]);
});

gulp.task('build:css', ['build:css:vendor', 'build:css:app']);

gulp.task('build:css:vendor', function(){
  return gulp.src(bowerCSS)
    .pipe(plumber(onError))
    .pipe(concat(dest.cssVendorFile))
    .pipe(cssmin())
    .pipe(rename(function (path) {
      path.basename += '.' + buildId;
    }))
    .pipe(gulp.dest(dest.cssPath));
});

gulp.task('build:css:app', function() {

  return gulp.src(config.sass.source)
    .pipe(plumber(onError))
    .pipe(sass(
      { includePaths: ['styles'].concat(neat) }
    ))
    .pipe(concat(dest.cssFile))
    .pipe(cssmin())
    .pipe(rename(function (path) {
      path.basename += '.' + buildId;
    }))
    .pipe(gulp.dest(dest.cssPath));
});

gulp.task('build:js', ['build:js:vendor', 'build:js:app']);

gulp.task('build:js:vendor', function() {

  var vendorJs = bowerJS.filter(function(file) {
    return file.indexOf('.js') > -1;
  });

  return gulp.src(vendorJs)
    .pipe(plumber(onError))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat(dest.jsVendorFile))
    .pipe(rename(function (path) {
      path.basename += '.' + buildId;
    }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(dest.jsPath));
});

gulp.task('build:js:app', function(){

  return gulp.src(build.js)
    .pipe(plumber(onError))
    .pipe(sourcemaps.init())
    .pipe(babel({presets: ['es2015']}))     
    .pipe(angularSort())
    .pipe(ngAnnotate())    
    //.pipe(uglify(jsOpts))
    .pipe(concat(dest.jsFile))
    .pipe(rename(function (path) {
      path.basename += '.' + buildId;
    }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(dest.jsPath));
});

gulp.task('build:js:lbservices', function() {
  const envs = processEnv.set({
    DEEPSTREAM_OFF: 'true'
  });

  return gulp.src('./server/server.js')
    .pipe(envs)
    .pipe(loopback())
    .pipe(envs.reset)
    .pipe(rename('lb-services.js'))
    .pipe(gulp.dest('./client/src/app/core'));
});

gulp.task('lbservices', ['build:js:lbservices'], function(cb) {
  setTimeout(() => {
    cb();
    process.exit();
  }, 2000);
});

gulp.task('move:index', ['move:angular', 'move:images', 'move:fonts'], function(){
  return gulp.src(config.inject.target)
    .pipe(gulp.dest(destPath));
});

gulp.task('move:images', function(){
  return gulp.src(build.images)
    .pipe(gulp.dest(dest.imagesPath));
});

gulp.task('move:fonts', function() {
  return gulp.src(build.assets)
    .pipe(gulp.dest(dest.assetsPath));
});

gulp.task('move:angular', function(){
  return gulp.src(build.html)
    .pipe(htmlmin(htmlOpts))
    .pipe(gulp.dest(dest.htmlPath));
});

// --------------------------------------------------------------------
// Development Tasks
// --------------------------------------------------------------------

//Default gulp task for dev purposes
gulp.task('default', ['watch', 'inject', 'sass']);

//Injects all css/js files into our index.html src file
gulp.task('inject', function () {

  return gulp.src(config.inject.target)
    .pipe(plumber(onError))
    .pipe(inject(
      gulp.src(bowerFiles(bowerOptions), {read: false}),
      {name: 'bower', relative: true}
    ))
    .pipe(inject(
      es.merge(
        gulp.src(config.inject.sources.app.css),
        gulp.src(config.inject.sources.app.js)
          .pipe(babel({presets: ['es2015']}))
          .pipe(angularSort())
      ),
      {relative: true}
    ))
    .pipe(gulp.dest(sourcePath));
});

//Builds our sass with burbon/neat
gulp.task('sass', function() {
  return gulp.src(config.sass.source)
    .pipe(plumber(onError))
    .pipe(sass(
      { includePaths: ['styles'].concat(neat) }
    ))
    .pipe(gulp.dest(config.sass.target))
    .on('error', function (err) {
      
      // Allows sass to continue watch tasks even after an error
      this.emit('end');
    });
});

//Watches for changes in files that should be streamed/compiled to browser
gulp.task('watch', function() {

  livereload.listen();

  //We only want to inject files when files are added/deleted, not changed.
  var options = {events: ['add', 'unlink']};
  var injectFn = function() {
    return gulp.start('inject');
  };

  watch(
    config.sass.source,
    function(){
      return gulp.start('sass');
    }
  );

  //Watch for changes in app related JS files and live reload them
  watch(
    build.js,
    function(){
      return gulp.start('reload-js');
    }
  );

  // Watch for changes in html files and reload them
  watch(
    build.html,
    function(){
      return gulp.start('reload-html');
    }
  );

  // Watch for changes in html files and reload them
  watch(
    build.css,
    function(){
      return gulp.start('reload-css');
    }
  );


  //Watch for changes in app related files and inject new ones
  watch(
    config.inject.sources.app.js.concat(config.inject.sources.app.css),
    options,
    injectFn
  );

  //Watch for changes in bower related files and inject new ones
  watch(
    'bower.json',
    injectFn
  );
});

gulp.task('i', ['inject']);

gulp.task('reload-html', function(){
    return gulp.src(build.html)
    .pipe(plumber(onError))
    .pipe(changed(sourcePath + 'reload/'))
    .pipe(gulp.dest(sourcePath + 'reload/'))
    .pipe(livereload());
});

gulp.task('reload-js', function(){
    return gulp.src(build.js)
    .pipe(babel({presets: ['es2015']}))
    .pipe(plumber(onError))
    .pipe(changed(sourcePath + 'reload/'))
    .pipe(gulp.dest(sourcePath + 'reload/'))
    .pipe(livereload());
});

gulp.task('reload-css', function(){
    return gulp.src(build.css)
    .pipe(plumber(onError))
    .pipe(changed(sourcePath + 'reload/', {hasChanged: changed.compareSha1Digest}))
    .pipe(gulp.dest(sourcePath + 'reload/'))
    .pipe(livereload());
});