/**
 * Created by magnusbjork on 3/2/16.
 */

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '130.240.5.59',
    user     : 'CCNusr',
    password : 'd0020eccnusr',
    database : 'mydb'
});


connection.connect();

module.exports = connection;
