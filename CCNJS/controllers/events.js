/**
 * Created by magnusbjork on 2/23/16.
 */

module.exports = function() {

    return {
        post: function( req, res ) {
            console.log( 'incoming request:' );
            console.log( req.body );
            res.json( { msg: 'Welcome!' } );
        }
    }
};