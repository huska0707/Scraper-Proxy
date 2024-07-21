import os from 'os'
import scrapers from './src/scrapers'

const TYPES = ['http', 'socks']
const VALID_TYPES = ['socks', 'socks5', 'socks4', 'https', 'http']

export default class ProxyScraper {
	constructor({ workerCount = os.cpus().length } = {}) {
		this._workers = []
		for (let i = 0; i < workerCount; i++) {
			log('Spawning worker %d', i)
			const worker = child.fork(path.join(__dirname, './src/worker.js'), [i])
			worker.on('error', error => console.error(error))
			this._workers.push(new Lock(worker))
		}
	}

    getProxies(timeout) {
        return this.scrapProxies().then(proxies => this.testProxies(timeout, proxies))
    }

	scrapProxies() {
		const proxies = []
		log('Scrapers: %o', Object.keys(ProxyScraper.scrapers))
		for (let scraper in ProxyScraper.scrapers) {
			proxies.push(
				scrapers
					[scraper]()
					.then((proxies = []) => {
						log('Found %d proxies from %s', proxies.length, scraper)
						return proxies
							.map(proxy => this._aggregateProxy(proxy, scraper))
							.reduce((prev, next) => prev.concat(next), [])
					})
					.catch(e => {
						log('Error while scraping proxies with %s\n%o', scraper, e)
						return []
					})
			)
		}
		return Promise.all(proxies).then(values =>
			values.reduce((prev, next) => prev.concat(next))
		)
	}

	_aggregateProxy(proxy, source) {
		const aproxy = {
			source,
			url() {
				return `${this.type}://${this.ip}:${this.port}`
			},
			...proxy
		}

		return VALID_TYPES.includes(aproxy.type)
			? aproxy
			: TYPES.map(type => ({
					...aproxy,
					type
				}))
	}

}

ProxyScraper.scrapers = scrapers