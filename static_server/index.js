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
                // TODO: change this to a stream when the Azure Functions runtime is updated to deal with stream bindings
                body: fs.readFileSync(fileName, null)
            }
        }
        context.done();
    });
}