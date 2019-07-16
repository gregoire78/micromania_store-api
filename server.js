require('dotenv').config()
const Koa = require('koa')
const Router = require('koa-router')
const helmet = require('koa-helmet')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const respond = require('koa-respond')

const app = new Koa()
const router = new Router()

// security
app.use(helmet())
app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    exposeHeaders: ['X-Request-Id']
}))

// logger
app.use(async (ctx, next) => {
    await next()
    const rt = ctx.response.get('X-Response-Time')
    console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(bodyParser())
app.use(respond())

// API route
require('./routes')(router)
app.use(router.routes())
app.use(router.allowedMethods())

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
})
