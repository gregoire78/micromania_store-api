const cheerio = require('cheerio')
const axios = require('axios')

async function getStore(ctx) {
    try {
        const storePage = await axios.get(ctx.request.body.url)
        const $ = cheerio.load(storePage.data)
        const title = $('.page-title h1').text().trim().replace(/\s+\n\s+/g, '')
        const address = $('.address').text().trim().replace(/\s+\n\s+/g, '<br/>')
        const phone = $('.phone').text().trim().replace(/\s+\n\s+/g, '')
        const img = $('.slides img').attr('src')
        const status = $('#shopStatus').text().trim().replace(/\s+\n\s+/g, '')
        const hours = $('#shopHour>li').toArray().map((x) => {
            return $(x).children().toArray().map((x) => {
                return $(x).text()
            })
        }).filter((h) => { return h.length > 0 })
        ctx.ok({
            title,
            address,
            phone,
            img,
            status,
            hours
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = async (router) => {
    router.post('/store', getStore.bind(this))
}
