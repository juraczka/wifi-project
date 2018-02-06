var fs = require( 'fs' );
var express = require( 'express' );
var bp = require( 'body-parser' );
var app = express();


var server = app.listen(26893, function() {
  console.log( 'Server gestartet. Port 26893' );
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
var getData = function( dataname, callback ) {
  var dataObj;
  fs.readFile( dataname+'.json', function(err,data) {
    try {
      dataObj = JSON.parse( data );
      callback( dataObj[ dataname ] );
    } catch(e) {
      callback( [] );
    }
  });
} // getData
var writeData = function( dataname, dataArray, callback ) {
  var dataObj = {};
  dataObj[ dataname ] = dataArray;
  fs.writeFile( dataname+'.json', JSON.stringify(dataObj), callback );
} // writeData

app.get( '/restful/elefanten', function( request, response ) {
  console.log( 'GET all' );
    getData( 'elefanten', function( alleElefanten ) {
      response.send( {elefanten:alleElefanten } );
    });
});

app.get( '/restful/elefanten/:id', function( request, response ) {
    var id = request.params.id;
    console.log( 'GET id', id  );
    getData( 'elefanten', function( alleElefanten ) {
      response.send( {elefanten:[ alleElefanten[id] ] } );
      //response.send( alleElefanten[id] );
    });
});

app.post( '/restful/elefanten', function( request, response ) {
  console.log( 'POST', request.body );
  getData( 'elefanten', function( alleElefanten ) {
    alleElefanten.push( request.body );
    writeData( 'elefanten', alleElefanten, function() {
      response.send( {result:true} );
    });
  });
});

app.put( '/restful/elefanten/:id', function( request, response ) {
  var id = request.params.id;
  console.log( 'PUT', id, request.body );
  getData( 'elefanten', function( alleElefanten ) {
    alleElefanten[id] = request.body;
    writeData( 'elefanten', alleElefanten, function() {
      response.send( {result:true} );
    });
  });
});

app.delete( '/restful/elefanten/:id', function( request, response ) {
  var id = request.params.id;
  console.log( 'DELETE', id );
  getData( 'elefanten', function( alleElefanten ) {
    delete alleElefanten[id];
    writeData( 'elefanten', alleElefanten, function() {
      response.send( {result:true} );
    });
  });
});
