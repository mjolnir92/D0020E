/**
 * Created by magnusbjork on 2/25/16.
 */


var phone = require( './Phone' )({prefix: 'prefix'});
phone.generate(60);
phone.getContent( function( content ) {
    console.log( JSON.stringify( content ));
} );
