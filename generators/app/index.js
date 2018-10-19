'use strict';
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const path = require('path');
const pkg = require('../../package.json');
const chalk = require('chalk');

function highlight(string) {
	return chalk.hex('#d2691e').bold(`*${string}*`);
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
		var dpackage;
		try {
			dpackage = require(this.destinationPath('package.json'));
		} catch (e) {
			dpackage = {};
		}

		if (!dpackage.name !== undefined) {
			// Initialize with defaults.
			dpackage.name = path.basename(process.cwd());
		}

		this.option('name', {
			type: String,
			alias: 'n',
			desc: 'package name of your site',
			default: dpackage.name,
			required: false
		});
	}

	initializing() {
		this.log(yosay(`Qgoda generator version ${pkg.version}`));
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
				name: 'shiftwidt',
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
		this.log(this.answers);
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
