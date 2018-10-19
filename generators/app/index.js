'use strict';
const Generator = require('yeoman-generator');
// Const chalk = require('chalk');
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

	prompting() {
		this.log(yosay(`Qgoda generator version ${pkg.version}`));

		var name = this.props.name;
		if (!(name && name.length)) {
			name = path.basename(process.cwd());
		}
		const namePrompt = {
			type: 'input',
			name: 'name',
			message: 'What is the name of your web site',
			default: name
		};

		const prompts = [namePrompt];

		return this.prompt(prompts).then(props => {
			this.props = props;
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
