import fetch from 'node-fetch'

export default function createTextScaper(url, aggregator) {
    return function scrap() {
        return fetch(url) 
            .then(res => res.text())
            .then(text => extractProxied(text, aggregator))
    }
}