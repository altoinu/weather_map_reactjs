module.exports = {
	'apps': [
		{
			'name': 'base_nodejs_pm2_angularjs1',
			'script': 'server/index.js',

			//'exec_mode': 'fork',
			// Use different version of node via nvm.
			// If not specified, defaults to system 'node'
			//'interpreter': 'node@10.16.0',
			//'interpreter': 'node@10.15.2',

			'exec_mode': 'cluster',
			'instances': 0,
			//'interpreter' is not available when using cluster mode
			'node_args': [
				//'--inspect'
				//'--debug-port=6000',
				//'--inspect=6000'
				//'--max_old_space_size=8192'
			],

			//'watch': true,
			'watch': [
				'server/'
			],
			//'ignore_watch': [],
			'env': {
				'NODE_ENV': 'development',
				'PORT': 4000,
				'CORS_ALLOW_ORIGIN': [
					'http://localhost',
					'http://localhost:3000'
				]
			}
		}
	]
};