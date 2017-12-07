const gulp = require("gulp");
const buble = require("buble");
const uglifyJS = require("uglify-js");
const composer = require("gulp-uglify/composer");
const uglify = composer(uglifyJS, console);
const replace = require("gulp-replace");
const include = require("gulp-include");
const concat = require("gulp-concat");
const header = require("gulp-header");
const size = require("gulp-size");
const Transform = require("stream").Transform;
const mocha = require("gulp-mocha");
const pkg = require("./package.json");

// Header comment
const comment = `/**
 * Trie v${pkg.version}
 * Copyright 2017 Léopold Szabatura
 * Released under the MIT License
 * https://github.com/MetaCorp/trie
 */\r\n`;

// Gulp Buble Plugin
const gulpBuble = function(options) {
  return new Transform({
    objectMode: true,
    transform: function(file, encoding, callback) {
      if(!file.isStream()) {
        if(options === undefined) {
          options = {};
        }

        let result = null;
        try {
          result = buble.transform(file.contents.toString(), options);
        } catch(e) {
          throw new Error("[Buble] Error: " + e);
        }

        file.contents = new Buffer(result.code);

        callback(null, file);
      }
    }
  });
};

const bubleConfig = {
  namedFunctionExpressions: false,
  transforms: {
    arrow: true,
    classes: false,
    collections: false,
    computedProperty: false,
    conciseMethodProperty: false,
    constLoop: false,
    dangerousForOf: false,
    dangerousTaggedTemplateString: false,
    defaultParameter: false,
    destructuring: false,
    forOf: false,
    generator: false,
    letConst: true,
    modules: false,
    numericLiteral: false,
    parameterDestructuring: false,
    reservedProperties: false,
    spreadRest: false,
    stickyRegExp: false,
    templateString: true,
    unicodeRegExp: false
  }
}

gulp.task("transpile", function() {
  return gulp.src(["./src/trie.js"])
    .pipe(gulpBuble(bubleConfig))
    // .pipe(concat("trie.js"))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("build", ["transpile"], function() {
  return gulp.src(["./src/wrapper.js"])
    .pipe(include())
    .pipe(concat("trie.js"))
    .pipe(header(comment + '\n'))
    .pipe(replace("__VERSION__", pkg.version))
    .pipe(size())
    .pipe(gulp.dest("./dist/"));
});

gulp.task("minify", ["build"], function() {
  return gulp.src(["./dist/trie.js"])
    .pipe(uglify())
    .pipe(header(comment))
    .pipe(size())
    .pipe(size({
      gzip: true
    }))
    .pipe(concat("trie.min.js"))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("transpile1", function () {
  return gulp.src(["./src/trie1.js"])
    .pipe(gulpBuble(bubleConfig))
    // .pipe(concat("trie.js"))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("build1", ["transpile1"], function() {
  return gulp.src(["./src/wrapper1.js"])
    .pipe(include())
    .pipe(concat("trie1.js"))
    .pipe(header(comment + '\n'))
    .pipe(replace("__VERSION__", pkg.version))
    .pipe(size())
    .pipe(gulp.dest("./dist/"));
});

gulp.task("minify1", ["build1"], function() {
  return gulp.src(["./dist/trie1.js"])
    .pipe(uglify())
    .pipe(header(comment))
    .pipe(size())
    .pipe(size({
      gzip: true
    }))
    .pipe(concat("trie1.min.js"))
    .pipe(gulp.dest("./dist/"));
});


gulp.task("test", function() {
  gulp.src("./test/**/*.js")
  		.pipe(mocha({reporter: "spec"}))
});

// Default task
gulp.task("default", ["build", "minify", "build1", "minify1"]);
