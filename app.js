/*
* Todo Planner
* A simple Todo Planner app built with JQuery and Vanilla JS.
*
* By Mayukh Kanti Chanda, 
*
* License : https://github.com/mayukhkchanda/Todo_Planner/blob/Server/LICENSE (MIT)
* source  : https://github.com/mayukhkchanda/Todo_Planner
*/


const express = require('express');

const app = express();

const PORT = process.env.PORT || 5505 ;

app.listen(PORT, console.log("Server running on port:"+PORT));

app.use( '/',express.static(__dirname+'/public') );