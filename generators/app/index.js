'use strict';
const Generator = require('yeoman-generator');
const pkg = require('../../package.json');
const chalk = require('chalk');
const filter = require('gulp-filter');
const through = require('through2');
const banner = require('../../lib/banner');
const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');

function highlight(string) {
	return chalk.hex('#005f00').bold(`${string}`);
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

		this.option('name', {
			type: String,
			alias: 'n',
			desc: 'package name of your site',
			default: this.determineAppname(),
			required: false
		});

		this.qgoda = {};

		this._readConfigYaml();
		this.qgoda.config = yaml.safeLoad(this.qgoda.configData);
		if (this.qgoda.config === undefined) this.qgoda.config = {};
	}

	_readConfigYaml() {
		this.qgoda.configPath = '_config.yaml';
		try {
			let buffer = fs.readFileSync(this.destinationPath('_config.yaml'), 'utf-8');
			this.qgoda.configData = buffer.toString();
		} catch (e) {
			try {
				let buffer = fs.readFileSync(
					this.destinationPath('_config.yml'),
					'utf-8'
				);
				this.qgoda.configPath = '_config.yaml';
				this.qgoda.configData = buffer.toString();
			} catch (e) {
				this.qgoda.configData = '';
			}
		}
	}

	initializing() {
		this.log(banner);
		this.log();
		this.log('\t\t\t' + highlight(`Qgoda Generator Version ${pkg.version}`));
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
				type: 'input',
				name: 'author',
				message: `What is your ${highlight('name')}`,
				default: this.user.git.name(),
				store: true
			},
			{
				type: 'input',
				name: 'email',
				message: `What is your ${highlight('email address')}`,
				default: this.user.git.email(),
				when: here => here.author !== undefined,
				store: true
			},
			{
				type: 'list',
				name: 'pm',
				message: `Which ${highlight('package manager')} do you prefer`,
				choices: ['npm', 'yarn'],
				default: 'npm',
				store: true
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

	default() {
		try {
			this.qgoda.pjson = require(this.destinationPath('package.json'));
		} catch (e) {
			this.qgoda.pjson = {};
		}
		let pjson = this.qgoda.pjson;
		pjson.name = this.answers.name;
		if (pjson.license === undefined) pjson.license = 'UNLICENSED';
		if (pjson.version === undefined) pjson.version = '0.1.0';
		if (this.answers.author !== undefined) {
			pjson.author = this.answers.author;
			if (this.answers.email !== undefined)
				pjson.author += `<${this.answers.email}>`;
		}
		if (pjson.keywords === undefined) pjson.keywords = ['Qgoda', 'website'];
		if (pjson.scripts === undefined) pjson.scripts = {};
		if (pjson.devDependencies === undefined) pjson.devDependencies = {};
		pjson.devDependencies['browser-sync'] = '^2.26.3';
		let pm = this.answers.pm;
		this.installTasks[pm] = true;
		pjson.scripts.preserver = `${pm} install`;
		pjson.scripts.server = 'browser-sync start --server _site --files _timestamp';
	}

	_checkConfig() {
		let got = this.qgoda.config;
		let wanted = JSON.parse(JSON.stringify(got));

		let pm = this.answers.pm;

		wanted.helpers = {
			'browser-sync': `${pm} run server`
		};

		if (_.isEqual(got, wanted)) return false;

		this.qgoda.config = wanted;

		return true;
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

		this.fs.extendJSON(this.destinationPath('package.json'), this.qgoda.pjson);

		// This should come last so that we can print meaning full error
		// messages.
		if (this._checkConfig()) {
			let prefix = `\
# This file was generated by the yeoman generater "generator-qgoda". The
# generator tries its best to avoid overwriting this file. You can help by
# preserving this comment and by keeping the alphanumerical order of keys.
# Please note that other comments than this one will get overwritten, the
# next time the file has to be touched.`;

			let serialized = yaml.safeDump(this.qgoda.config, {
				sortKeys: true
			});
			this.fs.write(
				this.destinationPath(this.qgoda.configPath),
				prefix + serialized
			);
		}
	}

	install() {
		this.installDependencies(this.installTasks);
	}

	end() {
		this.log(`
Now run ${highlight('qgoda watch')} in order to start your site!
`);
	}
};
