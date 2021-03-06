const http = require('http')
const querystring = require('querystring')

module.exports = (httpOption, param, headers) => {

    return new Promise((resolve, reject) => {

        //用于存储接收数据的数组    
        let data = []

        //定义返回数据的结构    
        let resContent = {
            'id': httpOption.id, //接口id
            'desc': httpOption.desc, //接口简短说明
            'statusCode': '', //状态码
            'message': '', //说明信息
            'content': '' //返回的数据内容
        }

        //设置http请求内容长度    
        httpOption.headers['Content-Length'] = querystring.stringify(param).length

        //设置额外请求头
        for (const key in headers) {
            if (headers.hasOwnProperty(key)) {
                const element = headers[key]

                httpOption.headers[key] = element
            }
        }


        let reqTimer = null
        let req = null


        // 请求超时则中断
        reqTimer = setTimeout(() => {

            req.abort()

            console.log('\x1B[31m%s\x1B[39m', `[Timeout]:${httpOption.hostname}${httpOption.path}`)

        }, httpOption.timeOut || 3000)



        //创建http request 请求    
        req = http.request(httpOption, res => {

            //建立请求则清除超时
            clearTimeout(reqTimer)

            let statusCode = res.statusCode.toString()

            let startMS = new Date().getTime()


            res.on('data', chunk => {
                data.push(chunk)
            })


            res.on('end', () => {

                let endMS = new Date().getTime()

                console.log(
                    '\x1B[32m%s\x1b[39m:',
                    `[Success]: ${httpOption.method} ==> ${httpOption.hostname}${httpOption.path} -- ${endMS - startMS}ms`
                )

                resContent.statusCode = res.statusCode
                resContent.message = res.statusMessage

                if (statusCode.indexOf(4) !== -1 || statusCode.indexOf(5) !== -1) {

                    resolve(resContent)

                } else {

                    try {

                        console.log(data.join('').toString('utf-8'))
                        resContent.content = JSON.parse(data.join('').toString('utf-8'))

                        resolve(resContent)

                    } catch (error) {

                        console.log('\x1B[31m%s\x1B[39m', error)

                        resContent.content = data.join('').toString('utf-8')

                        resContent.message = error

                        resolve(resContent)

                    }

                }

            })

        })


        req.on('error', e => {
            console.log('\x1B[31m%s\x1B[39m', `[Error]:${httpOption.method} ==> ${httpOption.hostname}${httpOption.path} ${e.message}`)

            resContent.statusCode = 500
            resContent.message = e.message
            resContent.content = null

            resolve(resContent)
        })

        //如果有请求数据则写入到请求    
        if (param) {
            req.write(querystring.stringify(param))
        }

        req.end()

    })

}