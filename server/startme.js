"use strict";

var fs = require( 'fs' );
var cp = require( 'child_process' );

var serverFile = 'myTestserver.js'; //'server1.js';

var server = cp.fork( serverFile );
console.log( 'Serverscript gestartet.' );

fs.watchFile( serverFile, function() {
  server.kill();
  console.log( 'Serverscript beendet.' );
  server = cp.fork( serverFile );
  console.log( 'Serverscript gestartet.' );
});
