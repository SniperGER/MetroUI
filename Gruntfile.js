module.exports = function(grunt) {

	var jsFilesList = [
		/* MetroUI Core */
		'src/js/intro.js',
		'src/js/init.js',
		//'src/js/bars.js',
		//'src/js/modals.js',
		'src/js/notifications.js',
		//'src/js/preloader.js',
		'src/js/flyouts.js',
		'src/js/pages.js',
		'src/js/navigation.js',
		'src/js/animation.js',
		'src/js/design.js',
		'src/js/tiles.js',
		'src/js/plugins.js',
		'src/js/outro.js',

		/* MetroUI Classes */
		'src/js/class/View.js',
		'src/js/class/Menu.js',
		'src/js/class/Page.js',
		'src/js/class/Modal.js',
		'src/js/class/Notification.js',
		'src/js/class/Pivot.js',
		'src/js/class/Hub.js',
		'src/js/class/TabControl.js',
		'src/js/class/SplitControl.js',

		/* MetroUI Bundled Extensions */
		'src/js/dom.js',
		'src/js/misc.js',
		'src/js/fastclick.js',
		'src/js/ellipsis.js',
		'src/js/velocity.js'
	];
	
	var lessFileList = [
		'src/less/MetroUI.less',
	];
	var lessFileList10 = [
		'src/less/MetroUI.Win10.less',
	];
	
	var watchFileList = [
		'src/js/*',
		'src/less/win8/*',
		'src/less/wp8/*',
		'src/less/MetroUI.less',
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
                    hostname: '0.0.0.0',
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
					laxcomma: true,
					asi: true,
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
		less: {
			build: {
				files: {
					'build/css/MetroUI-2.1.css': lessFileList
				}
			},
			build_new: {
				files: {
					'build/css/MetroUI.Win10.css': lessFileList10
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
			build_new: {
				expand: true,
				src: ['js/**'],
				dest: 'build/'
			},
			dist: {
				expand: true,
				src: ['css/**'],
				dest: 'dist/',
			}
		},
		replace: {
			build: {
				src: ["build/js/MetroUI-2.1.js"],
				overwrite: true,
				replacements: [
					{
						from: '{{app.buildNumber}}',
						to: "<%= pkg.build %>"
					},
					{
						from: '{{app.buildDate}}',
						to: "<%= grunt.template.today('yymmdd-hhMM') %>"
					}
				]
			}
		},
		buildnumber: {
			options: {
				field: 'build',
			},
			files: ['package.json']
		},
		watch: {
			files: [watchFileList],
			tasks: 	['concat:build', 'jshint:build', 'less:build']
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
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-remove');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-build-number');

	
	// Default task(s).
	grunt.registerTask('default', ['build']);
	this.registerTask('build', 'Builds a development version of <%= pkg.name %>', [
		'concat:build',
		'jshint:build',
		'less:build',
		'less:build_new',
		'replace:build',
		//'buildnumber'
	]);
	this.registerTask('build-all', 'Builds a development version of <%= pkg.name %>', [
		'concat:build',
		'jshint:build',
		'less:build',
		'less:build_new',
		'copy:build',
		'copy:build_new',
		'replace:build',
		//'buildnumber'
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
        'watch'
	]);
	this.registerTask('clean','Removes /build and /dist folders', [
		'remove'
	]);
};
	