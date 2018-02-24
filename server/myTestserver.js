var express    = require("express");
var bp = require( 'body-parser' );
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'juraczka.eu',
  user     : 'd029878b',
  password : 'mnif4674',
  database : 'd029878b'
});
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

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});

app.get("/",function(req,res){
  connection.query('SELECT * from sprachen LIMIT 2', function(err, rows, fields) {
    if (!err) {

    } else{
      console.log('Error while performing Query.');
    };
  });
});

app.get( '/sprachen', function( request, response ) {
  connection.query( 'SELECT language, name FROM sprachen ORDER BY name ASC', function( err, rows, fields ) {
    if (!err) {
      response.send( {sprachen:rows } );
    } else{
      console.log('Error while performing Query.');
    }
  });
  //connection.end();
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
//connection.end();
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
  //connection.end();

  connection.query( 'ALTER TABLE vokabel DROP ' + request.body.language, function( err, result ) {
    if (!err) {
      //console.log('The stmt2-del-solution is: ');

    } else {
      console.log('Error while performing stmt2 / del');
    }
  }); // stmt2
  //connection.end();
  response.send( {result:true} );
});

var server = app.listen(5000, function() {
  console.log( 'Server gestartet. Port 5000' );
});
