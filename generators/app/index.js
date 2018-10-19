'use strict';
const Generator = require('yeoman-generator');
const pkg = require('../../package.json');
const chalk = require('chalk');
const filter = require('gulp-filter');
const through = require('through2');
const banner = require('../../lib/banner');

function highlight(string) {
	return chalk.hex('#d78700').bold(`${string}`);
}

function indenter(options) {
	return through.obj(function(file, encoding, callback) {
		if (options.indentation === 'spaces') {
			var spaces = ' '.repeat(options.tabsize);
			var formatted = file.contents.toString().replace(/\t/g, spaces);
			file.contents = Buffer.from(formatted);
		}
		callback(null, file);
	});
}

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);

		this.installTasks = {
			npm: false,
			yarn: false,
			bower: false
		};

		// Read an existing package.json.
		// var dpackage;
		// try {
		//	dpackage = require(this.destinationPath('package.json'));
		// } catch (e) {
		//	dpackage = {};
		// }

		this.option('name', {
			type: String,
			alias: 'n',
			desc: 'package name of your site',
			default: this.determineAppname(),
			required: false
		});
	}

	initializing() {
		this.log(banner);
		this.log();
		this.log('\t\t\t' + highlight(`Qgoda generator version ${pkg.version}`));
		this.log();
	}

	prompting() {
		const prompts = [
			{
				type: 'input',
				name: 'name',
				message: `What is the ${highlight('name')} of your web site`,
				default: this.options.name,
				store: false
			},
			{
				type: 'list',
				name: 'indentation',
				message: `Which ${highlight('indentation')} style do you want to use`,
				choices: ['tabs', 'spaces'],
				default: 'tabs',
				store: true
			},
			{
				type: 'list',
				name: 'tabsize',
				message: `Which ${highlight('tab size')} do you prefer`,
				choices: ['2', '4', '8'],
				default: '4',
				store: true,
				when: here => here.indentation === 'spaces'
			}
		];

		return this.prompt(prompts).then(answers => {
			this.answers = answers;
		});
	}

	writing() {
		const f = filter(['**', '!**/*.md', '!**/*.png', '!**/*.ico'], {
			restore: true
		});

		this.registerTransformStream([f, indenter(this.answers), f.restore]);

		const copies = [
			'index.md',
			'favicon.ico',
			'static/images/favicon.png',
			'_views/default.html',
			'_views/raw',
			'_views/functions/setup.tt',
			'_views/functions/scripts.tt',
			'_views/functions/styles.tt',
			'_views/partials/body.html',
			'_views/partials/head.html',
			'_views/wrappers/html5.html'
		];
		for (var i = 0; i < copies.length; ++i) {
			this.fs.copy(this.templatePath(copies[i]), this.destinationPath(copies[i]));
		}
	}

	install() {
		// This.installDependencies(this.installTasks)
	}
};
