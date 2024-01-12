const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const Plumber = require("gulp-plumber");
const exec = require('child_process').exec;
gulp.task("sass", function() {
  return gulp
    .src("./app/css/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(gulp.dest("./app/css"));
});

gulp.task("js", function() {
  return gulp
    .src(["./app/js/es6/*.js"])
    .pipe(Plumber())
    .pipe(babel())
    .pipe(gulp.dest("./app/js/"));
});

gulp.task("serve", ["sass", "js"], function() {
  gulp.watch("./app/css/*.scss", ["sass"]);
  gulp.watch("./app/js/es6/*.js", ["js"]);
});

gulp.task('svrx', function() {
  exec('npm run svrx');
});

gulp.task("default", ["serve", "svrx"]);
