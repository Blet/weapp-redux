/**
 * ------------------------------------------------------------------
 * WeApp-Workflow gulpfile 文件
 * ------------------------------------------------------------------
 *
 * @author  JeffMa
 * @link    https://devework.com/
 * @data    2017-06-11
 * @update  2018-03-22
 */

var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var del = require('del');
var replace = require('gulp-replace');
var babel = require("gulp-babel");
var gutil = require('gulp-util');
var debug = require('gulp-debug');


// 相关路径配置
var paths = {
    src: {
        baseDir: 'src',
        imgDir: 'src/image',
        spriteDir: 'src/assets/sprites',
        scssDir: 'src/assets/scss',
        imgFiles: 'src/image/**/*',
        scssFiles: 'src/**/*.scss',
        baseFiles: ['src/**/*.{png,json}', '!src/assets/**/*', '!src/image/**/*'],
        assetsDir: 'src/assets',
        assetsImgFiles: 'src/assets/images/**/*.{png,jpg,jpeg,svg,gif}',
        wxmlFiles: 'src/**/*.wxml',
        jsFiles: ['src/**/*.js', 'src/**/**/*.js']
    },
    dist: {
        baseDir: 'dist',
        imgDir: 'dist/image',
        wxssFiles: 'dist/**/*.wxss',
    },
    tmp: {
        baseDir: 'tmp',
        imgDir: 'tmp/assets/images',
        imgFiles: 'tmp/assets/images/**/*.{png,jpg,jpeg,svg,gif}'
    }
};


// Log for output msg.
function log() {
    var data = Array.prototype.slice.call(arguments);
    gutil.log.apply(false, data);
}

function babelJS() {
    return gulp.src(paths.src.jsFiles)
        .pipe(babel())
        .pipe(gulp.dest("dist"));
}


// 复制基础文件
function copyBasicFiles() {
    return gulp.src(paths.src.baseFiles, {})
        .pipe(gulp.dest(paths.dist.baseDir));
}

// 复制 WXML
function copyWXML() {
    return gulp.src(paths.src.wxmlFiles, {})
        .pipe(gulp.dest(paths.dist.baseDir));
}


// clean 任务, dist 目录
function cleanDist() {
    return del(paths.dist.baseDir);
}

// clean tmp 目录
function cleanTmp() {
    return del(paths.tmp.baseDir);
}



var watchHandler = function (type, file) {
    var extname = path.extname(file);

    if (extname === ".js") {
        if (type === "removed") {

        } else {
            babelJS();
        }
    }
    // SCSS 文件
    if (extname === '.scss') {
        if (type === 'removed') {
            var tmp = file.replace('src/', 'dist/').replace(extname, '.wxss');
            del([tmp]);
        } else {
            sassCompile();
        }
    }
    // 图片文件
    else if (extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.svg' || extname === '.gif') {
        if (type === 'removed') {
            if (file.indexOf('assets') > -1) {
                del([file.replace('src/', 'tmp/')]);
            } else {
                del([file.replace('src/', 'dist/')]);
            }
        } else {
            wxmlImgRewrite();
        }
    }

    // wxml
    else if (extname === '.wxml') {
        if (type === 'removed') {
            var tmp = file.replace('src/', 'dist/')
            del([tmp]);
        } else {
            copyWXML();
            wxmlImgRewrite();
        }
    }

    // 其余文件
    else {
        if (type === 'removed') {
            var tmp = file.replace('src/', 'dist/');
            del([tmp]);
        } else {
            copyBasicFiles();
        }
    }
};

//监听文件
function watch(cb) {
    var watcher = gulp.watch([
        paths.src.baseDir,
        paths.tmp.imgDir
    ],
        { ignored: /[\/\\]\./ }
    );
    watcher
        .on('change', function (file) {
            log(gutil.colors.yellow(file) + ' is changed');
            watchHandler('changed', file);
        })
        .on('add', function (file) {
            log(gutil.colors.yellow(file) + ' is added');
            watchHandler('add', file);
        })
        .on('unlink', function (file) {
            log(gutil.colors.yellow(file) + ' is deleted');
            watchHandler('removed', file);
        });

    cb();
}

//注册默认任务
gulp.task('default', gulp.series(
    cleanTmp,
    copyBasicFiles,
    gulp.parallel(
        copyWXML,
        babelJS
    ),
    watch
));

//注册测试任务
gulp.task('test', gulp.series(
    cleanTmp,
    copyBasicFiles,
    gulp.parallel(
        copyWXML,
        babelJS
    ),
));

// 删除任务
gulp.task('clean', gulp.parallel(
    cleanTmp,
    cleanDist
));
