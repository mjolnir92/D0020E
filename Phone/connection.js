/**
 *
 * Created by magnusbjork on 2/25/16.
 */

module.exports = function( http, options ){

    return{
        post: function( path, json, callback ){

            var data = JSON.stringify(json);

            var options = {
                host: options.host,
                port: options.port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                }
            };

            var req = http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', callback);
            });

            req.write(data);
            req.end();
        }
    }
};
