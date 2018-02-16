var fs = require( 'fs' );
var express = require( 'express' );
var bp = require( 'body-parser' );
var app = express();
var sqlite3 = require('sqlite3').verbose();



var server = app.listen(5000, function() {
  console.log( 'Server gestartet. Port 5000' );
});

// CORS Header
app.use( function( request, response, next ) {
  response.setHeader( 'Access-Control-Allow-Origin', '*' );
  response.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE' );
  next();
});
app.use( express.static( 'files' ) );
app.get( '/', function(req,res) {
  res.sendFile( __dirname+'/files/memory.html' );
});
app.use( bp.urlencoded({ extended:true })); // POST Daten parsen

// RESTFUL
var getData = function( stmt, callback ) {
  var file = __dirname+'/db/memory';
  var db = new sqlite3.Database(file);
  var dataObj, retdata=[];

  console.log(stmt);
  db.all(stmt, function(err, data) {
    try {
      data.forEach(function (row) {
        console.log('Row: ',row);
        retdata.push(row.kategorie)
        console.log('Retdata: ', retdata);
        callback( retdata );
      })
    } catch(e) {
      callback( [] );
    }
  });
  db.close();
} // getData

app.get( '/test', function( request, response ) {
  console.log( 'GET all' );
    getData( 'SELECT * FROM kategorien', function( alleKategorien ) {
      console.log( {kategorien:alleKategorien } );
      response.send( {kategorien:alleKategorien } );
    });
});
