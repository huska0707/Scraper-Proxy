import debug from 'debug'

const log = debug('proxy-scraper:gatherproxy.com')

const CAPTCHA_REPLACE = {
	multiplied: '*',
	plus: '+',
	minus: '-',
	x: '*',
	zero: 0,
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9
}