module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			options: {
				banner: "/*<%= pkg.name %> v<%= pkg.version %>|(c) 2014 <%= pkg.author.name %>|<%= pkg.licenses[0].url %>*/\n"
			},
			build: {
				src: "src/wysiwyg.js",
				dest: "dist/wysiwyg.min.js"
			}
		},
		watch: {
			compass: {
				files: ["src/**/*.js"],
				tasks: "default"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("default", ["uglify"]);

};