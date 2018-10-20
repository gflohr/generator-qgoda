'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-qgoda:app', () => {
	beforeAll(() => {
		return helpers
			.run(path.join(__dirname, '../generators/app'))
			.withPrompts({ someAnswer: true });
	});

	it('creates files', () => {
		assert.file(['_config.yaml']);
		assert.file(['package.json']);
		assert.file(['index.md']);
		assert.file(['favicon.ico']);
		assert.file(['static/images/favicon.png']);
		assert.file(['_views/default.html']);
		assert.file(['_views/raw']);
		assert.file(['_views/functions/setup.tt']);
		assert.file(['_views/functions/scripts.tt']);
		assert.file(['_views/functions/styles.tt']);
		assert.file(['_views/partials/body.html']);
		assert.file(['_views/partials/head.html']);
		assert.file(['_views/wrappers/html5.html']);
	});
});
