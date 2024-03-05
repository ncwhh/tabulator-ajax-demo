const http = require('http');
const url = require('url');
const controller = require('./controller');

const hostname = 'localhost';
const port = 9090;

const server = http.createServer(async (req, res) => {
    const reqUrl = url.parse(req.url).pathname
    const params = url.parse(req.url, true).query.params;

    console.log(req.method, reqUrl, params)

    try {
        if (req.method === 'GET' && reqUrl === "/data") {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');

            const reqParams = JSON.parse(params ? params : "{}");
            const result = await controller.getData(
                reqParams.from_date,
                reqParams.until_date,
                reqParams.size,
                reqParams.page,
                reqParams.sort,
                reqParams.filter,
            );

            res.end(JSON.stringify(
                {
                    last_page: Math.ceil(result.totalCount / reqParams.size),
                    last_row: result.totalCount,
                    data: result.data
                }
            ));
        } else if (req.method === 'GET' && reqUrl === "/daterange") {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(await controller.getDateRange()));
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Not Found');
        }
    } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Internal Server Error: ${error.message}`);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});