const fs = require("fs"),
    path = require('path'),
    mime = require('mime-types');

module.exports = function (context, req) {
    var file = context.bindingData.file;
    if (!file) {
        file = 'index.html'
    }
    var fileName = path.join(process.env.HOME, 'site', 'wwwroot', 'public_html', file)
    fs.stat(fileName, function (err, stats) {
        if (err) {
            context.log(err)
            context.res = {
                status: 404,
                body: "Not found."
            }
        } else {
            context.res = {
                isRaw: true,
                headers: {
                    'content-type': mime.contentType(path.extname(fileName)) || 'application/octet-stream',
                    'content-length': stats.size,
                    'cache-control': 'public, max-age=3600'
                },
                body: fs.readFileSync(fileName, null) // TODO: change this to a stream when Azure Functions can deal with stream bindings
            }
        }
        context.done();
    });
}