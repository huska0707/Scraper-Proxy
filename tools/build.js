import data from 'babel-preset-env/data/plugins.json'

const VERSIONS = Object.values(data)
	.map(p => p.node)
	.filter((e, i, array) => e && array.indexOf(e) == i)
	.sort()
	.reverse()

const NODE_MODULES = [
    'vm',
    'fs',
    'os',
    'path',
    'child_process',
    'url',
    'stream'
]

const FOLDER = 'lib'

const WORKER = 'src/worker.js'