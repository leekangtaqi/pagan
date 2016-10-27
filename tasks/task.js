"use strict";

import gulp from 'gulp';
import path from 'path';
import runSequence from 'run-sequence';
import webpack from 'webpack';
import nodemon from 'nodemon';
import uglify from 'gulp-uglify';
import gulpLoadPlugins from 'gulp-load-plugins';
import concat from 'gulp-concat';
import gzip from 'gulp-gzip';
import rename from 'gulp-rename';
import fs from 'fs';
import lazypipe from 'lazypipe';

var plugins = gulpLoadPlugins();
const entry = './client/**';
const clientPath = 'client';
const serverPath = 'server';

const paths = {
    client: {
        assets: `${clientPath}/assets/**/*`,
        images: `${clientPath}/assets/images/**/*`,
        mainStyle: `${clientPath}/app/main.scss`,
        views: `${clientPath}/app/**/*.html`,
        mainView: `${clientPath}/index.html`
    },
    server: {
        scripts: [
          `${serverPath}/**/!(*.spec|*.integration).js`,
          `!${serverPath}/config/local.env.sample.js`
        ],
        json: [`${serverPath}/**/*.json`],
    },
    dist: 'dist'
}

/**
 * Helper functions
 */
function onServerLog(log) {
    console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white('] ') +
        log.message);
}
function onProcessComplete(startTime){
    let endTime = (new Date()).getTime();
    console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('process') +
        plugins.util.colors.white('] ') +
        plugins.util.colors.yellow('Finished the process exec for ') +
        plugins.util.colors.green(parseFloat((endTime - startTime)/1000, 10).toFixed(2)) + ' s');
}

/**
 * Reusable pipelines
 */
let transpileServer = lazypipe()
    .pipe(plugins.babel, {
        plugins: [
            "syntax-async-functions",
            "transform-regenerator"
        ]
    });

gulp.task("webpack:pro", cb => {
    const config = require('../webpack.config');
    webpack(config, (err, stats) => {
        if(err) {
            console.error(err);
            throw new gutil.PluginError("webpack", err);
        }
        plugins.util.log("[webpack]", stats.toString());
        cb(); 
    })
});

gulp.task("transpile:server", () => {
    return gulp.src(paths.server.scripts)
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
})

gulp.task('start:server', cb => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    nodemon(`-w ${serverPath} ${serverPath}`)
        .on('log', log =>{ 
            onServerLog(log); 
        });
})

gulp.task('env:pro', () => {
    plugins.env({
        vars: {NODE_ENV: 'production'}
    });
})

gulp.task('env:dev', () => {
    plugins.env({
        vars: {NODE_ENV: 'development'}
    });
})

gulp.task('inject:pro', cb => {
    runSequence('inject:pro:js', 'inject:pro:css', cb);
})

gulp.task('copy:html', () => {
    return gulp.src(paths.client.mainView)
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`))
})

gulp.task('copy:conf', () => {
    return gulp.src(paths.server.conf)
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`))
})

gulp.task('inject:pro:js', () => {
    return gulp.src(`${paths.dist}/${paths.client.mainView}`)
        .pipe(plugins.inject(
            gulp.src(`${paths.dist}/${clientPath}/app/bundle.js`, {read: false}),
                {
                    starttag: '<!-- build:js(dist/client) app/bundle.js -->',
                    endtag: '<!-- endbuild -->',
                    transform: (filepath) => {
                        let path = '<script src="' + filepath.replace(`/${paths.dist}\/${clientPath}/`, '') + '"></script>';
                        console.warn(path); 
                        return path; 
                    }
                }))
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
})

gulp.task('inject:dev:js', () => {
    return gulp.src(paths.client.mainView)
        .pipe(plugins.inject(
            gulp.src(`${paths.dist}/${clientPath}/app/bundle.js`, {read: false}),
                {
                    starttag: '<!-- build:js(dist/client) app/bundle.js -->',
                    endtag: '<!-- endbuild -->',
                    transform: (filepath) => {
                        return "<script>var body = document.getElementsByTagName('body')[0];var script = document.createElement('script');script.src = window.location.origin + ':8080' + '/client/app/bundle.js';body.appendChild(script);</script>";
                    }
                }))
        .pipe(gulp.dest(clientPath));
})

gulp.task('inject:pro:css', () => {
    return gulp.src(`${paths.dist}/${paths.client.mainView}`)
        .pipe(plugins.inject(
            gulp.src(`${paths.dist}/${clientPath}/app/style.css`, {read: false}),
                {
                    starttag: '<!-- build:css(dist/client) app/style.css -->',
                    endtag: '<!-- endbuild -->',
                    transform: (filepath) => '<link rel="stylesheet" href="' + filepath.replace(`/${paths.dist}\/${clientPath}/`, '') + '">'
                }))
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
})

gulp.task('copy', cb => {
     runSequence(['copy:html'], cb);
})

gulp.task('build:client', () => {
    let htmlBlock = plugins.filter(['**/*.!(html)'], {restore: true}); 
    return gulp.src(`${paths.dist}/${paths.client.mainView}`)
        .pipe(plugins.useref())
        .pipe(htmlBlock)
        .pipe(plugins.rev({verbose: true}))
        .pipe(htmlBlock.restore)
        .pipe(plugins.revReplace())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
})

gulp.task('build', cb => {
    let startTime = (new Date()).getTime();
    runSequence(
        'copy',
        'env:pro',
        'webpack:pro',
        // 'inject:pro',
        // 'build:client',
        [
            'transpile:server'
        ],
        () => {
            cb();
            onProcessComplete(startTime);
        }
    )
})

gulp.task('dev', cb => {
    runSequence(
        'env:dev',
        'inject:dev:js',
        ['start:server'],
        cb
    )
})

gulp.task('oss', function(){
    return gulp.src([
        './dist/client/app/*'
      ], { base: 'dist/client' })
      .pipe(plugins.alioss({
          accessKeyId: 'NHHQxoaTzvKUbEsf',
          accessKeySecret: 'Zx64nWglj7j8AtF2JD9MmPtUdZWvXM',
          endpoint: 'oss-cn-beijing-internal.aliyuncs.com',
          bucket: '91pt',
          prefix: 'client'
      }));
});
gulp.task('cdn',function(){
  return gulp.src(`${paths.dist}/${paths.client.mainView}`)
    .pipe(plugins.cdnizer({
        defaultCDNBase: "//img.91pintuan.com/client",
        allowRev: true,
        allowMin: false,
        files: [
            'app/*.js',
            'app/*.css'
        ]
    }))
    .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});