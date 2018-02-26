var express    = require("express");
var bp = require( 'body-parser' );
var mysql      = require('mysql');

var db_config = {
  host     : 'juraczka.eu',
  user     : 'd029878b',
  password : 'mnif4674',
  database : 'd029878b'
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

var app = express();

// CORS Header
app.use( function( request, response, next ) {
  response.setHeader( 'Access-Control-Allow-Origin', '*' );
  response.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE' );
  next();
});
app.use( express.static( 'files' ) );
app.get( '/', function(req,res) {
  res.sendFile( __dirname+'/files/mm_auswahl.html' );
});
app.use( bp.urlencoded({ extended:true })); // POST Daten parsen

app.get("/",function(req,res){
  connection.query('SELECT * from sprachen LIMIT 2', function(err, rows, fields) {
    if (!err) {

    } else{
      console.log('Error while performing Query.');
    };
  });
  // connection.end();
});

app.get( '/sprachen', function( request, response ) {
  connection.query( 'SELECT language, name FROM sprachen ORDER BY name ASC', function( err, rows, fields ) {
    if (!err) {
      response.send( {sprachen:rows } );
    } else{
      console.log('Error while performing Query.');
    }
  });
  // connection.end();
});

app.get( '/vokabel', function( request, response ) {
  connection.query( 'SELECT * FROM vokabel', function( err, rows, fields ) {
    if (!err) {
      response.send( {vokabel:rows } );
    } else{
      console.log('Error while performing Query.');
    }
  });
  // connection.end();
});

app.post( '/sprachen/insert', function( request, response ) {

  stmt1 = 'INSERT INTO sprachen (language, name) values("' +
    request.body.language + '","' + request.body.name + '")'

  stmt2 = 'ALTER TABLE vokabel ADD COLUMN ' + request.body.language + ' varchar(256)';

  connection.query( stmt1, function( err, result ) {
    if (!err) {

    } else{
      console.log('Error while performing stmt1 / ins');
    };
  }); // stmt 1
  connection.query( stmt2, function( err, result ) {
    if (!err) {

    } else {
      console.log('Error while performing stmt2 / ins');
    }
  }); // stmt2
// connection.end();
response.send( {result:true} );
});

app.post( '/sprachen/delete', function( request, response ) {
  connection.query( 'DELETE FROM sprachen WHERE language = "' + request.body.language + '"', function( err, result ) {
    if (!err) {
      //console.log('The stmt1-del-solution is: ');

    } else{
      console.log('Error while performing stmt1 / del');
    };
  }); // stmt 1
  //// connection.end();

  connection.query( 'ALTER TABLE vokabel DROP ' + request.body.language, function( err, result ) {
    if (!err) {
      //console.log('The stmt2-del-solution is: ');

    } else {
      console.log('Error while performing stmt2 / del');
    }
  }); // stmt2
  // connection.end();
  response.send( {result:true} );
});

app.post( '/vokabel/delete', function( request, response ) {
  console.log(request.body);
  connection.query( 'DELETE FROM vokabel WHERE id = "' + request.body.id + '"', function( err, result ) {
    if (!err) {
      //console.log('The stmt1-del-solution is: ');

    } else{
      console.log('Error while performing delete vokabel / del');
    };
  }); // stmt 1
  //// connection.end();

  response.send( {result:true} );
});

var server = app.listen(5000, function() {
  console.log( 'Server gestartet. Port 5000' );
});
