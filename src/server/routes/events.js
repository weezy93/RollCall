var express = require('express');
var router = express.Router();
var helpers = require('../lib/helpers');
var passport = require('../lib/auth');
var queries = require('./queries/queries');
