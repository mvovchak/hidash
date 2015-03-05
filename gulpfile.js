var gulp = require('gulp'),
	Y = require('yuidocjs'),
	fs = require('fs'),
	uglify = require('gulp-uglify'),
	git = require('gulp-git'),
	jeditor = require('gulp-json-editor'),
	_ = require('./src/hidash.js');

gulp.task('scripts', function(cb){
	return gulp.src('src/hidash.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

// Version
gulp.task('setVersion', function(cb){
	var version = process.argv[4];

	gulp.src('./**.json')
		.pipe(jeditor({
			version: version
		}))
		.pipe(gulp.dest('.'));
});

gulp.task('commitVersion', ['setVersion'], function(cb){
	var version = process.argv[4];

	gulp.src('./**.json')
		.pipe(git.commit('Changed version to ' + version));
});

gulp.task('tagVersion', ['commitVersion'], function(cb){
	var version = process.argv[4];

	git.tag(version, 'Changed version to ' + version);
});

gulp.task('version', ['setVersion', 'commitVersion', 'tagVersion']);



gulp.task('doc', function(cb){
	fs.readFile('yuidoc.json', function(err, data){
		var doc = JSON.parse(data),
			options = doc.options,
			json = (new Y.YUIDoc(options)).run(),
			builder = new Y.DocBuilder(options, json);
		builder.compile(cb);
	});
});



gulp.task('watch', function() {
  gulp.watch('src/hidash.js', ['scripts', 'doc']);
});

gulp.task('default', ['watch', 'scripts', 'doc']);
