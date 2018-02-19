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
  res.sendFile( __dirname+'/files/mm_auswahl.html' );
});
app.use( bp.urlencoded({ extended:true })); // POST Daten parsen

// RESTFUL
var getData = function( stmt, callback ) {
  var file = __dirname+'/db/memory';
  var db = new sqlite3.Database(file);
  var retdata=[];

  db.all(stmt, function(err, data) {
    if (err) {
        callback([err]);
    }
    console.log(data);
    data.forEach(function (row) {
      retdata.push(row)
    });
    callback( retdata );
  });
  db.close();
} // getData

var writeData = function( dataname, callback ) {
  var file = __dirname+'/db/memory';
  var db = new sqlite3.Database(file);
  try {
      db.run(stmt, callback );
  } catch (e) {
      return(e, callback)
  }

} // writeData

app.get( '/sprachen', function( request, response ) {
  console.log( 'GET all' );
    getData( 'SELECT language, name FROM sprachen', function( alleSprachen ) {
      response.send( {sprachen:alleSprachen } );
    });
});

app.post( '/sprachen/insert', function( request, response ) {
  console.log( 'POST', request.body );
  stmt = 'INSERT INTO sprachen (language, name) values("' +
    request.body.language + '","' + request.body.name + '")';
  console.log(stmt);
  writeData( stmt, function() {
    response.send( {result:true} );
  });
});

app.post( '/sprachen/delete', function( request, response ) {
  console.log( 'POST', request.body );
  stmt = 'DELETE FROM sprachen WHERE language="'+ request.body.language + '"';
  console.log(stmt);
  writeData( stmt, function() {
    response.send( {result:true} );
  });
});
