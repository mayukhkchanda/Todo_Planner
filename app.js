const express = require('express');

const app = express();

const PORT = process.env.PORT || 5505 ;

app.listen(PORT, console.log("Server running on port:"+PORT));

app.use( '/',express.static(__dirname+'/public') );