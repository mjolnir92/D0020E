/**
 * Created by magnusbjork on 2/23/16.
 */

module.exports = function() {






    return {
        post: function( req, res ) {
            console.log( 'hello world' );
            console.log( req.body );
            res.json( { thank: 'you' } );
        }
    }
};