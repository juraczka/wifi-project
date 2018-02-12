var fs = require( 'fs' );
var express = require( 'express' );
var bp = require( 'body-parser' );
var app = express();


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

var sqlite3 = require('sqlite3').verbose();
var file = __dirname+'/db/memory';
var db = new sqlite3.Database(file);
db.all("SELECT * FROM kategorien", function(err, rows) {
        rows.forEach(function (row) {
            console.log(row.kategorie);
        })
    });
db.close();
