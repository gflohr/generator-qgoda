'use strict';
const Generator = require('yeoman-generator');
// Const chalk = require('chalk');
const yosay = require('yosay');
const pkg = require('../../package.json');
// Const askName = require('inquirer-npm-name');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.installTasks = {
      nmp: false,
      bower: false
    };
  }

  prompting() {
    this.log(yosay(`Qgoda generator version ${pkg.version}`));

    const prompts = [
      //            {
      //                type: 'confirm',
      //                name: 'someAnswer',
      //                message: 'Would you like to enable this option?',
      //                default: true
      //            }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('favicon.png'),
      this.destinationPath('images/favicon.png')
    );
    this.fs.copy(this.templatePath('index.md'), this.destinationPath('index.md'));
  }

  install() {
    // This.installDependencies(this.installTasks);
  }
};
