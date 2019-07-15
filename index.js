const cheerio = require('cheerio')
const axios = require('axios')
const {
    promisify
} = require('util')
const fs = require('fs')
const writeFile = promisify(fs.writeFile);

(async () => {
    try {
        const storesPage = await axios.get('https://www.micromania.fr/liste-magasins-micromania.html')
        const $ = cheerio.load(storesPage.data)
        let stores = []
        $('body .page .main .full-list').find('a').map((index, element) => {
            stores.push($(element).attr('href'))
        })
        let result = []
        let geojsonFeatures = []
        const map = new Map()
        for (let v in stores) {
            console.log(stores[v])
            const store = await axios.get(stores[v])
            const $ = cheerio.load(store.data)
            // const address = $('li.address').text().trim().replace(/\s+\n\s+/g, '\n')
            const stringDataStores = $('body .page .main .col-main').find('script').html().match(/\[.*\]/gm)
            if (stringDataStores) {
                try {
                    const parsingStores = JSON.parse(stringDataStores[0].replace(/\\'/g, "'"))
                    parsingStores.map(parsingStore => {
                        if (parsingStore) {
                            const obj = {
                                id: parsingStore[3],
                                description: parsingStore[0],
                                link: parsingStore[0].match(/href="([^"]*)/)[1],
                                lat: parsingStore[1],
                                lon: parsingStore[2]
                            }
                            const geojsonObj = {
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [parsingStore[2], parsingStore[1]]
                                },
                                properties: {
                                    'id': parsingStore[3],
                                    'description': parsingStore[0],
                                    'link': parsingStore[0].match(/href="([^"]*)/)[1],
                                    'lat': parsingStore[1],
                                    'lon': parsingStore[2],
                                    'marker-color': '#004080',
                                    'marker-size': 'medium',
                                    'marker-symbol': 'shop'
                                }
                            }
                            if (!map.has(obj.id)) {
                                map.set(obj.id, true)
                                result.push(obj)
                                geojsonFeatures.push(geojsonObj)
                                console.log('+1')
                            }
                        }
                    })
                } catch (e) {
                    console.log(stringDataStores[0], e)
                }
            }
        }
        await writeFile('store.json', JSON.stringify(result))
        await writeFile('store.geojson', JSON.stringify({
            type: 'FeatureCollection',
            features: geojsonFeatures
        }))

        /* const responses = await Promise.all(stores.map((store, k) => axios.get(store)));
            const links = await Promise.all(responses.map(async (response, k) => {
                const $ = cheerio.load(response.data);
                const y = $("body .page .main .col-main").find("script").html().match(/\[.*\]/gm);
                if (y) {
                    try {
                        const parsing_stores = JSON.parse(y[0].replace(/\\'/g, "'"));
                        parsing_stores.map(parsing_store => {
                            if (parsing_store) {
                                const obj = {
                                    id: parsing_store[3],
                                    description: parsing_store[0],
                                    lat: parsing_store[1],
                                    lon: parsing_store[2]
                                }
                                if (!map.has(obj.id)) {
                                    map.set(obj.id, true);
                                    result.push(obj);
                                    console.log("+1")
                                }
                            }
                        })
                    } catch (e) {
                        console.log(y[0], e)
                    }
                }
            })); */
    } catch (error) {
        console.log(error)
    }
})()
