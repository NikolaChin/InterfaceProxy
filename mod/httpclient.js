let http = require('http');
let querystring = require('querystring');

module.exports = (httpOption, param) => {

  return new Promise(function (resolve, reject) {

    let data = [];

    httpOption.headers["Content-Length"] = querystring.stringify(param).length;

    let req = http.request(httpOption, (res) => {

      let statusCode = res.statusCode.toString();

      console.log('---start---');
      console.log(`statusCode is ${statusCode}`);

      res.on('data', (chunk) => {
        data.push(chunk);
      })

      res.on('end', () => {
        console.log('---end---');

        if (statusCode.indexOf(4) !== -1 || statusCode.indexOf(5) !== -1) {

          resolve({
            'statusCode': res.statusCode,
            'message': res.statusMessage
          });

        } else {

          try {

            let jsonData = JSON.parse(data.toString('utf-8'));
            resolve(jsonData);

          } catch (error) {

            console.log(error);

            resolve({
              'statusCode': res.statusCode,
              'message': error
            });
            
          }

        }

      })

    });

    req.on('error', (e) => {
      console.log(e.message);
      reject(e.message);
    })

    if (param) {
      req.write(querystring.stringify(param));
    }

    req.end();

  })

}