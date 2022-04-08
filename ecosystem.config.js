module.exports = {
    apps: [
        {
            name: 'quotes',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs',
            env: {
                NODE_PORT:"3070",
                //NODE_ENV:"development"
            }
        }
    ]
}