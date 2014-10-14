module.exports = function(grunt) {

	var jsFilesList = [
		'src/js/MetroUI.intro.js',
		'src/js/init.js',
		'src/js/modals.js',
		'src/js/pages.js',
		'src/js/bars.js',
		'src/js/context.js',
		'src/js/MetroUI.outro.js'
	];
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*\n' +
		            ' * <%= pkg.name %> <%= pkg.version %>\n' +
		            ' * <%= pkg.description %>\n' +
		            ' *\n' +
		            ' * Copyright <%= grunt.template.today("yyyy") %>, <%= pkg.author %>\n' +
		            ' * Janik Schmidt (SniperGER)\n' +
		            ' *\n' +
		            ' * Licensed under <%= pkg.license %>\n' +
		            ' *\n' +
		            ' * Built: <%= grunt.template.today("mmmm d yyyy, h:MM:ss TT") %>\n' +
		            '*/\n\n',

		uglify: {
			build: {
				src: 'src/js/MetroUI.*.js',
				dest: 'build/MetroUI.js'
			}
		},
        concat: {
        	options: {
				banner: '<%= banner %>',
                stripBanners: false,
        	},
            js: {
                src: jsFilesList,
                dest: 'build/js/MetroUI.js',
                sourceMap: false,
                options: {
                    sourceMap: false
                }
            },
            js_dist: {
                src: jsFilesList,
                dest: 'dist/js/MetroUI.js',
                sourceMap: false,
                options: {
                    sourceMap: false
                }
            },
		},
        less: {
            build: {
                options: {
                    paths: ['less'],
                    cleancss: false
                },
                files: {
                    'build/css/MetroUI.css' : ['src/less/metroui.less'],
                }
            },
            dist: {
                options: {
                    paths: ['less'],
                    cleancss: false
                },
                files: {
                    'dist/css/MetroUI.css' : ['src/less/metroui.less'],
                }
            },
		},
		copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['img/**.*'],
                        dest: 'build/'
                    },
                    {
                        expand: true,
                        cwd: 'css/fonts/',
                        src: ['**'],
                        dest: 'build/css/fonts/'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['img/**.*'],
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        cwd: 'css/fonts/',
                        src: ['**'],
                        dest: 'dist/css/fonts/'
                    }
                ]
            },
        },
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	// Default task(s).
	grunt.registerTask('default', ['build']);
	this.registerTask('build', 'Builds a development version of <%= pkg.name %>', [
		'concat:js',
		'less:build',
		//'jshint:build',
		'copy:build',
	]);
	this.registerTask('dist', 'Builds a production version of <%= pkg.name %>', [
		'concat:js_dist',
		'less:dist',
		'copy:dist',
	]);

};
	