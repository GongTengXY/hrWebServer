const Koa = require('koa')
const serve = require('koa-static')
const { historyApiFallback } = require('koa2-connect-history-api-fallback')
const path = require('path')
const proxy = require('koa2-proxy-middleware')

const app = new Koa()

app.use(proxy({
    targets : {     // targets 可以代理多个地址
        '/prod-api/(.*)' : {    //这样的正则表达式表示 : 以/prod-api开头的任何地址都会做代理
            target : 'http://ihrm.itheima.net/api',     //后端服务器地址
            changeOrigin: true,   // 只有这个值为true的情况下 才表示开启跨域
            pathRewrite: { 	      // 重写路径
                '/prod-api': ""     //这里这样写是为了从http://localhost:3333/prod-api/login... => http://ihrm.itheima.net/api/login...
            }     // 因为我们代理的地址，在代理请求的时候会加上/prod-api，所以在这里重写路径删掉
        }                
    }
}))  

// app.use(proxy({
//     targets : {     // targets 可以代理多个地址
//         '/prod-api/(.*)' : {    //这样的正则表达式表示 : 以/prod-api开头的任何地址都会做代理\
//             target : 'http://ihrm.itheima.net/',     //后端服务器地址
//             changeOrigin: true,   // 只有这个值为true的情况下 才表示开启跨域
//         }                
//     }
// }))     //我们这里可以我们的跨域处理已经搞定，因为现在后端接口也支持ihrm-java.itheima.net/prod-api这样的格式所以我们只做这些配置就好了

app.use(historyApiFallback({
    whiteList : ['/prod-api']    // whiteList 就是白名单的意思，也就是说在生产环境下，我们不需要帮忙处理，我们自己处理
}))
// 注册这个中间件可以让我们spa这样的单页面去只指向我们的   index.html
// 而且应该此中间件要在静态托管之前注册，不然会使请求发过来的已经是找不到的了

app.use(serve(__dirname + '/public'))   //将pubilc下的代码实施静态托管

app.listen(3333, ()=> {
    console.log('HR人员管理平台启动！')
})