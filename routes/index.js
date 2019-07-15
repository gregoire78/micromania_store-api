module.exports = async (router) => {
    router.prefix('/v1')
    require('./geojson')(router)
}
