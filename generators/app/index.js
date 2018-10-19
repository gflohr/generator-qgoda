'use strict';
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const pkg = require('../../package.json');
const path = require('path');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);

		this.installTasks = {
			npm: false,
			bower: false
		};
		this.props = {};
	}

	initializing() {
		this.log(yosay(`Qgoda generator version ${pkg.version}`));
	}

	prompting() {
		var name = this.props.name;
		if (!(name && name.length)) {
			name = path.basename(process.cwd());
		}

		const prompts = [
			{
				type: 'input',
				name: 'name',
				message: 'What is the name of your web site',
				default: name
			}
		];

		return this.prompt(prompts).then(answers => {
			this.props = answers;
		});
	}

	writing() {
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
