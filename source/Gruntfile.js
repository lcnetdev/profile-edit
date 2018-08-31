/**
*Standard configuration file for all Angular.js projects
*Concats and minifies both the javascript and css files
*and performs a code analysis on the javascript files.
*
*Running this file requires first initializing npm in the
*project's root directory, using the
*command npm init. Follow the instructions to set up the
*package.json file.
*
*Once the package.json file has been created
*run 'npm install grunt-ng-annotate --save-dev',
*'npm install grunt-contrib-uglify --save-dev',
*'npm install grunt-contrib-cssmin --save-dev',
* and 'npm install grunt-plato --save-dev' to
*finish generating the proper package.json file 
*for the project'
*/
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		//Explicitly add in any necessary annotation while doing the concats
		ngAnnotate: {
			//The controllers and services must follow everything else
			base: {
				files: [
					{src: ['assets/js/modules/**/*.js', '!assets/js/modules/**/controllers/**/*.js', '!assets/js/modules/**/services/**/*.js', '!assets/js/modules/**/directives/**/*.js'], dest: 'assets/js/dist/base.js'}
				],
			},
			controllers: {
				files: [
					{src: ['assets/js/modules/**/controllers/**/*.js'], dest: 'assets/js/dist/controllers.js'}
				],
			},
			services: {
				files: [
					{src: ['assets/js/modules/**/services/**/*.js'], dest: 'assets/js/dist/services.js'}
				],
			},
			directives: {
				files: [
					{src: ['assets/js/modules/**/directives/**/*.js'], dest: 'assets/js/dist/directives.js'}
				],
			},
			dist: {
				files: [
					{src: ['assets/js/dist/base.js', 'assets/js/dist/services.js', 'assets/js/dist/controllers.js', 'assets/js/dist/directives.js'], dest: 'assets/js/dist/concat.js'},
				],
			},
		},
		uglify: {
			options: {
				banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */',
			},
			dist: {
				files: [
					{src: 'assets/js/dist/concat.js', dest: 'assets/js/dist/<%= pkg.name %>.min.js'}
				]
			},
		},
		cssmin: {
			add_banner: {
				options: {
					banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */'
				},
			},
			combine: {
				//For some reason, this one is dest then src
				files: {
					'assets/css/dist/<%= pkg.name %>.min.css': ['assets/css/**/*.css', '!assets/css/explorer8.css', '!assets/css/explorer9.css', '!**/*.min.css']
				},
			},
		},
		plato: {
			options: {
			},
			tests: {
				files: {
					'documentation/plato': ['assets/js/modules/**/*.js']
				},
			},
		},
		ngdocs: {
			options: {
				dest: 'documentation/ngdocs',
			},
			all: ['assets/js/modules/**/*.js']
		},
		jsdoc: {
			dist: {
				src: ['assets/js/modules/**/*.js'],
				options: {
					destination: 'documentation/jsdoc'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-plato');
	grunt.loadNpmTasks('grunt-ngdocs');
	grunt.loadNpmTasks('grunt-jsdoc');
	
	grunt.registerTask('default', ['ngAnnotate', 'uglify', 'cssmin', 'plato', 'ngdocs', 'jsdoc']);
};
