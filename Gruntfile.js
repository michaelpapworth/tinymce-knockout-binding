module.exports = function( grunt ) {
	'use strict';

	require( 'load-grunt-tasks' )( grunt );

	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),
		concat: {
			options: {
				banner: '/* !\n' +
                        ' * <%= pkg.name %> v<%= pkg.version %>\n' +
                        ' * <%= pkg.homepage %> \n' +
                        ' *\n' +
                        ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                        ' * Released under the <%= pkg.licenses[0].type %> license\n' +
                        ' */\n'
			},
			dist: {
				src: [ 'src/wysiwyg.js', 'src/ext/dirty.js', 'src/ext/wordcount.js' ],
				dest: 'dist/wysiwyg.js',
			}
		},
		jshint: {
			options: {
				browser: true,
				curly: true,
				globals: {
					jQuery: true
				},
				eqeqeq: true,
				eqnull: true,
				indent: 4,
				newcap: true,
				quotmark: 'single',
				sub: true
			},
			all: [ 'Gruntfile.js', 'src/**/*.js' ]
		},
		jscs: {
			src: 'src/**/*.js',
			gruntfile: 'Gruntfile.js',
			options: {
				'requireCurlyBraces': [ 'if', 'else', 'for', 'while', 'do', 'try', 'catch', 'finally' ],
				'requireSpaceAfterKeywords': [ 'if', 'else', 'for', 'while', 'do', 'switch', 'return', 'try', 'catch', 'finally' ],
				'requireSpacesInFunctionExpression': {
					'beforeOpeningCurlyBrace': true
				},
				'disallowSpacesInFunctionExpression': {
					'beforeOpeningRoundBrace': true
				},
				'requireSpacesInsideObjectBrackets': 'all',
				'requireSpacesInsideArrayBrackets': 'all',
				'disallowLeftStickedOperators': [ '?', '-', '/', '*', '=', '==', '===', '!=', '!==', '>', '>=', '<', '<=' ],
				'disallowRightStickedOperators': [ '?', '/', '*', ':', '=', '==', '===', '!=', '!==', '>', '>=', '<', '<=' ],
				'requireRightStickedOperators': [ '!' ],
				'requireLeftStickedOperators': [ ',' ],
				'disallowKeywords': [ 'with' ],
				'disallowMultipleLineBreaks': true,
				'disallowKeywordsOnNewLine': [ 'else' ],
				'requireLineFeedAtFileEnd': true,
			}
		},
		uglify: {
			build: {
				src: 'dist/wysiwyg.js',
				dest: 'dist/wysiwyg.min.js'
			},
			options: {
				preserveComments: false,
				sourceMap: 'dist/wysiwyg.min.map',
				sourceMappingURL: 'wysiwyg.min.map',
				report: 'min',
				beautify: {
					ascii_only: true
				},
				banner: '/*<%= pkg.name %> v<%= pkg.version %>|(c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>|<%= pkg.licenses[0].url %>*/',
				compress: {
					hoist_funs: false,
					loops: false,
					unused: false
				}
			}
		},
		watch: {
			compass: {
				files: [ 'src/**/*.js' ],
				tasks: 'default'
			}
		}
	});

	grunt.registerTask('default', [ 'jshint', 'jscs', 'concat', 'uglify' ]);

};
