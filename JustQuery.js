'use strict';

const database = require('./app/utils/database');
const http = require("http");

// execute();

async function execute() {
    let query = 'SELECT * FROM Lock;';
    let result = await database.executeAsync(query).catch(err => console.log(err));
    console.log('Result', result)
    // database.execute(query, function(err, data){
    //     console.log('Result',data);
    //     console.log('err',err);
    // });
}


async function test() {
    let deummayArray = ['a', 'b', 'a', 'b'];

    for (let i = 0; i < 500; i++) {
        deummayArray.push('asd');
        //  testLoad().then(result => {console.log(result);});
    }

    for (const val of deummayArray) {
        let request = await testLoad();
        console.log(request);
        let wait = await dummywait(200);
    }
}
test();

// testLoad();

function testLoad() {
    return new Promise(function(resolve, reject) {
        var options = {
            "method": "GET",
            "hostname": "apis.oizom.com",
            "port": "8000",
            "path": "/balance/user/list",
            "headers": {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJkZW1vMDAxIiwiaWF0IjoxNTQzNTcwMzEyLCJleHAiOjE1NDM2NTY3MTIsImlzcyI6IkRDVDZJRWp4T0NGb1BaR054SGVKaEIwRW5jeUpBUnNGIn0.IIeNBUoxnt6u5Z9tDQAc7e3wCmJSa760G6D1G4H2xyk"
            }
        };

        var req = http.request(options, function(res) {
            var chunks = [];

            res.on("data", function(chunk) {
                chunks.push(chunk);
            });

            res.on("end", function() {
                var body = Buffer.concat(chunks);
                // console.log(JSON.stringify(body.toString()));
                resolve(body.toString());
                console.log(JSON.stringify(res.headers));
            });
        });

        req.end();
    });
}

function dummywait(TIME){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve();
        }, TIME);
    });
}