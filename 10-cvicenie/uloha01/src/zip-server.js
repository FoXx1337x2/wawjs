const http = require("http");
const fs = require("fs");
const {pipeline} = require("stream");


const {
    createGzip
} = require("zlib");

module.exports = {
    start: function () {
        return zip_server()
    }
};

function zip_server() {

    let server = http.createServer();
    server.setTimeout(1000);
    server.listen(9999, "localhost")
        .on("request", (req, res) => {

            const nameOfFile = req.headers["file-name"];
            const byebye = req.headers["close"];


            const fileName = `${__dirname}/serverFiles/${nameOfFile}`;

            if (byebye) {
                server.close();
                console.log("closing server");
            } else {

                let output = fs.createWriteStream(fileName);

                output.on("finish", () => {
                    pipeline(
                        fs.createReadStream(fileName),
                        createGzip(),
                        res,
                        (err) => {
                            if (err) {
                                console.error(err);
                            }
                        }
                    );
                });

                pipeline(
                    req,
                    output,
                    (err) => {
                        if (err) {
                            console.error(err)
                        }
                    });
            }

        });
}