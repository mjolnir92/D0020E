/**
 *
 * Created by magnusbjork on 2/25/16.
 */

module.exports = function( http, options ){

    return{
        post: function( path, json, callback ){

            var data = JSON.stringify(json);

            var config = {
                host: options.host,
                port: options.port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                }
            };

            var req = http.request( config, function(res) {
                res.setEncoding('utf8');
                res.on('data', callback);
            });

            req.write(data);
            req.end();
        },
        hello: function( data, callback ) {
            data.type = 'HELLO';
            this.post( '/events', data, callback );
        },
        ack: function( prefix, callback ) {
            var data = {
                type: 'ACK',
                data: {
                    prefix: prefix
                }
            };
            this.post( '/events', data, callback );
        },
        bye: function( prefix, callback ) {
            var data = {
                type: 'BYE',
                data: {
                    prefix: prefix
                }
            };
            this.post( '/events', data, callback );
        },
        alarm: function( type, data ) {
            var data = {
                time: new Date(),
                type: type,
                data: data
            };
            this.post( '/events', data, callback );
        }
    }
};
