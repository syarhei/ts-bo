const gulp = require("gulp");
const shell = require("gulp-shell");
const clean = require("gulp-clean");
const fs = require("fs");

gulp.task("create 'dist' dir", ["clean 'dist' dir"], () => {
    return fs.mkdirSync("dist");
});

gulp.task("build", ["create 'dist' dir"], shell.task("tsc", { cwd: "./node_modules/.bin", verbose: true }));

gulp.task("clean 'dist' dir", () => {
    return gulp
        .src("dist", { read: false })
        .pipe(clean())
});

gulp.task("clean", ["create 'dist' dir"]);