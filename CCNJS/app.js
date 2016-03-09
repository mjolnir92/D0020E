var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require( 'hbs' );
var fs = require( 'fs' );


var app = express();
var server = require( 'http').Server( app );
var io = require( 'socket.io' )( server );
var routes = require('./routes/index')( io );

server.listen( 3000 );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
//bower
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use('/', routes);

//Register partials

var partialsDir = __dirname + '/views/partials';

var fileNames = fs.readdirSync( partialsDir );

fileNames.forEach( function ( filename ) {

    var matches = /^([^.]+).hbs$/.exec( filename );
    if ( !matches ) {
        return;
    }

    var name = matches[1];
    var template = fs.readFileSync( partialsDir + '/' + filename, 'utf8' );
    hbs.registerPartial( name, template );

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

