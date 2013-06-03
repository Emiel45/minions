/**
 * The Server implementation for the Life webapp.
 * Copyright (c) 2013 Emiel Tasseel, All rights reserved.
 */

var express = require('express');
var app = express();

app.use(express.static('web'));
app.listen(80);