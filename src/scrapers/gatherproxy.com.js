import debug from 'debug'
import url from 'url'
import fs from 'fs'

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

export default function scrap() {
	const session = new Session(nodeFetch)
	const fetch = (url, options) => session.fetch(url, options)
	return getAccount(fetch).then(() => {
		let chain = Promise.resolve([])
		for (let level of ANONIMITY_LEVELS) {
			chain = chain.then(data =>
				getProxyListId(fetch, level)
					.then(id => downloadProxyList(fetch, level, id))
					.then(text =>
						data.push(
							extractProxies(text, () => ({
								anonimity: ANONIMITY_LEVELS.indexOf(level),
								type: 'http'
							}))
						)
					)
					.then(() => data)
			)
		}
		return chain.then(datas => datas.reduce((prev, next) => prev.concat(next)))
	})
}
