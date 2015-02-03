module.exports = function(grunt) {

	var jsFilesList = [
		'src/js/intro.js',
		'src/js/init.js',
		'src/js/modals.js',
		'src/js/preloader.js',
		'src/js/flyouts.js',
		'src/js/navigation.js',
		'src/js/animation.js',
		'src/js/design.js',
		'src/js/outro.js',
		'src/js/misc.js',
		'src/js/fastclick.js',
		'src/js/ellipsis.js'
	];
	
	var lessFileList = [
		'src/less/common-win8.less',
		'src/less/menu-win8.less',
		'src/less/pages-win8.less',
		'src/less/forms-win8.less',
		'src/less/lists-win8.less',
		'src/less/theme-selector-win8.less',
		'src/less/notifications-win8.less',
		'src/less/flyouts-win8.less',
		'src/less/bars-win8.less',
		'src/less/progress-win8.less',
		'src/less/animations-win8.less',
		'src/less/icons-win8.less',
		'src/less/themes-win8.less',
		'src/less/accents-win8.less',
	];
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		//banner: '/*\n' +
		//			' * <%= pkg.name %> <%= pkg.version %>\n' +
		//			' * <%= pkg.description %>\n' +
		//			' *\n' +
		//			' * Copyright <%= grunt.template.today("yyyy") %>, <%= pkg.author %>\n' +
		//			' * Janik Schmidt (SniperGER)\n' +
		//			' *\n' +
		//			' * Licensed under <%= pkg.license %>\n' +
		//			' *\n' +
		//			' * Built: <%= grunt.template.today("mmmm d yyyy, h:MM:ss TT") %>\n' +
		//			'*/\n\n',
		connect: {
            server: {
                options: {
                    port: 3000,
                    base: ''
                }
            }
        },
        open: {
			server: {
				url: 'http://localhost:3000'
			}
        },
		concat: {
			build: {
				src: jsFilesList,
				dest: 'build/js/MetroUI-2.1.js',
				sourceMap: false,
				options: {
					sourceMap: false
				}
			},
			dist: {
				src: jsFilesList,
				dest: 'dist/js/MetroUI-2.1.js',
				sourceMap: false,
				options: {
					sourceMap: false
				}
			},
		},
		jshint: {
			build: {
				src: ['./build/js/MetroUI-2.1.js'],
				
				options: {
					shadow: true,
					loopfunc: true,
					elision: true,
					laxcomma: true
				}
			},
			dist: {
				src: ['./dist/js/MetroUI-2.1.js'],
				
				options: {
					shadow: true,
					loopfunc: true,
					elision: true,
					laxcomma: true
				}
			}
        },
        uglify: {
			dist: {
				files: {
					'dist/js/MetroUI-2.1.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		less: {
			build: {
				files: {
					'build/css/MetroUI-2.1.css': lessFileList
				}
			},
			dist: {
				files: {
					'dist/css/MetroUI-2.1.css': lessFileList
				}
			}
		},
		copy: {
			build: {
				expand: true,
				src: ['css/**'],
				dest: 'build/',
			},
			dist: {
				expand: true,
				src: ['css/**'],
				dest: 'dist/',
			}
		},
		watch: {
			files: [jsFilesList, lessFileList],
			tasks: 	['concat:build', 'jshint', 'uglify:dist', 'less:build']
		},
		remove: {
			default_options: {
				dirList: ['build/','dist/']
			}
		}
    });

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-remove');
	
	// Default task(s).
	grunt.registerTask('default', ['build']);
	this.registerTask('build', 'Builds a development version of <%= pkg.name %>', [
		'concat:build',
		'jshint:build',
		'less:build',
		'copy:build'
	]);
	this.registerTask('dist', 'Builds a production version of <%= pkg.name %>', [
		'concat:dist',
		'uglify:dist',
		'jshint:dist',
		'less:dist',
		'copy:dist'
	]);
	this.registerTask('server','Opens a Server with <%== pkg.name %>', [
		'connect:server',
        'open',
        'watch'
	]);
	this.registerTask('clean','Removes /build and /dist folders', [
		'remove'
	]);
};
	