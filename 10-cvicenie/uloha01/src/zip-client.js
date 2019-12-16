const http = require("http");
const fs = require("fs");
const { pipeline } = require("stream")

module.exports = {
    send: zip_client,
    close: close_server
};

const url = "http://localhost:9999";

function errCb(err) {
    if (err)
        console.err(err);
}

function zip_client(name = process.argv[2]) {

    const fileName = `${__dirname}/clientFiles/${ name }`;
    const fileName2 = `${__dirname}/clientFiles/${ name }.gz`;


    let input = fs.createReadStream(fileName);
    let output = fs.createWriteStream(fileName2);


    let request = http.request(url, {
        method: "POST",
        headers: {
            'file-name': name
        }
    }).on("response", (res) => {
        pipeline(
            res,
            output,
            errCb
        );
    });

    pipeline(
        input,
        request,
        errCb
    );
}

function close_server() {
    let request = http.request(url, {
        method: "POST",
        headers: {
            'close': true
        }
    });

    request.on("error",()=>{});
    request.end();
}