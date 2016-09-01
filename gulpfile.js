var gulp = require('gulp');
var browserify = require('browserify');
// var transform = require('vinyl-transform');
//var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var es = require('event-stream');
var rename = require('gulp-rename');
 
gulp.task('browserify', function () {
	var files = [
        './src/watsonrecognition.js',
        // './src/editor2.js',
        // './src/audio-main.js'
    ];

    var tasks = files.map(function(entry) {
	    return browserify({ 
	    		entries: [entry],
	    	})
	    	.bundle()
	    	.pipe(source(entry))
	    	.pipe(rename({
	    		dirname: '',
		    	extname: '.bundle.js'
		    }))
	    	.pipe(gulp.dest('./public/'));
	    });
    return es.merge.apply(null, tasks);
});

gulp.task('default', ['browserify']);