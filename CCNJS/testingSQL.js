/**
 *
 *
 *
 * Created by magnusbjork on 2/22/16.
 */

var mysql      = require('mysql');
//host     : '130.240.5.59',
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'CCNusr',
    password : 'd0020eccnusr',
    database : 'mydb'
});


module.exports = connection.connect();
