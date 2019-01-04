'use strict'
// const merge = require('webpack-merge')
// const prodEnv = require('./prod.env')
//
// module.exports = merge(prodEnv, {
//   NODE_ENV: '"development"',
//   BASE_API: '"http://s.operation.dev.xiaotitong.com"',
//   // BASE_API: '"http://op.dev.xiaotitong.com"',
// })
module.exports = {
    NODE_ENV: '"development"',
    ENV_CONFIG: '"dev"',
    BASE_API: '"http://s.op.dev.xiaotitong.com"',
    BASE_YAPI: '"http://yapi.xiaotitong.com/mock/29"',
    ossHost: '"http://xiaotitong-dev.oss-cn-shenzhen.aliyuncs.com"',
    ossUrl: '"http://s.op.dev.xiaotitong.com"',
}